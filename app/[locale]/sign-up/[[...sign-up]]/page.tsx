import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/login"
        afterSignUpUrl="/dashboard"
        redirectUrl="/dashboard"
      />
    </div>
  )
}