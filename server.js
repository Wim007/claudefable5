require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Load the Claude Fable 5 system prompt from file
const SYSTEM_PROMPT = fs.readFileSync(
  path.join(__dirname, 'claude-fable-5.md'),
  'utf8'
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', model: 'gpt-4o-mini' });
});

// Streamt een Responses API-run met de web_search tool naar de client
async function streamWithWebSearch(messages, res, toolType) {
  const stream = await openai.responses.create({
    model: 'gpt-4o-mini',
    instructions: SYSTEM_PROMPT,
    input: messages,
    tools: [{ type: toolType, search_context_size: 'medium' }],
    stream: true,
    max_output_tokens: 16000,
  });

  for await (const event of stream) {
    if (event.type === 'response.output_item.added' && event.item?.type === 'web_search_call') {
      res.write(`data: ${JSON.stringify({ search: true })}\n\n`);
    } else if (event.type === 'response.output_text.delta' && event.delta) {
      res.write(`data: ${JSON.stringify({ content: event.delta })}\n\n`);
    } else if (event.type === 'response.output_text.annotation.added' &&
               event.annotation?.type === 'url_citation') {
      res.write(`data: ${JSON.stringify({
        citation: { url: event.annotation.url, title: event.annotation.title || '' }
      })}\n\n`);
    } else if (event.type === 'response.failed' || event.type === 'error') {
      throw new Error(event.response?.error?.message || event.message || 'Response failed');
    }
  }
}

// Chat endpoint with streaming
app.post('/api/chat', async (req, res) => {
  const { messages, webSearch } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  // Set headers for SSE streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    if (webSearch) {
      try {
        await streamWithWebSearch(messages, res, 'web_search');
      } catch (error) {
        // Oudere accounts/modellen kennen alleen de preview-variant van de tool
        if (/web_search/i.test(error.message) && /not (supported|allowed|found)|invalid/i.test(error.message)) {
          await streamWithWebSearch(messages, res, 'web_search_preview');
        } else {
          throw error;
        }
      }
    } else {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        stream: true,
        max_tokens: 16000,
        temperature: 1,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        if (delta) {
          res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
        }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('OpenAI error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Model: gpt-4o-mini with Claude Fable 5 system prompt`);
  console.log(`System prompt loaded: ${SYSTEM_PROMPT.length} characters`);
});
