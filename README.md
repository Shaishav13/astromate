# 🌟 AstroMate

> Your personalized AI best friend that grows with you — rooted in astrology, powered by memory, and designed to feel human.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![100% Free Stack](https://img.shields.io/badge/Stack-100%25%20Free-green.svg)](#tech-stack)

---

## ✨ What is AstroMate?

AstroMate is a full-stack AI companion messaging app where your AI buddy has a **unique personality based on your birthdate's astrology**, and your relationship with it **evolves over time** — from a cold stranger to a sarcastic best friend who actually remembers things about you.

### Core Features

| Feature | Free | Pro (coming soon) |
|---------|------|--------------------|
| AI companion with zodiac personality | ✅ | ✅ |
| Relationship evolution (5 levels) | ✅ | ✅ |
| Persistent memory snapshots | ✅ | ✅ |
| 20 messages/day | ✅ | Unlimited |
| 6 chat wallpapers | ✅ | ✅ |
| Proactive AI messages | ✅ | ✅ |
| Custom AI personas | ❌ | ✅ |
| Relationship analytics | ❌ | ✅ |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     AstroMate                           │
├─────────────────┬───────────────────────────────────────┤
│   Frontend      │           Backend                     │
│   Next.js 14    │        Express.js                     │
│   Tailwind CSS  │                                       │
│   Framer Motion │  ┌──────────────────────────────┐    │
│                 │  │  Services                    │    │
│  ┌───────────┐  │  │  ├── Astrology Engine        │    │
│  │ Chat UI   │◄─┼──┤  ├── Relationship Engine     │    │
│  │ Onboard   │  │  │  ├── Ollama Integration      │    │
│  │ Wallpaper │  │  │  └── Memory Snapshots        │    │
│  └───────────┘  │  └──────────────────────────────┘    │
│                 │                │                      │
│                 │  ┌─────────────▼──────────────┐      │
│                 │  │      SQLite Database        │      │
│                 │  │  Users, Messages, Mates,    │      │
│                 │  │  MemorySnapshots            │      │
│                 │  └────────────────────────────┘      │
│                 │                │                      │
│                 │  ┌─────────────▼──────────────┐      │
│                 │  │    Ollama (Local LLM)       │      │
│                 │  │    Llama 3 / Qwen           │      │
│                 │  └────────────────────────────┘      │
│                 │                                       │
│                 │  ┌────────────────────────────┐      │
│                 │  │  Cron Jobs                 │      │
│                 │  │  Proactive messaging (24h) │      │
│                 │  └────────────────────────────┘      │
└─────────────────┴───────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Ollama** — [ollama.ai](https://ollama.ai) (free local LLM runner)
- **Git**

### 1. Clone & Install

```bash
git clone https://gitlab.com/ub-group731337/UB-project.git astromate
cd astromate
npm install
```

### 2. Set Up Ollama (Lightweight & Fast)

```bash
# Recommended: Llama 3.2 1B (Ultra-fast, uses only ~1.2GB RAM)
ollama pull llama3.2:1b

# Alternative: Qwen 2.5 1.5B (Great for witty banter & multilingual slang, ~1.3GB RAM)
ollama pull qwen2.5:1.5b
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env — the defaults work for local development
# Only GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET need to be filled
# (or skip auth for now and use the credentials provider)
```

### 4. Set Up Database

```bash
npm run db:migrate
# This creates the SQLite database and all tables
```

### 5. Run the App

```bash
npm run dev
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
# DB Studio: npm run db:studio
```

---

## 📁 Project Structure

```
astromate/
├── apps/
│   ├── web/              # Next.js 14 frontend
│   │   ├── src/
│   │   │   ├── app/      # App Router pages
│   │   │   ├── components/
│   │   │   └── lib/      # API client, utilities
│   │   └── package.json
│   └── server/           # Express.js backend
│       ├── src/
│       │   ├── routes/   # API endpoints
│       │   ├── services/ # Business logic
│       │   ├── cron/     # Background jobs
│       │   └── middleware/
│       └── package.json
├── packages/
│   ├── db/               # Prisma schema & client
│   └── shared/           # Shared TypeScript types
├── .env.example
├── package.json          # Root workspace config
└── README.md
```

---

## 🔮 Relationship Levels

| Level | Score | AI Behavior |
|-------|-------|-------------|
| 👤 Stranger | 0–99 | Cold, minimal responses, barely interested |
| 🤝 Acquaintance | 100–299 | Slightly warmer, occasional dry humor |
| 😊 Friend | 300–699 | Casual, teasing, uses your name |
| 💜 Close Friend | 700–1499 | Inside jokes, remembers details, more open |
| ⭐ Best Friend | 1500+ | Deeply warm, calls you by nickname, very personal |

---

## 💰 Monetization Roadmap

1. **Phase 1 (Now):** Free, open-source, build user base
2. **Phase 2:** Stripe integration, Pro tier ($4.99/mo)
3. **Phase 3:** Premium tier ($9.99/mo) with voice messages
4. **Phase 4:** B2B white-label licensing

---

## 🛠️ Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Next.js 14 + Tailwind CSS + Framer Motion | Free |
| Backend | Node.js + Express.js | Free |
| Database | SQLite via Prisma | Free |
| AI Engine | Ollama (Llama 3 / Qwen) | Free |
| Auth | NextAuth.js + GitHub OAuth | Free |
| Hosting | Vercel (frontend) + Railway (backend) | Free tier |

---

## 📄 License

MIT — do whatever you want with it.
