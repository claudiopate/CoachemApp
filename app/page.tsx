import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, TurtleIcon as TennisBall, Calendar, Users, MessageSquare } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <TennisBall className="h-7 w-7 text-primary" />
            <span className="text-2xl font-bold gradient-heading">CourtTime</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/login">
              <Button variant="ghost" size="lg" className="text-base font-medium">Accedi</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" className="text-base font-medium">Registrati</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto max-w-7xl px-8">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none gradient-heading max-w-[700px]">
                    Gestisci le tue lezioni di Tennis & Padel con facilità
                  </h1>
                  <p className="text-xl text-muted-foreground md:text-2xl max-w-[600px] leading-relaxed">
                    La piattaforma intelligente per allenatori e studenti per gestire lezioni, monitorare i progressi e
                    ottimizzare gli orari.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                  <Link href="/sign-up">
                    <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Inizia Ora <ArrowRight className="h-6 w-6 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6">
                      Scopri di più
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[700px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20"></div>
                  <img
                    src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=1470&auto=format&fit=crop"
                    alt="Coach planning tennis and padel lessons on a digital device"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container mx-auto max-w-7xl px-8">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl gradient-heading">
                  Funzionalità
                </h2>
                <p className="text-xl text-muted-foreground md:text-2xl max-w-[800px] mx-auto leading-relaxed">
                  Tutto ciò di cui hai bisogno per gestire le lezioni di tennis e padel in modo efficiente
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 py-16 md:grid-cols-3 md:gap-12">
              <div className="group flex flex-col items-center space-y-6 rounded-2xl border p-10 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Calendar className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold">Pianificazione Intelligente</h3>
                <p className="text-center text-lg text-muted-foreground leading-relaxed">
                  Pianificazione basata su AI che ottimizza la tua disponibilità e le preferenze degli studenti
                </p>
              </div>
              <div className="group flex flex-col items-center space-y-6 rounded-2xl border p-10 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Users className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold">Gestione Studenti</h3>
                <p className="text-center text-lg text-muted-foreground leading-relaxed">
                  Monitora i progressi degli studenti, le preferenze e la presenza in un unico posto
                </p>
              </div>
              <div className="group flex flex-col items-center space-y-6 rounded-2xl border p-10 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold">Input Vocale & Chat</h3>
                <p className="text-center text-lg text-muted-foreground leading-relaxed">
                  Inserisci la tua disponibilità tramite linguaggio naturale o comandi vocali
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-10 bg-muted/50">
        <div className="container mx-auto max-w-7xl flex flex-col items-center justify-between gap-6 px-8 md:flex-row">
          <div className="flex items-center gap-3">
            <TennisBall className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold gradient-heading">CourtTime</span>
          </div>
          <p className="text-center text-base text-muted-foreground md:text-left">
            © 2025 CourtTime. Tutti i diritti riservati.
          </p>
          <div className="flex gap-8">
            <Link href="/terms" className="text-base text-muted-foreground underline-offset-4 hover:underline">
              Termini
            </Link>
            <Link href="/privacy" className="text-base text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

