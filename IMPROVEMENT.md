# HealthPing Improvement Roadmap

This document outlines the strategic improvements required to make HealthPing production-ready for a small team.

## Phase 1: Persistence & Data Integrity
*   **Goal:** Replace `lowdb` with a robust, concurrent-safe database.
*   **Action:** Migrate to **SQLite** (using `better-sqlite3`).
*   **Benefit:** Prevents data corruption, enables complex uptime queries, and provides a standard SQL interface.

## Phase 2: Reliability & Error Resilience
*   **Goal:** Reduce false positives and ensure graceful operation.
*   **Actions:**
    *   Implement "3-strike" retry logic for pings.
    *   Add graceful shutdown handlers (`SIGTERM`/`SIGINT`).
    *   Add request timeouts and circuit breaker patterns.

## Phase 3: Monitoring & API Enhancements
*   **Goal:** Provide actionable insights and integrations.
*   **Actions:**
    *   Create a History API endpoint (`/api/history`).
    *   Calculate uptime percentages (24h, 7d, 30d).
    *   Support multiple notification channels (Slack/Discord Webhooks).

## Phase 4: Developer Experience & Quality
*   **Goal:** Ensure code maintainability and team velocity.
*   **Actions:**
    *   Migrate to **TypeScript**.
    *   Add ESLint & Prettier.
    *   Set up GitHub Actions for CI (testing/linting).

## Phase 5: Deployment & Infrastructure
*   **Goal:** Standardize the execution environment.
*   **Actions:**
    *   Dockerize the application.
    *   Implement structured logging for production (Pino JSON).
    *   Add a `/health` endpoint for container probes.
