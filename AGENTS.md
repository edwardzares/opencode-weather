# AGENTS.md

Bun + TypeScript Weather CLI. Product spec is `README.md:1-48`.

## Entrypoint & layout
Layered structure under `src/` (see `estructura.md`); root `index.ts` no longer exists.
- `src/index.ts` — CLI entry (`package.json:module`): menu loop that dispatches to `actions/`.
- `src/actions/` — one file per menu action (`getWeather`, `getAllWeather`, `addCity`, `removeCity`, `setDefaultCity`, `getForecast`, `updateSettings`, `listCities`). Actions load/save storage themselves and print via `presentation/output`.
- `src/presentation/` — `menu.ts` (render + `MenuOption` list), `input.ts` (wraps Bun `prompt()`), `output.ts`.
- `src/storage/` — `dataFile.ts` (`loadStore`/`saveStore`), `citiesStorage.ts`, `settingsStorage.ts`.
- `src/api/` — `geocoding.ts` (`geocodeCity`), `weather.ts` (`getCurrentWeather`, `getForecast`).
- `src/types/` — one type per file (`City`, `Settings`, `Store`, `Weather`, `Geocoding`, `MenuOption`).
- `src/utils/` — `constants.ts` (incl. `getDataFile()`), `format.ts`, `colors.ts` (`createColors(enabled)`, no-op when not a TTY), `errors.ts`.
- `Tests/` — Bun test suites mirroring `src/`: `helpers/`, `utils/`, `api/`, `storage/`, `presentation/`, `actions/`, `index.test.ts`.
- `.github/workflows/release.yml` — release automático: lee `version` de `package.json`, valida (typecheck + tests) y publica `v<version>` con los binarios cross-compiled. No lint ni `opencode.json` todavía.

## Commands
- Run: `bun run src/index.ts` (or `bun run start`)
- Typecheck: `bun run typecheck` (`bun check`, uses `tsconfig.json`)
- Install: `bun install` (lockfile: `bun.lock`)
- Test (with coverage gate): `bun run test` (`bun test --coverage Tests`)
- Test watch: `bun run test:watch`
- Coverage only: `bun run test:coverage`
- Build binary: `bun run build` → **typecheck → tests →** `bun run build:app` (`bun build --compile --outfile weather src/index.ts`)
- Build is blocked if typecheck or any test fails; `bunfig.toml` enforces a **0.8 per-file** line/function coverage threshold.

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
