# 🏥 HealthPing

A lightweight, high-performance URL health monitoring service built with Node.js and Fastify.

## 🚀 Features

- **Parallel Pinging**: Monitor multiple URLs simultaneously using `Promise.all`.
- **Scheduled Checks**: Flexible scheduling with `node-cron`.
- **Persistence**: Automatically records the last 1000 ping results (status, latency, errors) in a local `db.json` using `lowdb`.
- **Latency Tracking**: Measures and logs response times in milliseconds.
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
PING_INTERVAL="*/5 * * * *"
URL_LIST="https://google.com, https://github.com"
DISCORD_WEBHOOK="your-webhook-url"
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_CHAT_ID="your-chat-id"
```

### 4. Running the App
- **Development**: `npm run dev` (uses `--watch`)
- **Production**: `npm start`
- **Tests**: `npm test`

## 📊 API Endpoints

- `GET /`: Returns a JSON summary of the latest status, latency, and timestamps for all monitored URLs.

## 🗄️ Persistence
HealthPing uses `lowdb` to maintain a local JSON database (`db.json`). This ensures that your uptime history and the latest statuses are preserved even if the service restarts.

## 🧪 Testing
HealthPing uses the built-in Node.js test runner.
```bash
npm test
```

## 📝 License
ISC
