'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowRight, Lock, Mail, ShieldAlert, KeyRound } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      ...formData,
      role: 'ADMIN',
      redirect: false
    })

    if (res?.error) {
      setError('Invalid admin credentials')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-zinc-950">
      {/* Strict Administrative Background Elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-zinc-950 to-zinc-950" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 w-full max-w-md mx-auto p-6 sm:p-10">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6 relative">
             <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
             <div className="w-16 h-16 bg-black border border-red-500/30 rounded-2xl flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <KeyRound className="text-red-500 w-8 h-8" />
             </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Admin Portal</h1>
          <p className="text-zinc-400 text-sm uppercase tracking-widest font-semibold text-red-500/80">Authorized access only</p>
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-red-500/20 p-8 rounded-[2rem] shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-950/50 border border-red-500/30 text-red-400 text-sm rounded-xl text-center flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
                <ShieldAlert className="w-4 h-4" /> {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Admin Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                  <input
                    required
                    type="email"
                    placeholder="admin@eventify.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:ring-1 focus:ring-red-500 focus:border-red-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:ring-1 focus:ring-red-500 focus:border-red-500/50 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 mt-4 bg-red-600 hover:bg-red-500 text-white font-bold tracking-wide rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] disabled:opacity-50 disabled:hover:shadow-none"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Authenticate <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                &larr; Return to main site
            </Link>
        </div>

      </div>
    </div>
  )
}
