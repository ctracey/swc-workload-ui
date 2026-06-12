# SWC Workload UI

A React app built into a single self-contained HTML file (`dist/index.html`, all JS and CSS inlined) and run through a small local HTTP server. The server exposes the app at `/` and the local filesystem read-only, so a workload anywhere on disk can be opened — and bookmarked — by absolute path.

## Prerequisites

- Node.js 20 (pinned in `.nvmrc`)
- npm

## Setup

If you use [nvm](https://github.com/nvm-sh/nvm), switch to the project's Node version first:

```sh
nvm use
```

Then install dependencies:

```sh
npm install
```

## Running

Build, then start the local server:

```sh
npm run build
npm run serve
```

Open a workload by pointing `path` at the folder containing its `workload.json`:

```
http://localhost:8123/?path=/Users/me/projects/quote-app/.swc/web
```

That URL is a complete, bookmarkable session — one bookmark per workload. The port can be changed with `PORT=9000 npm run serve`.

The server (`scripts/serve.mjs`, no dependencies) binds to 127.0.0.1 only and serves files read-only. The built `dist/index.html` also works behind any other static server; `path` is then resolved against that server's document root.

## Loading a workload

- **`?path=` parameter** — loads `<path>/workload.json`, polled every 2 seconds so edits to the file appear live.
- **No parameter** — the app shows a Select Workload panel (PATH readout shows `none`): enter the absolute folder path and OPEN navigates to the `?path=` URL, making the session bookmarkable.
- Clicking the SWC WORKLOAD title starts fresh: reloads without the `path` parameter.

## Development

Start the dev server with hot reload:

```sh
npm run dev
```

Then open the URL it prints (default http://localhost:5173).

## Project structure

```
index.html              Entry page (mount point)
src/
  main.jsx              React bootstrap
  App.jsx               App shell, workload loading/polling
  workload.js           Status/stage derivation helpers
  components/           Title bar, sidebar, cards, panels, charts
scripts/serve.mjs       Local HTTP server (app + read-only filesystem)
vite.config.js          Vite + React + singlefile plugin config
```
