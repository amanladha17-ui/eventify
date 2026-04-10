import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    const { eventId } = await req.json()
    if (!eventId) return new NextResponse("Event ID required", { status: 400 })

    const wishlist = await prisma.wishlist.upsert({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: eventId
        }
      },
      update: {},
      create: {
        userId: session.user.id,
        eventId: eventId
      }
    })

    return NextResponse.json(wishlist)
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(req: Request) {
    try {
      const session = await getServerSession(authOptions)
      if (!session) return new NextResponse("Unauthorized", { status: 401 })
  
      const { eventId } = await req.json()
      if (!eventId) return new NextResponse("Event ID required", { status: 400 })
  
      await prisma.wishlist.delete({
        where: {
          userId_eventId: {
            userId: session.user.id,
            eventId: eventId
          }
        }
      })
  
      return new NextResponse("Deleted", { status: 200 })
    } catch (error) {
      return new NextResponse("Internal Server Error", { status: 500 })
    }
}
