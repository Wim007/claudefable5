# Claude Fable 5 Chat

🚀 Een volledig functionele chat interface aangedreven door **GPT-4o mini** met de **Claude Fable 5 system prompt**.

## ✨ Features

- **Gemini-stijl interface** - Donker thema, gradiënten, sidebar met gesprekken
- **Streaming responses** - Tekst verschijnt real-time zoals bij ChatGPT/Claude
- **Markdown ondersteuning** - Code blocks, formattering, alles werkt
- **Gesprekgeschiedenis** - Opgeslagen in localStorage, tot 50 gesprekken
- **Claude Fable 5 gedrag** - De volledige 183KB system prompt wordt bij elke request gebruikt
- **Supergoed koop** - GPT-4o mini kost ~$0.15 per miljoen tokens vs $15 voor GPT-4o

## 🛠️ Installatie

### Lokaal draaien

```bash
# Clone de repo
git clone https://github.com/Wim007/claudefable5.git
cd claudefable5

# Installeer dependencies
npm install

# Kopieer .env.example naar .env
cp .env.example .env

# Voeg je OpenAI API key toe aan .env
# OPENAI_API_KEY=sk-proj-...

# Start de server
npm start

# Of voor development met auto-reload:
npm run dev
```

De app draait nu op `http://localhost:3000`

### Railway Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/)

1. Klik op de Railway button hierboven
2. Voeg je `OPENAI_API_KEY` toe als environment variable
3. Deploy - klaar!

## 🔑 OpenAI API Key krijgen

1. Ga naar [platform.openai.com](https://platform.openai.com/)
2. Log in of maak een account
3. Ga naar API Keys (linkerzijbalk)
4. Klik op "Create new secret key"
5. Kopieer de key (begint met `sk-proj-...`)
6. Plak in je `.env` bestand of Railway environment variables

## 💰 Kosten

GPT-4o mini pricing:
- **Input**: $0.150 per 1M tokens
- **Output**: $0.600 per 1M tokens

Gemiddeld gesprek:
- System prompt: ~50K tokens (Claude Fable 5 prompt)
- User + assistant: ~2K tokens
- **Totaal per gesprek**: ~$0.032 (3 cent!)

Voor vergelijking:
- Claude Fable 5 via API: ~$0.50 per gesprek
- ChatGPT Plus: $20/maand unlimited

## 📁 Project structuur

```
claudefable5/
├── server.js              # Express server + OpenAI streaming
├── package.json           # Dependencies
├── claude-fable-5.md      # De volledige system prompt (183KB)
├── public/
│   └── index.html         # Gemini-style chat UI
├── .env.example           # Environment variabelen template
└── README.md              # Dit bestand
```

## 🧪 Hoe het werkt

1. **Frontend** stuurt bericht naar `/api/chat`
2. **Backend** (server.js):
   - Leest `claude-fable-5.md` in als system prompt
   - Stuurt naar OpenAI met model `gpt-4o-mini`
   - Streamt response terug via Server-Sent Events
3. **Frontend** toont streaming tekst met markdown rendering
4. Gesprek wordt opgeslagen in localStorage

## 🎯 Gebruik voor eigen projecten

Je kan dit als basis gebruiken voor:
- **Domein-specifieke assistenten** - Vervang de system prompt met jouw eigen instructies
- **Customer support bots** - Train op je producten/diensten
- **Interne tools** - Koppel aan je databases, APIs
- **Fine-tuning data generatie** - Gebruik de Fable 5 prompt om trainingsdata te maken

## 📝 Licentie

MIT - gebruik het zoals je wilt!

## 🙏 Credits

- System prompt: [asgeirtj/system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks)
- UI inspiratie: Google Gemini
- Model: OpenAI GPT-4o mini

---

**Gemaakt door Wim** | [GitHub](https://github.com/Wim007)
