# Actionable Tasks

## Phase 1: SQLite Migration [COMPLETED]
- [x] Install `sql.js` (WASM-based SQLite for Termux compatibility)
- [x] Create SQLite schema (pings table)
- [x] Refactor `src/plugins/db.js` to use `sql.js`
- [x] Implement manual file persistence for WASM DB
- [x] Add `getStats` for 24h uptime/latency calculations
- [x] Update `/status` route with merged stats

## Phase 2: Reliability [COMPLETED]
- [x] Implement "3-strike" retry logic in `pinger.js` with backoff
- [x] Add graceful shutdown handlers (`SIGTERM`/`SIGINT`) in `app.js`
- [x] Ensure `fastify.close()` triggers DB persistence
- [ ] Add health check route

## Phase 3: API & Notifications [IN PROGRESS]
- [x] Create GET `/api/stats` endpoint for 24h metrics
- [x] Add Discord/Telegram notification plugin with dummy fallback
- [x] Implement "Dummy Notifier" for testing (logs to console if no webhook)
- [ ] Add Slack webhook support
- [ ] Create basic dashboard HTML to visualize `/api/stats`
