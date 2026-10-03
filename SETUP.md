# SETUP JARVIS NEXUS

## 1. Frontend GitHub Pages

Sostituisci nel repository i file:
- index.html
- style.css
- app.js
- manifest.webmanifest
- sw.js
- icon.svg

Mantieni il repository pubblico se vuoi usare GitHub Pages.

## 2. Backend Cloudflare Worker

Da terminale, dentro `worker/`:

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

Poi crea il secret:

```bash
wrangler secret put OPENAI_API_KEY
```

Incolla la tua chiave quando richiesto.

Non mettere MAI la chiave in `app.js`, GitHub o `manifest.webmanifest`.

## 3. Collega il frontend

In `app.js`:

```js
const API_URL = "https://TUO-WORKER.workers.dev/api/chat";
```

Poi fai commit/push.

## 4. Test

Apri:

`https://TUO-WORKER.workers.dev/api/health`

Deve restituire JSON con `ok: true`.

Poi apri la pagina GitHub Pages e prova una domanda.

## 5. PWA su iPhone

Apri la pagina con Safari -> Condividi -> Aggiungi alla schermata Home.

Da quel momento JARVIS appare come un'app e si apre in modalità standalone.

La PWA non può però sostituire Siri o ascoltare continuamente "Hey Jarvis" in background.

## 6. Calendario

Per il calendario personale serve OAuth con Google Calendar (o EventKit se si passa alla vera app iOS).

La versione nativa è preferibile perché può esporre azioni tramite App Intents e Shortcuts.

## 7. File

La funzione finale prevista è:

utente -> seleziona PDF/DOCX -> backend -> estrazione/indexing -> agente -> piano di studio/lavoro.

Per file privati non inserire documenti direttamente in GitHub.
