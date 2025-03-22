import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  // Get the headers
  const svix_id = req.headers.get("svix-id") || ""
  const svix_timestamp = req.headers.get("svix-timestamp") || ""
  const svix_signature = req.headers.get("svix-signature") || ""

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "")

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error verifying webhook", {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === "user.created") {
    const { id, email_addresses } = evt.data
    const email = email_addresses[0]?.email_address

    // Crea un profilo vuoto per il nuovo utente
    const { error } = await supabase.from("profiles").insert({
      user_id: id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error creating profile:", error)
      return NextResponse.json({ error: "Error creating profile" }, { status: 500 })
    }
  }

  if (eventType === "organizationMembership.created") {
    const { organization, public_user_data, role } = evt.data

    // Aggiorna il profilo dell'utente con l'organization_id
    const { error } = await supabase
      .from("profiles")
      .update({
        organization_id: organization.id,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", public_user_data.user_id)

    if (error) {
      console.error("Error updating profile with organization:", error)
      return NextResponse.json({ error: "Error updating profile" }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}

