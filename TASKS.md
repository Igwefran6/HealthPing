# Actionable Tasks

## Phase 1: SQLite Migration [COMPLETED]
- [x] Install `sql.js` (WASM-based SQLite for Termux compatibility)
- [x] Create SQLite schema (pings table)
- [x] Refactor `src/plugins/db.js` to use `sql.js`
- [x] Implement manual file persistence for WASM DB
- [x] Add `getStats` for 24h uptime/latency calculations
- [x] Update `/status` route with merged stats

## Phase 2: Reliability
- [ ] Implement retry logic in `pinger.js`
- [ ] Add `fastify.addHook('onClose')` for DB cleanup
- [ ] Add health check route

## Phase 3: API & Notifications
- [ ] Create GET `/api/stats` endpoint
- [ ] Add Discord/Slack webhook support
- [ ] Add basic dashboard UI updates
