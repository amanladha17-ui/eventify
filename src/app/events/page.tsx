import prisma from '@/lib/prisma'
import { Calendar, Filter, MapPin, Search, Tag, Zap, Mic2, Star, Trophy, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
export const dynamic = 'force-dynamic'

export default async function EventsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; search?: string }>
}) {
    const resolvedSearchParams = await searchParams;

    const events = await prisma.event.findMany({
        where: {
            status: 'PUBLISHED',
            ...(resolvedSearchParams.category && { category: resolvedSearchParams.category as any }),
            ...(resolvedSearchParams.search && {
                OR: [
                    { name: { contains: resolvedSearchParams.search, mode: 'insensitive' } },
                    { description: { contains: resolvedSearchParams.search, mode: 'insensitive' } },
                ]
            })
        },
        orderBy: { dateTime: 'asc' }
    })

    const categories = [
        { label: 'All', value: '', icon: <Zap className="w-4 h-4" /> },
        { label: 'Hackathons', value: 'HACKATHON', icon: <Zap className="w-4 h-4" /> },
        { label: 'Concerts', value: 'CONCERT', icon: <Mic2 className="w-4 h-4" /> },
        { label: 'Stand-up', value: 'STAND_UP_COMEDY', icon: <Star className="w-4 h-4" /> },
        { label: 'Sports', value: 'SPORTS', icon: <Trophy className="w-4 h-4" /> },
        { label: 'Workshops', value: 'WORKSHOP', icon: <Filter className="w-4 h-4" /> },
    ]

    return (
        <div className="min-h-screen bg-zinc-950 pb-20">
            {/* Header / Search */}
            <div className="bg-white/[0.02] border-b border-white/5 py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div className="max-w-xl">
                            <h1 className="text-5xl font-black mb-4 tracking-tighter">Explore <span className="gradient-text">Events</span></h1>
                            <p className="text-zinc-400">Discover experiences that define your moments.</p>
                        </div>
                        <form action="/events" method="GET" className="relative w-full md:w-96 group">
                            {resolvedSearchParams.category && <input type="hidden" name="category" value={resolvedSearchParams.category} />}
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                name="search"
                                defaultValue={resolvedSearchParams.search || ''}
                                placeholder="Search events..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                            <button type="submit" className="hidden">Search</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filters Sidebar */}
                    <aside className="w-full lg:w-64 space-y-8">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 px-1">Categories</h3>
                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.value}
                                        href={`/events${cat.value ? `?category=${cat.value}` : ''}`}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${(resolvedSearchParams.category === cat.value || (!resolvedSearchParams.category && !cat.value))
                                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                : 'hover:bg-white/5 text-zinc-400'
                                            }`}
                                    >
                                        {cat.icon}
                                        <span className="font-medium">{cat.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="glass p-6 rounded-3xl border-white/5">
                            <p className="text-sm font-bold mb-4">Price Range</p>
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer hover:text-white transition-colors">
                                    <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5" /> Free Events
                                </label>
                                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer hover:text-white transition-colors">
                                    <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5" /> Paid Events
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* Events Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {events.length > 0 ? events.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="group glass rounded-[32px] border-white/5 overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-2"
                                >
                                    <div className="aspect-[16/10] bg-zinc-900 relative">
                                        {event.bannerImage ? (
                                            <Image
                                                src={event.bannerImage}
                                                alt={event.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-black text-4xl">
                                                {event.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                                                {event.category.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-1">{event.name}</h3>

                                        <div className="space-y-3 mb-8">
                                            <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                                <Calendar className="w-4 h-4 text-secondary" />
                                                <span>{new Date(event.dateTime).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                                <MapPin className="w-4 h-4 text-secondary" />
                                                <span className="line-clamp-1">{event.venue}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                            <div>
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Entry Fee</p>
                                                <p className="text-lg font-black text-primary">{event.price === 0 ? 'FREE' : `₹${event.price}`}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Available</p>
                                                <p className="text-sm font-bold">{event.capacity - event.bookingsCount} Seats</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <div className="col-span-full py-32 text-center space-y-4">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                        <Filter className="w-8 h-8 text-zinc-700" />
                                    </div>
                                    <p className="text-zinc-500 italic">No events found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
