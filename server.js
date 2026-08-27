import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');

// Middleware parsing
app.use(express.json());

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Check if dist folder exists
if (fs.existsSync(distPath)) {
  // Serve static files from dist
  app.use(express.static(distPath, { maxAge: '1d' }));

  // SPA fallback: send index.html for all other GET requests
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Helpful fallback if build hasn't run yet
  app.get('*', (req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Aplikasi Sedang Disiapkan</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; text-align: center; padding: 20px; }
            .card { background: #1e293b; padding: 32px; border-radius: 16px; max-width: 500px; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
            h1 { font-size: 20px; margin-bottom: 12px; color: #38bdf8; }
            p { font-size: 14px; color: #94a3b8; line-height: 1.6; }
            code { background: #0f172a; color: #10b981; padding: 4px 8px; border-radius: 6px; font-family: monospace; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Folder <code>dist</code> Belum Ditemukan</h1>
            <p>Silakan jalankan perintah <code>npm run build</code> di terminal hosting Anda untuk menghasilkan file build publik, kemudian restart aplikasi Node.js.</p>
          </div>
        </body>
      </html>
    `);
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] Web application running on port ${PORT}`);
});
