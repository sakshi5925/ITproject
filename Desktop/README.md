# Desktop wrapper for the MERN project

This folder contains a minimal Electron main process that launches your existing backend and opens the frontend inside a BrowserWindow.

Files added:

- `server.js` — Electron main process. It:
  - spawns the backend at `../backend/server.js` as a child process,
  - loads `../frontend/dist/index.html` if present, otherwise loads the Vite dev server URL `http://localhost:5173`.

Quick run (development)

1. Start the frontend dev server (Vite):

   cd ../frontend
   npm install
   npm run dev

2. Start the Electron wrapper (this will spawn the backend automatically):

   cd ../Desktop
   npm install
   npm start

Notes:
- If you prefer the Electron window to load the production build, run `npm run build` in `frontend` then start electron. The Electron main will load `frontend/dist/index.html` automatically.
- The backend is started from `../backend/server.js`. Make sure backend dependencies are installed (`cd ../backend && npm install`). The backend will listen on `PORT` from environment or default to `5000`.

Packaging for distribution

1. Install a packager (example: `electron-builder`). From `Desktop` run:

   npm install --save-dev electron-builder

2. Add packaging scripts to `package.json` in `Desktop` (example):

   "scripts": {
     "start": "electron .",
     "pack": "electron-builder --dir",
     "dist": "electron-builder"
   }

3. Build the frontend first:

   cd ../frontend
   npm run build

4. From `Desktop` run packaging:

   npm run dist

electron-builder configuration (recommended)

- Add a `build` section to `Desktop/package.json` to set application name, icons, target platforms, etc. See electron-builder docs: https://www.electron.build/

Troubleshooting

- If Electron window shows a blank page, check whether `frontend/dist/index.html` exists. If not, either build frontend or run the Vite dev server.
- Check the terminal where you ran `npm start` in `Desktop` for backend logs (they are piped through). If the backend crashes, Electron will continue running; restart Electron after fixing backend.

Security note

- This main process starts your backend as a child process and loads a local file or http URL in a BrowserWindow. Review CORS/allowed origins and production config, especially for any sensitive environment variables.
