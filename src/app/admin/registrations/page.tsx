import prisma from '@/lib/prisma'
import { Download, Search, Mail, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import SearchBar from '@/components/SearchBar'

export default async function RegistrationsPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams.search || '';

  const bookings = await prisma.booking.findMany({
    where: {
      ...(search && {
        OR: [
          { user: { name: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { event: { name: { contains: search, mode: 'insensitive' } } },
        ]
      })
    },
    include: {
      user: true,
      event: true
    },
    orderBy: { bookingDate: 'desc' }
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black mb-1">Registrations</h1>
          <p className="text-muted-foreground">Monitor attendee bookings across all events.</p>
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all">
          <Download className="w-5 h-5" /> Export to CSV
        </button>
      </div>

      <div className="glass rounded-[32px] border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <div className="w-full md:w-96">
                <SearchBar placeholder="Search by customer or event..." />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01] text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-8 py-4">Customer</th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Booking Date</th>
                <th className="px-6 py-4">Amount Paid</th>
                <th className="px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.length > 0 ? bookings.map((booking) => (
                <tr key={booking.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                            <User className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div>
                            <p className="font-bold text-zinc-100">{booking.user.name}</p>
                            <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {booking.user.email}
                            </p>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary opacity-50" />
                        <span className="font-medium text-zinc-300">{booking.event.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm text-zinc-400">{format(new Date(booking.bookingDate), 'MMM dd, yyyy')}</p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="font-bold text-zinc-200">${booking.event.price}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border bg-green-500/10 text-green-400 border-green-500/20">
                        CONFIRMED
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground italic">
                    No registrations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
