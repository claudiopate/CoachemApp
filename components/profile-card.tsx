import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ProfileCardProps {
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  imageUrl?: string
  onClick?: () => void
}

export function ProfileCard({
  name,
  email,
  role,
  status,
  imageUrl,
  onClick
}: ProfileCardProps) {
  return (
    <Card 
      className="p-4 cursor-pointer hover:bg-accent/5 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{name}</h3>
            <Badge variant={status === "active" ? "default" : "secondary"}>
              {status === "active" ? "Attivo" : "Inattivo"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{role}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
    </Card>
  )
} 