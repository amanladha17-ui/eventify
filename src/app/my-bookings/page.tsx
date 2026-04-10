import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Calendar, MapPin, XCircle, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function MyBookingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/customer/login')
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { event: true },
    orderBy: { bookingDate: 'desc' }
  })

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Header */}
      <div className="bg-white/[0.02] border-b border-white/5 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-black mb-2 flex items-center gap-4">
            My <span className="gradient-text">Bookings</span>
          </h1>
          <p className="text-zinc-500">Manage your upcoming and past experiences.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="space-y-6">
          {bookings.length > 0 ? bookings.map((booking) => (
            <div key={booking.id} className="glass p-8 rounded-[32px] border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-primary/30 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center font-black text-2xl text-primary">
                  {booking.event.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{booking.event.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-secondary" />
                      {format(new Date(booking.event.dateTime), 'MMM dd, yyyy • hh:mm a')}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-secondary" />
                      {booking.event.venue}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <Link 
                    href={`/events/${booking.eventId}`}
                    className="flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                    View Info <ExternalLink className="w-4 h-4" />
                </Link>
                {booking.event.isRefundable ? (
                    <button className="flex-1 md:flex-none px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                        Cancel <XCircle className="w-4 h-4" />
                    </button>
                ) : (
                    <button disabled className="flex-1 md:flex-none px-6 py-3 bg-zinc-800/50 text-zinc-500 rounded-xl font-bold flex items-center justify-center transition-all cursor-not-allowed">
                        Non-Refundable
                    </button>
                )}
              </div>
            </div>
          )) : (
            <div className="py-32 text-center bg-white/[0.02] rounded-[40px] border border-dashed border-white/10 space-y-6">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-10 h-10 text-zinc-700" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">No Bookings Yet</h2>
                <p className="text-zinc-500">You haven't reserved any spots. Time to explore!</p>
              </div>
              <Link 
                href="/events"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:shadow-lg transition-all"
              >
                Browse Events <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
