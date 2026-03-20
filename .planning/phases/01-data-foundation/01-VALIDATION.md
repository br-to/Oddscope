---
phase: 1
slug: data-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 2.1+ |
| **Config file** | vitest.config.ts (Wave 0 installs) |
| **Quick run command** | `npm test -- --run --reporter=verbose` |
| **Full suite command** | `npm test -- --run --coverage` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --run --reporter=verbose`
- **After every plan wave:** Run `npm test -- --run --coverage`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | MKTD-01 | integration | `npm test tests/market-display.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | MKTD-02 | unit | `npm test tests/translation.test.ts` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 1 | MKTD-04 | integration | `npm test tests/market-filters.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/market-display.test.ts` — stubs for MKTD-01 (Server Component, data fetch, Japanese display)
- [ ] `tests/translation.test.ts` — stubs for MKTD-02 (LLM translation, domain dictionary, context note generation)
- [ ] `tests/market-filters.test.ts` — stubs for MKTD-04 (filter UI, Prisma query, sort)
- [ ] `tests/setup.ts` — shared fixtures (Prisma mock, OpenAI mock)
- [ ] `vitest.config.ts` — Next.js env, TypeScript, coverage config
- [ ] Framework install: `npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Japanese translation quality | MKTD-01, MKTD-02 | Subjective quality assessment | Review 10 translated markets for accuracy and readability |
| Mobile responsive layout | MKTD-01 | Visual check needed | Open on 375px viewport, verify no horizontal scroll |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
