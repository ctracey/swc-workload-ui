# SWC Workload UI

A React app distributed as a single self-contained HTML file. The build inlines all JS and CSS into `dist/index.html`, which runs directly in a browser from the filesystem — no server required.

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

## Development

Start the dev server with hot reload:

```sh
npm run dev
```

Then open the URL it prints (default http://localhost:5173).

## Build

Build the single-file distributable:

```sh
npm run build
```

The output is `dist/index.html` with all JS and CSS inlined (via [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile)). Open it directly in a browser:

```sh
open dist/index.html
```

To preview the production build through a local server instead:

```sh
npm run preview
```

## Project structure

```
index.html              Entry page (mount point)
src/
  main.jsx              React bootstrap
  App.jsx               App shell
  components/
    Title.jsx           Title component
  index.css             Global styles
vite.config.js          Vite + React + singlefile plugin config
```
