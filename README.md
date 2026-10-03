# JARVIS iOS NATIVE LAYER

Questa cartella è la base della vera integrazione iOS.

## Perché serve

La PWA è perfetta per:
- interfaccia futuristica
- chat
- voce quando l'app è aperta
- installazione sulla Home
- notifiche web

Per una vera integrazione con Siri/Shortcuts serve invece un'app nativa con App Intents.

## Cosa fare in Xcode

1. Crea un nuovo progetto iOS App chiamato `JARVIS`.
2. Aggiungi:
   - `JarvisApp.swift`
   - `ContentView.swift`
   - `JarvisIntents.swift`
3. Configura Microphone usage description in Info.plist.
4. Collega la UI al backend HTTPS.
5. Aggiungi il motore voce/realtime.
6. Aggiungi EventKit per leggere il calendario con consenso dell'utente.
7. Aggiungi App Intents per esporre:
   - Avvia JARVIS
   - Leggi agenda
   - Crea piano
   - Apri sessione studio

## Importante

App Intents permette a Siri, Spotlight e Shortcuts di richiamare funzioni dell'app. Non significa che una normale app possa cambiare la parola di attivazione di Siri in "Hey Jarvis" o diventare automaticamente l'assistente di sistema in Italia.

Per il comportamento sempre-in-ascolto servono una progettazione nativa, permessi appropriati e una soluzione di wake-word compatibile con le regole iOS/App Store.
