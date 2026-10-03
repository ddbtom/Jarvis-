import AppIntents

struct StartJarvisIntent: AppIntent {
    static var title: LocalizedStringResource = "Avvia JARVIS"
    static var description = IntentDescription("Avvia l'assistente vocale JARVIS.")

    func perform() async throws -> some IntentResult {
        // In the production app, this intent should bring the app
        // to the foreground and start the voice session.
        return .result()
    }
}

struct JarvisShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        [
            AppShortcut(
                intent: StartJarvisIntent(),
                phrases: [
                    "Avvia JARVIS",
                    "Parla con JARVIS"
                ],
                shortTitle: "JARVIS",
                systemImageName: "waveform"
            )
        ]
    }
}
