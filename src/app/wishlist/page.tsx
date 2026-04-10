import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Heart, Calendar, MapPin, ArrowRight, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function WishlistPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/customer/login')
  }

  const wishlistItems = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: { event: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <div className="bg-white/[0.02] border-b border-white/5 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-black mb-2 flex items-center gap-4">
            My <span className="gradient-text">Wishlist</span> <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
          </h1>
          <p className="text-zinc-500">Saved events you don't want to miss.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group glass rounded-[32px] border-white/5 overflow-hidden hover:border-pink-500/50 transition-all relative">
                <div className="aspect-[16/10] bg-zinc-900 relative">
                  {item.event.bannerImage && (
                    <Image src={item.event.bannerImage} alt={item.event.name} fill className="object-cover" />
                  )}
                  <div className="absolute top-4 right-4">
                    <button className="p-3 bg-black/50 backdrop-blur-md rounded-full text-zinc-400 hover:text-red-500 border border-white/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-4 line-clamp-1">{item.event.name}</h3>
                  <div className="space-y-3 mb-8 text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-pink-500" />
                      {new Date(item.event.dateTime).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-pink-500" />
                      {item.event.venue}
                    </div>
                  </div>
                  <Link 
                    href={`/events/${item.eventId}`}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white/[0.02] rounded-[40px] border border-dashed border-white/10 space-y-6">
            <div className="w-24 h-24 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto text-pink-500">
              <Heart className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Your Wishlist is Empty</h2>
              <p className="text-zinc-500">Save events you're interested in by clicking the heart icon.</p>
            </div>
            <Link 
              href="/events"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:shadow-lg transition-all"
            >
              Discover Events <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
