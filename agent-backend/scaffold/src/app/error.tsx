"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
    return (
        <div dir="rtl" className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">שגיאה</h2>
                <button onClick={() => reset()} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                    נסה שוב
                </button>
            </div>
        </div>
    );
}
