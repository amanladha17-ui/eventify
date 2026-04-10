import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { 
        name, 
        category, 
        description, 
        dateTime, 
        venue, 
        price, 
        capacity, 
        bannerImage, 
        tags,
        isRefundable,
    } = body

    if (!name || !category || !description || !dateTime || !venue || capacity === undefined) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const event = await prisma.event.create({
      data: {
        name,
        category,
        description,
        dateTime: new Date(dateTime),
        venue,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        bannerImage,
        tags,
        isRefundable: isRefundable !== undefined ? isRefundable : true,
        status: 'PUBLISHED' // Default to published for now
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("EVENT_POST_ERROR", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(req: Request) {
    try {
        const events = await prisma.event.findMany({
            orderBy: { dateTime: 'desc' }
        })
        return NextResponse.json(events)
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
