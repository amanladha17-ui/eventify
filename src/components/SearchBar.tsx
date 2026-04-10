"use client"

import { Search } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function SearchBar({ placeholder = "Search..." }: { placeholder?: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    
    // Initialize state with URL param if it exists, otherwise empty string
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

    useEffect(() => {
        // Create an explicit timeout to debounce the router.push
        const delayDebounceFn = setTimeout(() => {
            const current = new URLSearchParams(Array.from(searchParams.entries()))
            
            if (searchTerm) {
                current.set("search", searchTerm)
            } else {
                current.delete("search")
            }
            
            const search = current.toString()
            const query = search ? `?${search}` : ""
            
            router.push(`${pathname}${query}`)
        }, 300) // 300ms debounce

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, pathname, router, searchParams])

    return (
        <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all text-white placeholder:text-zinc-600"
            />
        </div>
    )
}
