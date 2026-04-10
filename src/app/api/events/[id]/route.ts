import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const resolvedParams = await params;

    const event = await prisma.event.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        category,
        description,
        dateTime: dateTime ? new Date(dateTime) : undefined,
        venue,
        price: price !== undefined ? parseFloat(price) : undefined,
        capacity: capacity !== undefined ? parseInt(capacity) : undefined,
        bannerImage,
        tags,
        isRefundable: isRefundable !== undefined ? isRefundable : undefined,
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("EVENT_PATCH_ERROR", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const event = await prisma.event.findUnique({
            where: { id: resolvedParams.id }
        })
        
        if (!event) {
            return new NextResponse("Not Found", { status: 404 })
        }

        return NextResponse.json(event)
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
