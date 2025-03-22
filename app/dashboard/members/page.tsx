"use client"

import { useState } from "react"
import { useOrganization } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { PlusCircle, MoreHorizontal, Search, Mail } from "lucide-react"
import { InviteMemberModal } from "@/components/invite-member-modal"

export default function MembersPage() {
  const { organization, isLoaded } = useOrganization()
  const [searchQuery, setSearchQuery] = useState("")
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  if (!isLoaded || !organization) {
    return <div>Loading...</div>
  }

  const { memberships } = organization

  // Filtra i membri in base alla query di ricerca
  const filteredMembers = memberships.data.filter((membership) => {
    const fullName = `${membership.publicUserData?.firstName} ${membership.publicUserData?.lastName}`.toLowerCase()
    const email = membership.publicUserData?.identifier.toLowerCase()
    const query = searchQuery.toLowerCase()

    return fullName.includes(query) || (email && email.includes(query))
  })

  // Raggruppa i membri per ruolo
  const membersByRole = {
    admin: filteredMembers.filter((m) => m.role === "admin"),
    coach: filteredMembers.filter((m) => m.role === "coach"),
    student: filteredMembers.filter((m) => m.role === "student"),
    all: filteredMembers,
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Club Members</h1>
          <p className="text-muted-foreground">Manage your club's coaches and students</p>
        </div>
        <Button onClick={() => setIsInviteModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Members ({membersByRole.all.length})</TabsTrigger>
          <TabsTrigger value="admin">Admins ({membersByRole.admin.length})</TabsTrigger>
          <TabsTrigger value="coach">Coaches ({membersByRole.coach.length})</TabsTrigger>
          <TabsTrigger value="student">Students ({membersByRole.student.length})</TabsTrigger>
        </TabsList>

        {Object.entries(membersByRole).map(([role, members]) => (
          <TabsContent key={role} value={role} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {role === "all"
                    ? "All Members"
                    : role === "admin"
                      ? "Administrators"
                      : role === "coach"
                        ? "Coaches"
                        : "Students"}
                </CardTitle>
                <CardDescription>
                  {role === "all"
                    ? "All members of your club"
                    : `${members.length} ${members.length === 1 ? "member" : "members"} with ${role} role`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No members found</p>
                  ) : (
                    members.map((membership) => (
                      <div
                        key={membership.id}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={membership.publicUserData?.imageUrl}
                              alt={membership.publicUserData?.firstName || ""}
                            />
                            <AvatarFallback>
                              {membership.publicUserData?.firstName?.[0] || ""}
                              {membership.publicUserData?.lastName?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {membership.publicUserData?.firstName} {membership.publicUserData?.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">{membership.publicUserData?.identifier}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Change Role</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Remove from Club</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <InviteMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
    </div>
  )
}

