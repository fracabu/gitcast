<h1 align="center">GitCast</h1>
<h3 align="center">GitHub repository analyzer with AI podcasts</h3>

<p align="center">
  <em>Generate spoken podcasts and slide presentations for your repositories</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Web_Speech-API-orange?style=flat-square" alt="Web Speech" />
</p>

<p align="center">
  :gb: <a href="#english">English</a> | :it: <a href="#italiano">Italiano</a>
</p>

---

<a name="english"></a>
## :gb: English

### Overview

GitCast analyzes your GitHub repositories and generates AI-powered podcasts and interactive presentations for each one. Transform your code repositories into engaging audio content and visual slide decks.

### Features

- **Repository Grid** - Browse all repos with filters and search
- **AI Podcast** - 5-minute spoken summary via Web Speech API
- **Slide Presentations** - Auto-generated HTML slide decks
- **Language Filter** - Filter by programming language
- **Lazy Loading** - Fast initial load with on-demand details

### Quick Start

```bash
git clone https://github.com/fracabu/gitcast.git
cd gitcast
npm install

# Create .env.local
GEMINI_API_KEY=your_gemini_key
GITHUB_TOKEN=your_github_token

npm run dev
```

**GitHub Token Scopes:** `repo`, `read:user`

### Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
```

---

<a name="italiano"></a>
## :it: Italiano

### Panoramica

GitCast analizza i tuoi repository GitHub e genera podcast AI e presentazioni interattive per ciascuno. Trasforma i tuoi repository in contenuti audio coinvolgenti e slide deck visivi.

### Funzionalita

- **Griglia Repository** - Sfoglia tutti i repo con filtri e ricerca
- **Podcast AI** - Riassunto parlato di 5 minuti via Web Speech API
- **Presentazioni Slide** - Slide deck HTML auto-generati
- **Filtro Linguaggio** - Filtra per linguaggio di programmazione
- **Lazy Loading** - Caricamento veloce con dettagli on-demand

### Avvio Rapido

```bash
git clone https://github.com/fracabu/gitcast.git
cd gitcast
npm install

# Crea .env.local
GEMINI_API_KEY=your_gemini_key
GITHUB_TOKEN=your_github_token

npm run dev
```

**Scope Token GitHub:** `repo`, `read:user`

### Comandi

```bash
npm run dev      # Server sviluppo
npm run build    # Build produzione
npm run preview  # Preview build
```

---

## Requirements

- Node.js >= 18
- Google Gemini API Key
- GitHub Personal Access Token

## License

MIT

---

<p align="center">
  <a href="https://github.com/fracabu">
    <img src="https://img.shields.io/badge/Made_by-fracabu-8B5CF6?style=flat-square" alt="Made by fracabu" />
  </a>
</p>
