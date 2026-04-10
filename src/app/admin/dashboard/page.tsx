import prisma from '@/lib/prisma'
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  CheckCircle,
  Eye
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  // Fetch real data from Prisma
  const totalEvents = await prisma.event.count()
  const totalBookings = await prisma.booking.count()
  const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } })
  const publishedEvents = await prisma.event.count({ where: { status: 'PUBLISHED' } })
  
  // Basic revenue calculation (Sum of price * bookingsCount for all events)
  const events = await prisma.event.findMany({
    select: { price: true, bookingsCount: true }
  })
  const revenue = events.reduce((acc, event) => acc + (event.price * event.bookingsCount), 0)

  const recentEvents = await prisma.event.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black mb-2">Overview</h1>
        <p className="text-muted-foreground text-lg">Your event platform at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          icon={<Calendar className="w-6 h-6 text-primary" />} 
          label="Total Events" 
          value={totalEvents.toString()} 
          change="+12% from last month"
        />
        <StatsCard 
          icon={<Users className="w-6 h-6 text-secondary" />} 
          label="Total Bookings" 
          value={totalBookings.toString()} 
          change="+24% from last month"
        />
        <StatsCard 
          icon={<DollarSign className="w-6 h-6 text-green-400" />} 
          label="Net Revenue" 
          value={`₹${revenue.toLocaleString()}`} 
          change="+18% from last month"
        />
        <StatsCard 
          icon={<TrendingUp className="w-6 h-6 text-pink-400" />} 
          label="Conversion Rate" 
          value="4.2%" 
          change="+0.5% from last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Events */}
        <div className="lg:col-span-2 glass rounded-3xl p-8 border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              Recent Events <Calendar className="w-5 h-5 text-primary opacity-50" />
            </h3>
            <Link href="/admin/events" className="text-primary text-sm font-medium hover:underline">View All</Link>
          </div>
          
          <div className="space-y-6">
            {recentEvents.length > 0 ? recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {event.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold group-hover:text-primary transition-colors">{event.name}</h4>
                    <p className="text-xs text-muted-foreground">{event.category} • {event.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-bold">{event.bookingsCount} / {event.capacity}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">Booked</p>
                  </div>
                  <Link href={`/admin/events/${event.id}`} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <Eye className="w-4 h-4 text-zinc-400" />
                  </Link>
                </div>
              </div>
            )) : (
                <div className="py-12 text-center text-muted-foreground">
                    No events found. Start by creating one!
                </div>
            )}
          </div>
        </div>

        {/* Platform Health */}
        <div className="glass rounded-3xl p-8 border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-8">System Health</h3>
            <div className="space-y-6">
                <HealthItem label="Database Status" status="Active" icon={<CheckCircle className="w-4 h-4 text-green-400" />} />
                <HealthItem label="Storage (Images)" status="84% Free" icon={<CheckCircle className="w-4 h-4 text-green-400" />} />
                <HealthItem label="API Latency" status="24ms" icon={<CheckCircle className="w-4 h-4 text-green-400" />} />
            </div>
          </div>
          
          <div className="mt-12 bg-primary/20 p-6 rounded-2xl border border-primary/20">
            <p className="text-sm font-medium text-primary mb-2">Pro Tip</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Highly visual banner images increase event conversion rates by up to 40%.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ icon, label, value, change }: { icon: React.ReactNode, label: string, value: string, change: string }) {
  return (
    <div className="glass p-6 rounded-3xl border-white/5 hover:border-primary/20 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{change}</span>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-3xl font-black tracking-tighter">{value}</p>
      </div>
    </div>
  )
}

function HealthItem({ label, status, icon }: { label: string, status: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold">{status}</span>
                {icon}
            </div>
        </div>
    )
}
