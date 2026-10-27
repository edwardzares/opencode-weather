# AGENTS.md

Bun + TypeScript Weather CLI. Product spec is `README.md:1-48`.

## Entrypoint & layout
- `index.ts` — CLI entry (`package.json:module`): `main()` menu loop wiring actions to modules. Uses top-level `await main()`.
- `src/api.ts` — `geocodeCity()`, `getTemperature()` (always °C; °F computed client-side), `getForecast()` (7-day daily max/min/weather_code).
- `src/store.ts` — JSON persistence via `Bun.file`/`Bun.write` to `data.json` (repo root, gitignored) + CRUD mutators.
- `src/ui.ts` — `renderMenu()`, `ask()` (wraps Bun global `prompt()`), `renderForecast()` table, formatting helpers.
- `src/types.ts` — `City`, `Store`, `DailyForecast`, API response types.
- No tests, lint, CI, or `opencode.json` yet.

## Commands
- Run: `bun run index.ts`
- Typecheck: `bun run typecheck` (`bun check`, uses `tsconfig.json`)
- Install: `bun install` (lockfile: `bun.lock`)
- Intended distributable per README: single binary via `bun build --compile` (not wired yet).

## Toolchain quirks
- `tsconfig.json`: `strict`, `moduleResolution: bundler`, `verbatimModuleSyntax: true`, `allowImportingTsExtensions: true`, `noEmit: true`. Use `import type` where appropriate and explicit `.ts` extensions on relative imports.
- Windows PowerShell 5.1 here: `npm.ps1` is blocked by `AllSigned` execution policy — prefer `bun`/`bunx`. After a fresh Bun install via `winget install -e --id Oven-sh.Bun`, refresh PATH in the current shell before calling `bun`:
  `$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')`

## External APIs (no key needed)
Per README, use Open-Meteo only:
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
- Current: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`
- 7-day: `...&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`
- Use native `fetch` (Bun builtin); no HTTP client dependency.

## Conventions to follow
- CLI language is Spanish; menu shape matches `README.md:36-49` (default city, all-cities list, add/delete, set default, 7-day forecast, units, exit). Option 7 is intentionally unused (spec goes 6 -> 8).
- Persistence is local `data.json` in repo root (gitignored). Keep it Bun-native; don't add an ORM without asking.
- Current weather always displays both units (`°C / °F`) with `store.unit` controlling order; the 7-day forecast table always uses fixed `°C` then `°F` columns.
