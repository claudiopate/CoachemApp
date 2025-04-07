import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/sign-up"
        afterSignIn="/dashboard"
        redirectUrl={undefined} // Rimuovi redirectUrl che può causare un loop
      />
    </div>
  )
}