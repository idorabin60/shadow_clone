"use client";
import { useState, useEffect } from "react";

export function LiveTimer({ startedAt }: { startedAt: number }) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startedAt) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [startedAt]);

    if (elapsed < 1) return null;

    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const display = mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : `${secs}s`;

    return <span className="text-[11px] text-zinc-600 font-mono tabular-nums">{display}</span>;
}
