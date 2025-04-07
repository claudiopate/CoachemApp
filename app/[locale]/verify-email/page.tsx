import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function VerifyEmailPage() {
  const router = useRouter()

  useEffect(() => {
    // Reindirizza alla dashboard se l'utente è già autenticato
    router.push("/dashboard")
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full mx-auto space-y-6 p-8 border rounded-lg shadow-lg bg-card">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Verifica la tua email</h1>
          <p className="text-muted-foreground">
            Ti abbiamo inviato un link di verifica alla tua email.
            Per favore, controlla la tua casella di posta e clicca sul link per completare la registrazione.
          </p>
        </div>
      </div>
    </div>
  )
}