# 🏥 HealthPing

A lightweight, high-performance URL health monitoring service built with Node.js, Fastify, and SQLite.

## 🚀 Features

- **Parallel Pinging**: Monitor multiple URLs simultaneously using the native `fetch` API.
- **Redirect Support**: Intelligent redirect following (3xx) to ensure accurate reachability reporting.
- **Scheduled Checks**: Flexible scheduling with `node-cron` (default: every 1 minute).
- **SQLite Persistence**: Reliable storage of ping results, latency, and errors using `sql.js`.
- **24h Uptime Tracking**: Accurate uptime calculation and "Time Since Last Failure" metrics.
- **Modern Dashboard**: A clean, responsive Inter-based UI for real-time monitoring.
- **Discord & Telegram Alerts**: Real-time notifications for downtime.
- **Lightweight**: Optimized for Termux/Android environments with zero native dependencies.

## 🛠️ Setup

### 1. Prerequisites
- Node.js (v20+ recommended)
- npm

### 2. Installation
```bash
git clone <repository-url>
cd HealthPing
npm install
```

### 3. Configuration
Create a `.env` file in the root directory (use `.env.example` as a template):
```env
PORT=3000
PING_INTERVAL="* * * * *"
URL_LIST="https://google.com, https://github.com"
# Optional Notifications
DISCORD_WEBHOOK="your-webhook-url"
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_CHAT_ID="your-chat-id"
```

### 4. Running the App
- **Development**: `npm run dev` (uses `tsx watch`)
- **Production**: `npm run build && npm start`
- **Tests**: `npm test`

## 📊 Monitoring

- **Web Dashboard**: Access `http://localhost:3000/` to view the real-time status of all monitors.
- **Status API**: `GET /status` returns a detailed JSON summary of the latest status, latency, and 24h metrics.
- **Health Check**: `GET /health` for simple service uptime telemetry.

## 🗄️ Persistence
HealthPing uses `sql.js` to maintain a local SQLite database (`healthping.sqlite`). This ensures that your uptime history and the latest statuses are preserved across restarts with better performance than JSON-based storage.

## 🧪 Testing
HealthPing uses the built-in Node.js test runner with `tsx` for TypeScript support.
```bash
npm test
```

## 📝 License
ISC
