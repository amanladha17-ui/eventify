'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Tag, Users, Image as ImageIcon, ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { Category } from '@prisma/client'

const categories = Object.values(Category)

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    category: 'OTHER' as Category,
    description: '',
    dateTime: '',
    venue: '',
    price: 0,
    capacity: 0,
    bannerImage: '',
    tags: [] as string[],
    isRefundable: true,
    status: 'DRAFT'
  })

  const [tagInput, setTagInput] = useState('')

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      }
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await axios.post('/api/events', formData)
      router.push('/admin/events')
      router.refresh()
    } catch (err: any) {
      setError(err.response?.data || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/events" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-4xl font-black mb-1">Create Event</h1>
          <p className="text-muted-foreground">Fill in the details to host a new experience.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
                {error}
            </div>
        )}

        {/* Basic Info */}
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-6">
          <h3 className="text-xl font-bold border-b border-white/5 pb-4 mb-6">General Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 px-1">Event Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Midnight Jazz Festival"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 px-1">Category</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-zinc-900">{cat.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 px-1">Description (Markdown Supported)</label>
            <textarea
              required
              rows={5}
              placeholder="Tell us more about the event..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        {/* Logistics */}
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-6">
          <h3 className="text-xl font-bold border-b border-white/5 pb-4 mb-6">Logistics & Capacity</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 px-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date & Time
              </label>
              <input
                required
                type="datetime-local"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 px-1 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Venue / Location
              </label>
              <input
                required
                type="text"
                placeholder="Stadium, Convention Center, etc."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 px-1 flex items-center gap-2">
                <Users className="w-4 h-4" /> Available Seats
              </label>
              <input
                required
                type="number"
                min="1"
                placeholder="500"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 px-1 flex items-center gap-2">
                ₹ Ticket Price (0 for Free)
              </label>
              <input
                required
                type="number"
                min="0"
                placeholder="49.99"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.price === 0 && !formData.price ? '' : formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2 pt-4 border-t border-white/5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.isRefundable ? 'bg-primary' : 'bg-zinc-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${formData.isRefundable ? 'translate-x-7' : 'translate-x-1'}`} />
                </div>
                <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={formData.isRefundable} 
                    onChange={(e) => setFormData({ ...formData, isRefundable: e.target.checked })}
                />
                <div>
                   <p className="font-bold text-white group-hover:text-primary transition-colors">Refundable Event</p>
                   <p className="text-xs text-zinc-500">Allow customers to cancel and refund bookings.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Media & Tags */}
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-6">
          <h3 className="text-xl font-bold border-b border-white/5 pb-4 mb-6">Media & Tags</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 px-1 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Banner Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={formData.bannerImage}
              onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-zinc-400 px-1 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Tags (Press Enter)
            </label>
            <input
              type="text"
              placeholder="e.g. beginner-friendly, networking"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={tagInput}
              onKeyDown={handleAddTag}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-medium flex items-center gap-2">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">&times;</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
            <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-4 text-zinc-400 font-bold hover:text-white transition-colors"
            >
                Cancel
            </button>
            <button
                disabled={loading}
                type="submit"
                className="px-8 py-4 bg-primary text-white font-bold rounded-2xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Event</>}
            </button>
        </div>
      </form>
    </div>
  )
}
