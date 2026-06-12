// local server for SWC WORKLOAD UI:
// serves the built app at / and the local filesystem read-only at absolute
// paths, so bookmarks like /?path=/Users/me/runs/app resolve. localhost only.
import http from 'node:http'
import { createReadStream, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = Number(process.env.PORT ?? 8123)
const APP = join(fileURLToPath(new URL('..', import.meta.url)), 'dist', 'index.html')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
}

http
  .createServer((req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost')
    const file = pathname === '/' || pathname === '/index.html' ? APP : decodeURIComponent(pathname)
    try {
      if (!statSync(file).isFile()) throw new Error('not a file')
      res.setHeader('content-type', MIME[extname(file)] ?? 'application/octet-stream')
      res.setHeader('cache-control', 'no-store') // workload.json is polled for live edits
      createReadStream(file).pipe(res)
    } catch {
      res.statusCode = 404
      res.end('not found')
    }
  })
  .listen(PORT, '127.0.0.1', () => {
    console.log(`SWC WORKLOAD UI on http://localhost:${PORT}/`)
    console.log(`open a workload: http://localhost:${PORT}/?path=/absolute/path/to/folder`)
  })
