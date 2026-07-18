# 📡 TechPulse — Veille technologique automatisée

Plateforme de veille qui **agrège automatiquement** des articles et releases tech
(flux RSS, APIs publiques) via des workflows **n8n** planifiés, les stocke dans
PostgreSQL et les affiche dans un tableau de bord React.

![CI](https://github.com/BilalSaaoud/techpulse/actions/workflows/ci.yml/badge.svg)

## Stack

React 18 (Vite) · Node.js/Express · n8n (automatisation) · PostgreSQL · Docker Compose · GitHub Actions

## Architecture (multi-conteneurs)

```
┌──────────┐   cron    ┌─────────┐  POST /api/articles  ┌─────────┐
│   n8n    │──────────▶│  Flux   │─────────────────────▶│   API   │
│ workflow │           │RSS/APIs │                      │ Express │
└──────────┘           └─────────┘                      └────┬────┘
      ▲                                                      ▼
┌──────────┐            GET /api/articles              ┌──────────┐
│ Frontend │◀──────────────────────────────────────────│ Postgres │
│  React   │                                           └──────────┘
└──────────┘
```

## Fonctionnalités

- Workflow n8n planifié (toutes les 6 h) : lecture de flux RSS (Hacker News, dev.to, GitHub releases), déduplication, envoi vers l'API
- API REST Node.js : ingestion, listing paginé, filtre par source/tag
- Tableau de bord React : derniers articles, filtre par source
- Orchestration Docker Compose : frontend + api + n8n + base de données
- Notifications email possibles via un nœud n8n (SMTP)

## Lancer

```bash
docker compose up --build
# Frontend : http://localhost:5173 | API : http://localhost:3002 | n8n : http://localhost:5678
```

Importer ensuite `n8n/veille-workflow.json` dans n8n (menu → Import from file) et activer le workflow.

## Tests

```bash
cd api && npm install && npm test
```

---
*Projet développé par Bilal Saaoud — Bachelor Développeur Full-stack (ETNA).*
