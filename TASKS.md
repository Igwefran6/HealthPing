# Actionable Tasks

## Phase 1: SQLite Migration [COMPLETED]
- [x] Install `sql.js` (WASM-based SQLite for Termux compatibility)
- [x] Create SQLite schema (pings table)
- [x] Refactor `src/plugins/db.ts` to use `sql.js`
- [x] Implement manual file persistence for WASM DB
- [x] Add `getStats` for 24h uptime/latency calculations
- [x] Update `/status` route with merged stats

## Phase 2: Reliability [COMPLETED]
- [x] Implement "3-strike" retry logic in `pinger.ts` with backoff
- [x] Add graceful shutdown handlers (`SIGTERM`/`SIGINT`) in `app.ts`
- [x] Ensure `fastify.close()` triggers DB persistence

## Phase 3: API & Notifications [COMPLETED]
- [x] Create GET `/api/stats` endpoint for 24h metrics
- [x] Add Discord/Telegram notification plugin with dummy fallback
- [x] Implement "Dummy Notifier" for testing (logs to console if no webhook)
- [x] Create production-ready Dashboard UI with uptime visualization

## Phase 4: Developer Experience & Quality [COMPLETED]
- [x] Set up **Prettier** for automated code formatting
- [x] Add `npm run format` script to `package.json`
- [x] Format entire codebase with consistent rules
- [x] Migrate core files to **TypeScript**
- [x] Set up **tsx** for rapid development reloads

## Phase 5: Deployment & Infrastructure [COMPLETED]
- [x] Create `Dockerfile` for standardized deployment
- [x] Add `.dockerignore` to optimize build context
- [x] Add structured logging via Pino JSON (via Fastify default)
- [ ] Implement custom `/health` endpoint for advanced container health checks
