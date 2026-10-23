# AstroMate

AstroMate is an open-source, privacy-first AI companion platform designed to build evolving, human-like relationships. Powered by local large language models (LLMs) via Ollama and rooted in authentic Vedic astrology, AstroMate pairs each user with a celestial companion whose personality, traits, and dialogue style evolve dynamically over time.

---

## Architectural Pillars

### 1. Vedic Astrology Engine & Companion Genesis
- **Algorithmic Chart Calculation**: Computes accurate Vedic Rashi (Moon sign), Nakshatra (lunar mansion, 27 divisions), Pada (quarter), and planetary rulers from the user's birthdate and birth time.
- **Companion Birth Genesis**: Each companion is initialized at the exact timestamp of account creation with its own distinct Vedic birth chart, defining its natural temperaments, communication tendencies, and conversational quirks.
- **Dual-Zodiac Mapping**: Bridges Western Sun Zodiac calculation with traditional Vedic lunar astrology.

### 2. Adaptive Relationship Progression Engine
Conversations are governed by a dynamic relationship state machine. As users interact, conversation quality and depth increment an underlying relationship score, transitioning through five distinct bond levels:

| Level | Score Range | Behavioral Dynamics |
| :--- | :--- | :--- |
| **Stranger** | 0 – 99 | Reserved, observational, concise responses. Gauging communication vibe. |
| **Acquaintance** | 100 – 299 | Friendly ice-breaking, relaxed tone, relatable everyday conversation. |
| **Friend** | 300 – 699 | Casual, frank, light teasing, zero corporate or robotic politeness. |
| **Close Friend** | 700 – 1,499 | Mutual trust, inside jokes, emotional venting, direct and sincere advice. |
| **Best Friend** | 1,500+ | **Zero-Filter Mode**. Complete frankness, playful roasting, deep emotional support, and unconditional loyalty. |

### 3. Cultural & Hinglish Conversational Intelligence
- **Dynamic Code-Switching**: Built-in automatic language detection (`isHinglishOrHindi`) identifies Roman Hindi / Hinglish and Devanagari inputs.
- **Natural Desi Slang**: Employs colloquial conversational hooks (*"arre"*, *"yaar"*, *"bhai"*, *"tension mat le"*, *"sahi hai"*, *"chill kar"*, *"bilkul"*, *"mast"*, *"tu bata"*) without grammatical degeneration.
- **Tone Mirroring**: Adapts directly to the user's energy, sentence length, and vocabulary. If the user writes in English, the companion replies in natural English; if the user writes in Hinglish, the companion mirrors the Hinglish style.
- **Multi-Region Profiles**: Supports region-specific localization for India (`IN`), United States (`US`), United Kingdom (`GB`), Pakistan (`PK`), Australia (`AU`), Canada (`CA`), Nigeria (`NG`), and Global (`DEFAULT`).

### 4. Memory Snapshots & Open Knowledge Framework (OKF)
- **Periodic Summarization**: Summarizes chat chunks into persistent `MemorySnapshot` records every 20 interactions.
- **Structured Knowledge Extraction**: The OKF engine identifies and categorizes personal facts, preferences, life updates, and goals into categorized memories.
- **Prompt Context Injection**: Injects relevant memories into the inference pipeline, allowing the companion to recall previous topics (such as upcoming exams, personal goals, or family details) naturally in conversation.

### 5. Autonomous Proactive Messaging (Cron Engine)
- **Background Scheduler**: A server-side cron scheduler runs every hour to evaluate user engagement.
- **Inactivity Detection**: Identifies accounts inactive for 24+ hours and generates contextual, proactive check-ins based on stored memories and bond level.
- **Feed Integration**: Proactive messages are stored directly in the user's message feed with an indicator badge (`✧ Proactive check-in`), greeting users upon return.

### 6. Local LLM Privacy & Fallback Mechanism
- **100% Local Inference**: Runs locally via Ollama (`qwen2.5:1.5b`, `dolphin-llama3`, or equivalent), keeping private conversations on user hardware without external API subscription costs.
- **Resilient Model Resolution**: The server's `resolveModel()` routine checks active models via the Ollama API, automatically falling back to installed conversational models if a configured model tag is unavailable.

---

## System Architecture

```
+-------------------------------------------------------------------------+
|                              AstroMate                                  |
+------------------------------------+------------------------------------+
|  Frontend (Next.js 14 App Router)  |   Backend (Node.js & Express)      |
|                                    |                                    |
|  - Modern Dark UI & Glassmorphism  |  - REST API & CORS Middleware      |
|  - Framer Motion Micro-Animations  |  - Vedic Astrology Calculator      |
|  - Live Wallpaper Selector (6)     |  - Relationship Evolution Engine   |
|  - Companion Dossier Modal         |  - OKF & Long-Term Memory Service  |
|  - Responsive Mobile Touch Shell   |  - Proactive Hourly Cron Worker    |
+------------------------------------+------------------------------------+
                  |                                     |
                  | HTTPS (REST / JWT)                  |
                  +------------------+------------------+
                                     |
                  +------------------v------------------+
                  |         SQLite via Prisma ORM       |
                  |  Users, Mates, Messages, OKF,       |
                  |  MemorySnapshots                    |
                  +------------------+------------------+
                                     |
                  +------------------v------------------+
                  |         Ollama Engine (Local)       |
                  |  qwen2.5:1.5b / dolphin-llama3      |
                  |  (Port 11434)                       |
                  +-------------------------------------+
```

---

## Monorepo Layout

```
astromate/
├── apps/
│   ├── web/                     # Next.js 14 frontend application
│   │   ├── src/
│   │   │   ├── app/             # App router pages (/, /chat, /login, /signup, /profile, /settings)
│   │   │   ├── components/      # UI components (ChatBubble, DossierModal, Wallpapers)
│   │   │   └── lib/             # API client, zodiac calculations, auth tokens
│   │   └── package.json
│   │
│   └── server/                  # Express.js backend application
│       ├── src/
│       │   ├── routes/          # API routes (auth, chat, mate, okf, onboard)
│       │   ├── services/        # Business logic (astrology, culture, ollama, relationship)
│       │   ├── cron/            # Scheduled background workers (proactive messaging)
│       │   └── index.ts         # Express server entry point
│       └── package.json
│
├── packages/
│   ├── db/                      # Prisma schema, migrations, and SQLite client
│   └── shared/                  # Common TypeScript interfaces, types, and constants
│
├── scripts/
│   └── tunnel.js                # Ngrok automated tunnel launcher
│
├── start-backend-server.bat     # Windows automated launcher with port and tunnel detection
├── package.json                 # Monorepo workspace configuration
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher
- **Ollama**: Installed and running locally ([ollama.ai](https://ollama.ai))

### 1. Clone Repository & Install Dependencies

```bash
git clone https://github.com/Shaishav13/astromate.git
cd astromate
npm install
```

### 2. Setup Local LLM (Ollama)

Ensure Ollama is running, then pull the recommended lightweight conversational model:

```bash
ollama pull qwen2.5:1.5b
```

*Note: You can also use other installed models like `dolphin-llama3:8b` or `qwen2.5-coder`. The server automatically checks and falls back if needed.*

### 3. Configure Environment Variables

Create `.env` inside `apps/server/.env`:

```env
DATABASE_URL="file:../../packages/db/dev.db"
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="qwen2.5:1.5b"
JWT_SECRET="your-secure-jwt-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SERVER_PORT=3001
```

Create `.env.local` inside `apps/web/.env.local`:

```env
NEXT_PUBLIC_SERVER_URL="http://localhost:3001"
```

### 4. Initialize Database

Generate Prisma client artifacts and run SQLite database migrations:

```bash
npm run db:migrate
```

### 5. Start Development Servers

Run both the frontend and backend concurrently:

```bash
npm run dev
```

- **Web Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001`
- **Health Endpoint**: `http://localhost:3001/api/health`

---

## Remote / Hybrid Deployment

AstroMate supports a hybrid deployment model: host the Next.js frontend publicly (e.g., on Vercel) while keeping the Express backend, SQLite database, and Ollama model running privately on your local machine.

### Windows One-Click Launcher

Double-click `start-backend-server.bat` in the project root. The launcher automatically:
1. Verifies that the local Ollama engine is active on port `11434`.
2. Checks port `3001` and active Ngrok processes to avoid address collisions.
3. Spawns both the server and your permanent HTTPS tunnel concurrently.

### Manual Tunnel Execution

```bash
npm run server:tunnel
```

Configure your public tunnel URL (e.g., `https://your-domain.ngrok-free.dev`) as `NEXT_PUBLIC_SERVER_URL` in your Vercel deployment settings.

---

## API Overview

### Authentication (`/api/auth`)
- `POST /api/auth/signup`: Register user, calculate natal astrology, and generate companion.
- `POST /api/auth/login`: Authenticate existing user and return JWT.
- `GET /api/auth/me`: Retrieve authenticated user profile and metadata.
- `PATCH /api/auth/profile/:userId`: Update user profile details (name, cultural region).

### Messaging & Chat (`/api/chat`, `/api/messages`)
- `POST /api/chat`: Send message, generate LLM response, update relationship score.
- `GET /api/messages/:userId`: Fetch paginated chat history.
- `DELETE /api/messages/:userId`: Clear conversation history.

### Companion Management (`/api/mate`)
- `GET /api/mate/:userId`: Fetch companion dossier, Vedic astrology details, and bond level.
- `PATCH /api/mate/:userId/name`: Rename companion.

### System & Health (`/api/health`)
- `GET /api/health`: Check Ollama connection, SQLite database status, and uptime.

---

## Tech Stack Summary

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express.js, TypeScript, Node-Cron, Date-Fns
- **Database & ORM**: SQLite, Prisma ORM
- **Inference Engine**: Ollama (`qwen2.5:1.5b`)
- **Networking & Tunnelling**: Ngrok, Cloudflare Tunnel
- **Security**: JWT (jsonwebtoken), bcryptjs password hashing

---

## License

This project is licensed under the MIT License.
