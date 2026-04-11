import Link from 'next/link'
import { Calendar, Shield, Users, ArrowRight, Zap, Star, Trophy, Mic2 } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 blur-[120px] rounded-full -z-10" />



      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 animate-fade-in">
          <Zap className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium">The Future of Event Management</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight">
          Unforgettable <span className="gradient-text tracking-tighter">Experiences</span> <br className="hidden md:block" /> Start Here.
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Host, manage, and discover the best events in your city. From high-stakes hackathons to soul-stirring concerts.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link 
            href="/auth/customer/login"
            className="group relative px-8 py-4 bg-primary text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2">
              Customer Login <Users className="w-5 h-5" />
            </span>
          </Link>
          
          <Link 
            href="/auth/admin/login"
            className="group px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2"
          >
            Admin Portal <Shield className="w-5 h-5 group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section id="categories" className="container mx-auto px-6 py-24 border-t border-white/5">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-bold mb-4">Explore Categories</h2>
            <p className="text-muted-foreground">Find what moves you.</p>
          </div>
          <Link href="/events" className="text-primary font-medium flex items-center gap-2 hover:gap-3 transition-all">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CategoryCard icon={<Zap className="w-6 h-6" />} label="Hackathons" color="from-blue-500/20" />
          <CategoryCard icon={<Mic2 className="w-6 h-6" />} label="Concerts" color="from-purple-500/20" />
          <CategoryCard icon={<Star className="w-6 h-6" />} label="Stand-up" color="from-yellow-500/20" />
          <CategoryCard icon={<Trophy className="w-6 h-6" />} label="Sports" color="from-green-500/20" />
        </div>
      </section>
    </main>
  )
}

function CategoryCard({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) {
  return (
    <div className={`glass p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group`}>
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-bold text-lg">{label}</h3>
    </div>
  )
}
