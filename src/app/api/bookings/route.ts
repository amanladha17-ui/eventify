import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { eventId } = await req.json()

    if (!eventId) {
      return new NextResponse("Event ID is required", { status: 400 })
    }

    // Use a transaction to ensure atomic seat decrement and booking creation
    const result = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
        select: { capacity: true, bookingsCount: true, status: true }
      })

      if (!event) {
        throw new Error("Event not found")
      }

      if (event.status !== "PUBLISHED") {
        throw new Error("Event is not available for booking")
      }

      if (event.bookingsCount >= event.capacity) {
        throw new Error("Event is fully booked")
      }

      // Check if already booked
      const existingBooking = await tx.booking.findUnique({
        where: {
            userId_eventId: {
                userId: session.user.id,
                eventId: eventId
            }
        }
      })

      if (existingBooking) {
        throw new Error("You have already booked this event")
      }

      // Create booking
      const booking = await tx.booking.create({
        data: {
          userId: session.user.id,
          eventId: eventId
        }
      })

      // Increment bookingsCount
      await tx.event.update({
        where: { id: eventId },
        data: {
          bookingsCount: {
            increment: 1
          }
        }
      })

      return booking
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("BOOKING_ERROR", error)
    return new NextResponse(error.message || "Internal Server Error", { status: 400 })
  }
}
