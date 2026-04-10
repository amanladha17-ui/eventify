"use client";

import { useState } from "react";
import { ChevronRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BookingButton({ eventId, isFull }: { eventId: string, isFull: boolean }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleBooking = async () => {
        if (isFull) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ eventId }),
            });
            
            if (!res.ok) {
                const errorMessage = await res.text();
                throw new Error(errorMessage || "Failed to book event");
            }
            
            setIsSuccess(true);
            router.refresh(); // Refresh page to update ticket counts
            
            // Redirect to bookings page after short delay
            setTimeout(() => {
                router.push("/my-bookings");
            }, 2000);
            
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="w-full py-5 rounded-[24px] bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center gap-3 font-black text-xl">
                <CheckCircle2 className="w-6 h-6" /> PAYMENT SUCCESSFUL
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <button 
                onClick={handleBooking}
                disabled={isFull || isLoading}
                className={`w-full py-5 rounded-[24px] font-black text-xl transition-all flex items-center justify-center gap-3 ${
                    isFull || isLoading
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(124,58,237,0.4)]'
                }`}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-6 h-6 animate-spin" /> PROCESSING...
                    </>
                ) : isFull ? (
                    'FULLY BOOKED'
                ) : (
                    <>SECURE MY SPOT <ChevronRight className="w-6 h-6" /></>
                )}
            </button>
            
            {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-2xl border border-red-500/20 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
