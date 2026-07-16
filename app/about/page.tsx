import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | Mookalaa",
  description:
    "MOOKALAA is a cultural technology platform by Venootic Enterprises OPC Pvt. Ltd. dedicated to empowering artists and preserving cultural heritage through innovation.",
}

const highlights = [
  {
    emoji: "🎭",
    text: "Discover authentic arts & cultural events",
  },
  {
    emoji: "🎤",
    text: "Book verified artists with confidence",
  },
  {
    emoji: "🎓",
    text: "Learn from experienced artists",
  },
  {
    emoji: "🎟️",
    text: "Secure ticket booking & digital passes",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        {/* About */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold">About MOOKALAA</h1>
          <p className="text-amber-500 font-semibold text-lg">Unite Through Arts</p>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed text-left sm:text-center">
            MOOKALAA is a cultural technology platform by Venootic Enterprises OPC Pvt. Ltd. dedicated to
            empowering artists and preserving cultural heritage through innovation. We connect artists,
            audiences, learners, and businesses in one trusted digital ecosystem, enabling artist bookings,
            online learning, personalized wishes, event ticketing, digital promotion, and secure payments.
          </p>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed text-left sm:text-center">
            Our mission is to create sustainable opportunities for artists while making arts and culture more
            accessible to people across India and the world.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card p-6 space-y-3">
            <h2 className="text-2xl font-bold text-amber-500">Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To empower artists, preserve cultural heritage, and connect creativity with the world through
              innovative, trusted, and accessible technology.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-3">
            <h2 className="text-2xl font-bold text-amber-500">Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              To shape a future where every artist is empowered, every culture is celebrated, and creativity
              connects people across the world.
            </p>
          </div>
        </section>

        {/* Why MOOKALAA */}
        <section className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Why MOOKALAA?</h2>
            <p className="text-muted-foreground leading-relaxed">
              MOOKALAA is more than an event platform—it's a complete digital ecosystem connecting artists,
              audiences, learners, and businesses in one place. We preserve culture, empower talent, and make
              discovering, booking, learning, and celebrating arts effortless.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-center">Highlights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-4 rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-600/10 p-4"
              >
                <span className="text-3xl">{item.emoji}</span>
                <p className="font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Company details */}
        <section className="rounded-lg border border-border bg-card p-6 text-center space-y-2 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground text-base">VENOOTIC ENTERPRISES OPC PVT LTD</p>
          <p>CIN: U90001OD2025OPC051514 &nbsp;|&nbsp; GST: 21AALCV6186G1Z3</p>
          <p>Registered Office: Satya Vihar, Rasulghar, Bhubaneswar, Khorda, Odisha, 751010</p>
        </section>
      </div>
    </main>
  )
}
