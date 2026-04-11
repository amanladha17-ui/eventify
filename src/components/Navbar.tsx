"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Calendar, User, LogOut, LayoutDashboard, ShieldCheck, Ticket } from "lucide-react"

export default function Navbar() {
    const { data: session, status } = useSession()
    const pathname = usePathname()

    if (pathname.startsWith('/auth') || pathname === '/') {
        return null
    }

    return (
        <nav className="border-b border-white/5 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-black text-white group-hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all">
                        E
                    </div>
                    <span className="text-xl font-black tracking-tighter">Eventify</span>
                </Link>

                {/* Navigation Links */}
                <div className="flex flex-1 mx-8 border-l border-r border-white/5 px-8 hidden md:flex">
                    <Link href="/events" className="text-zinc-400 hover:text-white font-medium text-sm transition-colors flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Explore Events
                    </Link>
                </div>

                {/* Auth State */}
                <div className="flex items-center gap-4">
                    {status === "loading" ? (
                        <div className="w-24 h-10 bg-white/5 animate-pulse rounded-full"></div>
                    ) : session ? (
                        <div className="flex items-center gap-6">
                            {session.user?.role === "ADMIN" ? (
                                <Link href="/admin/dashboard" className="text-sm font-bold text-red-400 flex items-center gap-2 hover:text-red-300">
                                    <ShieldCheck className="w-4 h-4" /> Dashboard
                                </Link>
                            ) : (
                                <Link href="/my-bookings" className="text-sm font-bold text-primary flex items-center gap-2 hover:text-primary/80">
                                    <Ticket className="w-4 h-4" /> My Bookings
                                </Link>
                            )}

                            <button 
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link 
                                href="/auth/customer/login"
                                className="text-zinc-400 hover:text-white text-sm font-bold px-4 py-2 transition-colors"
                            >
                                Login
                            </Link>
                            <Link 
                                href="/auth/customer/register"
                                className="text-sm font-bold bg-primary text-white px-5 py-2 rounded-full hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    )
}
