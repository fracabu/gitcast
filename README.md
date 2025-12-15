# GitCast

**GitHub repository analyzer with AI-powered podcasts and presentations**

[English](#english) | [Italiano](#italiano)

---

## English

### Overview

GitCast analyzes your GitHub repositories and generates AI-powered podcasts and interactive presentations for each one. Transform your code repositories into engaging audio content and visual slide decks using Google Gemini AI.

### Key Features

- **Repository Grid View** - Browse all your repositories with filters
- **AI Podcast Generation** - 5-minute spoken podcasts for each repository via Web Speech API
- **Interactive Presentations** - Auto-generated HTML slide decks for each repository
- **Search & Filter** - Find repositories by name or language
- **Lazy Loading** - Fast initial load with on-demand details fetching

### Tech Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **AI Integration**: Google Gemini AI
- **Speech**: Web Speech API
- **API**: GitHub REST API

### Quick Start

```bash
# Clone repository
git clone https://github.com/fracabu/gitcast.git
cd gitcast

# Install dependencies
npm install

# Configure environment
# Create .env.local with:
GEMINI_API_KEY=your_gemini_api_key_here
GITHUB_TOKEN=your_github_token_here

# Start application
npm run dev
```

Application available at `http://localhost:5174`

### Environment Variables

| Variable | Description | Source |
|----------|-------------|--------|
| `GEMINI_API_KEY` | Google AI API key | [Google AI Studio](https://ai.google.dev/makersuite) |
| `GITHUB_TOKEN` | GitHub personal access token | [GitHub Tokens](https://github.com/settings/tokens?type=beta) |

**Required GitHub Token Scopes:** `repo`, `read:user`

### Features in Detail

| Feature | Description |
|---------|-------------|
| Repository Grid | Visual cards with language badges and stats |
| AI Podcast | 5-minute audio summary of repository purpose and structure |
| Slide Deck | Interactive HTML presentation with code highlights |
| Language Filter | Filter repositories by programming language |
| Search | Quick search by repository name |

### Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### License

MIT License

---

## Italiano

### Panoramica

GitCast analizza i tuoi repository GitHub e genera podcast AI e presentazioni interattive per ciascuno. Trasforma i tuoi repository di codice in contenuti audio coinvolgenti e slide deck visivi usando Google Gemini AI.

### Funzionalita Principali

- **Vista Griglia Repository** - Sfoglia tutti i tuoi repository con filtri
- **Generazione Podcast AI** - Podcast parlati di 5 minuti per ogni repository via Web Speech API
- **Presentazioni Interattive** - Slide deck HTML auto-generati per ogni repository
- **Ricerca e Filtri** - Trova repository per nome o linguaggio
- **Lazy Loading** - Caricamento iniziale veloce con fetch dettagli on-demand

### Stack Tecnologico

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Integrazione AI**: Google Gemini AI
- **Speech**: Web Speech API
- **API**: GitHub REST API

### Avvio Rapido

```bash
# Clona repository
git clone https://github.com/fracabu/gitcast.git
cd gitcast

# Installa dipendenze
npm install

# Configura ambiente
# Crea .env.local con:
GEMINI_API_KEY=your_gemini_api_key_here
GITHUB_TOKEN=your_github_token_here

# Avvia applicazione
npm run dev
```

Applicazione disponibile su `http://localhost:5174`

### Variabili d'Ambiente

| Variabile | Descrizione | Fonte |
|-----------|-------------|-------|
| `GEMINI_API_KEY` | Chiave API Google AI | [Google AI Studio](https://ai.google.dev/makersuite) |
| `GITHUB_TOKEN` | Token accesso personale GitHub | [GitHub Tokens](https://github.com/settings/tokens?type=beta) |

**Scope Token GitHub Richiesti:** `repo`, `read:user`

### Funzionalita in Dettaglio

| Funzionalita | Descrizione |
|--------------|-------------|
| Griglia Repository | Card visive con badge linguaggio e statistiche |
| Podcast AI | Riassunto audio di 5 minuti su scopo e struttura repository |
| Slide Deck | Presentazione HTML interattiva con highlight codice |
| Filtro Linguaggio | Filtra repository per linguaggio di programmazione |
| Ricerca | Ricerca rapida per nome repository |

### Comandi

```bash
npm run dev      # Avvia server sviluppo
npm run build    # Build per produzione
npm run preview  # Preview build produzione
```

### Licenza

MIT License
