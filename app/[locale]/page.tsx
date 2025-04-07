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
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}