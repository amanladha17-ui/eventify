import prisma from '@/lib/prisma'
import { Plus, Search, Filter, Edit, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import DeleteEventButton from '@/components/admin/DeleteEventButton'
import SearchBar from '@/components/SearchBar'

export const dynamic = 'force-dynamic'

export default async function AdminEventsPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const resolvedSearchParams = await searchParams;
  
  const events = await prisma.event.findMany({
    where: {
      ...(resolvedSearchParams.search && {
        OR: [
          { name: { contains: resolvedSearchParams.search, mode: 'insensitive' } },
        ]
      })
    },
    orderBy: { dateTime: 'desc' }
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black mb-1">Events</h1>
          <p className="text-muted-foreground">Manage and monitor all platform events.</p>
        </div>
        <Link 
          href="/admin/events/new"
          className="px-6 py-3 bg-primary text-white font-bold rounded-2xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all"
        >
          <Plus className="w-5 h-5" /> Create New Event
        </Link>
      </div>

      <div className="glass rounded-[32px] border-white/5 overflow-hidden">
        {/* Table Header / Filters */}
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02]">
            <div className="w-full md:w-96">
                <SearchBar placeholder="Search events..." />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-white/10 transition-colors">
                    <Filter className="w-4 h-4" /> Filter
                </button>
                <select className="flex-1 md:flex-none bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none cursor-pointer hover:bg-white/10 transition-colors">
                    <option value="all">All Categories</option>
                    <option value="HACKATHON">Hackathon</option>
                    <option value="CONCERT">Concert</option>
                </select>
            </div>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01] text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-8 py-4">Event Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Participation</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.length > 0 ? events.map((event) => (
                <tr key={event.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary">
                        {event.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-100">{event.name}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(event.dateTime), 'MMM dd, yyyy • hh:mm a')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-bold px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        {event.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1 w-24">
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400">
                            <span>{Math.round((event.bookingsCount/event.capacity)*100)}%</span>
                            <span>{event.bookingsCount}/{event.capacity}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-primary" 
                                style={{ width: `${(event.bookingsCount/event.capacity)*100}%` }}
                            />
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="font-bold text-primary">{event.price === 0 ? 'FREE' : `₹${event.price}`}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/admin/events/${event.id}/edit`}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                        title="Edit Event"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteEventButton eventId={event.id} eventName={event.name} />
                      <Link href={`/events/${event.id}`} target="_blank" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-secondary" title="View Public Page">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground italic">
                    No events created yet.
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

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        'PUBLISHED': 'bg-green-500/10 text-green-400 border-green-500/20',
        'DRAFT': 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
        'CANCELLED': 'bg-red-500/10 text-red-400 border-red-500/20',
    }
    return (
        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${styles[status]}`}>
            {status}
        </span>
    )
}
