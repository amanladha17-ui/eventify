import prisma from '@/lib/prisma'
import { Calendar, MapPin, Users, ArrowLeft, ShieldCheck, Tag, ChevronRight, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import BookingButton from '@/components/BookingButton'

export const dynamic = 'force-dynamic'

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params;
    
    const event = await prisma.event.findUnique({
        where: { id: resolvedParams.id },
    })

    if (!event) notFound()

    const isFull = event.bookingsCount >= event.capacity

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Hero Header */}
            <div className="h-[60vh] relative">
                {event.bannerImage ? (
                    <Image src={event.bannerImage} alt={event.name} fill className="object-cover opacity-60" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                
                <div className="absolute top-8 left-8">
                    <Link href="/events" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <ArrowLeft className="w-4 h-4" /> Back to Explorations
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-12">
                    <div className="container mx-auto max-w-5xl">
                        <span className="px-4 py-1.5 bg-primary text-white rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
                            {event.category.replace('_', ' ')}
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-tight">{event.name}</h1>
                        <div className="flex flex-wrap items-center gap-8 text-lg font-medium text-zinc-300">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-secondary" />
                                {new Date(event.dateTime).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-secondary" />
                                {event.venue}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto max-w-5xl px-12 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left: Description */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="prose prose-invert max-w-none">
                            <h2 className="text-3xl font-bold mb-6">About the Event</h2>
                            <p className="text-zinc-400 text-lg leading-relaxed whitespace-pre-wrap">{event.description}</p>
                        </div>

                        {event.tags.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                                    <Tag className="w-4 h-4" /> Tags & Highlights
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {event.tags.map(tag => (
                                        <span key={tag} className="px-5 py-2 glass rounded-2xl text-sm font-medium border-white/10">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Booking Card */}
                    <aside className="relative">
                        <div className="sticky top-12 glass p-10 rounded-[40px] border-white/10 shadow-2xl">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Ticket Price</p>
                                    <p className="text-4xl font-black text-primary">₹{event.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Available Seats</p>
                                    <p className="text-xl font-bold">{event.capacity - event.bookingsCount}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-3 text-sm text-zinc-400 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <ShieldCheck className="w-5 h-5 text-green-400" /> Secure checkout powered by Eventify
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-400 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <Zap className="w-5 h-5 text-secondary" /> Instant confirmation & digital tickets
                                </div>
                            </div>

                            {session ? (
                                <BookingButton eventId={event.id} isFull={isFull} />
                            ) : (
                                <Link 
                                    href="/auth/customer/login"
                                    className="w-full py-5 bg-white/10 text-white rounded-[24px] font-black text-center block hover:bg-white/20 transition-all border border-white/10"
                                >
                                    LOGIN TO BOOK
                                </Link>
                            )}

                            <p className="text-center text-xs text-zinc-500 mt-6">
                                By booking, you agree to our Terms and Conditions.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
