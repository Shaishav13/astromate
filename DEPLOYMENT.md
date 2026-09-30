# Deploying AstroMate: Vercel Frontend + Self-Hosted Local Backend & Model

This guide explains how to deploy the AstroMate **frontend on Vercel** while keeping the **backend, SQLite database, and local Ollama model running on your personal machine**.

---

## Architecture Overview

```
 ┌────────────────────────────────────────┐
 │   Vercel Global Edge (HTTPS)           │
 │   Next.js 14 Web Application           │
 │   URL: https://astromate.vercel.app    │
 └──────────────────┬─────────────────────┘
                    │
                    │ Encrypted HTTPS REST API Requests
                    ▼
 ┌────────────────────────────────────────┐
 │   Cloudflare Secure Tunnel (Free)      │
 │   URL: https://xxxx.trycloudflare.com  │
 └──────────────────┬─────────────────────┘
                    │
                    │ Local Loopback (Zero Port Forwarding Needed)
                    ▼
 ┌────────────────────────────────────────────────────────┐
 │   Your Local System (PC/Laptop)                        │
 │                                                        │
 │   ┌──────────────────────┐    ┌────────────────────┐   │
 │   │ Express Server :3001 │ ── │ Local SQLite DB    │   │
 │   │ (apps/server)        │    │ (packages/db)      │   │
 │   └──────────┬───────────┘    └────────────────────┘   │
 │              │                                         │
 │              ▼                                         │
 │   ┌──────────────────────┐                             │
 │   │ Ollama Engine :11434 │ (qwen2.5:1.5b / llama3)    │
 │   └──────────────────────┘                             │
 └────────────────────────────────────────────────────────┘
```

---

## Why a Tunnel is Required

1. **Mixed Content Restrictions**: Vercel serves your web app over **HTTPS** (`https://...`). Modern browsers strictly block any outgoing API requests to unencrypted `http://localhost:3001` or `http://192.168.x.x` from an HTTPS site.
2. **Global Accessibility**: Anyone opening your Vercel link on their phone or laptop cannot connect to `localhost` on *your* PC without a public gateway.
3. **Zero Configuration**: A Cloudflare Tunnel creates a secure HTTPS tunnel to your local port `3001` with **no router configuration, no port forwarding, and no static IP required**.

---

## Step 1: Start Your Local Backend & Model Server

1. Make sure **Ollama** is running on your machine:
   ```bash
   ollama serve
   ```
   *(Ensure your model is pulled, e.g., `ollama pull qwen2.5:1.5b` or `ollama pull llama3`)*

2. In the project root, launch the backend and tunnel concurrently:
   ```bash
   npm run server:tunnel
   ```
   *Or on Windows, simply double-click [start-backend-server.bat](start-backend-server.bat).*

3. The console will display a public HTTPS URL provided by Cloudflare:
   ```
   Tunnel URL: https://bright-satellite-orbit.trycloudflare.com
   ```
   **Copy this URL** — you will use it in Step 2.

---

## Step 2: Deploy Frontend on Vercel

1. **Push your repository** to GitHub, GitLab, or Bitbucket:
   ```bash
   git add .
   git commit -m "feat: landing page, cors, and vercel deployment setup"
   git push origin main
   ```

2. Open the **[Vercel Dashboard](https://vercel.com/new)** and click **Add New... &rarr; Project**.

3. **Import** your AstroMate repository.

4. Configure the **Project Settings**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click *Edit* and select **`apps/web`**.
     *(When prompted "Include files outside the root directory in the Build Step?", leave it **checked** so Vercel can access `@astromate/shared`).*

5. Add **Environment Variables** in Vercel:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_SERVER_URL` | `https://xxxx.trycloudflare.com` | Your live Cloudflare Tunnel URL from Step 1 |
   | `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Your Vercel production URL |

6. Click **Deploy**. Vercel will install workspace packages, compile the Next.js bundle, and provide your live URL in under 2 minutes!

---

## Step 3: Verify the Live Deployment

1. Open your live Vercel URL (e.g. `https://astromate.vercel.app`).
2. Test the **Sign Up / Sign In** flow.
3. Send a message in `/chat` to your companion.
4. Check your local server terminal: you will see incoming requests flowing in from Vercel and your local Ollama generating live astrological companion responses!

---

## Optional: How to Set Up a Permanent Tunnel URL

Quick tunnels (`trycloudflare.com`) assign a new URL each time the process restarts. If you own a domain on Cloudflare and want a permanent URL (like `https://api.yourdomain.com`):

1. Install `cloudflared`:
   ```powershell
   winget install Cloudflare.cloudflared
   ```
2. Log in to Cloudflare:
   ```powershell
   cloudflared tunnel login
   ```
3. Create a named tunnel:
   ```powershell
   cloudflared tunnel create astromate-server
   ```
4. Route your domain:
   ```powershell
   cloudflared tunnel route dns astromate-server api.yourdomain.com
   ```
5. Run the tunnel:
   ```powershell
   cloudflared tunnel run --url http://localhost:3001 astromate-server
   ```
6. Set `NEXT_PUBLIC_SERVER_URL=https://api.yourdomain.com` permanently in Vercel. Now your backend URL never changes, even across reboots!
