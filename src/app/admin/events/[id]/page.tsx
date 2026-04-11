import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users, Calendar, MapPin, Mail } from "lucide-react"

export default async function AdminEventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const event = await prisma.event.findUnique({
    where: { id: resolvedParams.id },
    include: {
      bookings: {
        include: {
          user: true
        },
        orderBy: {
          bookingDate: 'desc'
        }
      }
    }
  })

  if (!event) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start md:items-center gap-4 mb-4">
        <Link href="/admin/dashboard" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors hidden md:flex mt-1 md:mt-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">{event.name}</h1>
          <p className="text-muted-foreground flex flex-col md:flex-row items-start md:items-center gap-2 text-sm md:text-base">
            <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> {new Date(event.dateTime).toLocaleDateString()}
            </span>
            <span className="hidden md:inline mx-2 opacity-30">•</span>
            <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> {event.venue}
            </span>
          </p>
        </div>
      </div>

      {/* Participants List */}
      <div className="glass rounded-[32px] p-6 md:p-8 border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div>
              <h2 className="text-2xl font-black flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Registrations
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                  {event.bookings.length} {event.bookings.length === 1 ? 'participant has' : 'participants have'} registered for this event.
              </p>
          </div>
          <Link href={`/admin/events/${event.id}/edit`} className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full font-bold text-sm transition-all hidden md:block">
            Edit Event
          </Link>
        </div>

        {event.bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {event.bookings.map((booking) => (
              <div key={booking.id} className="flex flex-col p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center font-bold group-hover:bg-primary/20 transition-colors">
                        <Users className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold text-lg leading-tight truncate">{booking.user.name || 'Anonymous'}</p>
                        <p className="text-sm text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
                            <Mail className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{booking.user.email}</span>
                        </p>
                    </div>
                </div>
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Booking Date</span>
                    <span className="text-xs text-zinc-300 font-medium tracking-tight">
                        {new Date(booking.bookingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
            <Users className="w-12 h-12 text-zinc-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Registrations Yet</h3>
            <p className="text-zinc-500 max-w-sm text-sm">When participants register for this event, their details will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
