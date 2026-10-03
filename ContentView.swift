import SwiftUI

struct ContentView: View {
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            VStack(spacing: 18) {
                Text("J.A.R.V.I.S.")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundStyle(.cyan)
                Text("PERSONAL INTELLIGENCE SYSTEM")
                    .font(.caption2)
                    .tracking(3)
                    .foregroundStyle(.gray)
                Circle()
                    .fill(
                        RadialGradient(
                            colors: [.white, .cyan, .blue, .clear],
                            center: .center,
                            startRadius: 3,
                            endRadius: 95
                        )
                    )
                    .frame(width: 170, height: 170)
                    .shadow(color: .cyan.opacity(0.7), radius: 35)
                Text("JARVIS pronto.")
                    .foregroundStyle(.white)
            }
        }
    }
}
