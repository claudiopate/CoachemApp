import { SignIn } from "@clerk/nextjs"
import Image from "next/image"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold gradient-heading mb-2">
              Bentornato su Coachem
            </h1>
            <p className="text-muted-foreground">
              Accedi per continuare a gestire i tuoi allenamenti
            </p>
          </div>
          
          <SignIn
            afterSignInUrl="/dashboard"
            redirectUrl="/dashboard"
            appearance={{
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton",
              },
            }}
            signUpUrl="/sign-up"
          />
        </div>
      </div>

      {/* Right side - Hero image */}
      <div className="hidden lg:flex w-1/2 bg-muted items-center justify-center p-8">
        <div className="relative w-full max-w-2xl">
          <Image
            src="/hero.png" 
            alt="Hero"
            width={600}
            height={400}
            className="rounded-lg shadow-xl"
            priority
          />
          <div className="absolute -bottom-4 -left-4 bg-background p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold gradient-heading">
              La piattaforma per i coach del futuro
            </p>
            <p className="text-muted-foreground mt-2">
              Gestisci lezioni, profili e progressi in un unico posto
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}