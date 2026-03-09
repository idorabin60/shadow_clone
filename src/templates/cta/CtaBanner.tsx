import React from "react";
import type { CtaSchema } from "@/lib/ai/openai";
import { z } from "zod";

type CtaProps = z.infer<typeof CtaSchema>;

export const CtaBanner = ({ title, subtitle, buttonText }: CtaProps) => {
    return (
        <section className="template-section" style={{
            backgroundColor: "hsl(var(--primary))",
            color: "white"
        }}>
            <div className="template-container" style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <h2 style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 800,
                    marginBottom: "1rem",
                    color: "white" // Force white text regardless of theme
                }}>
                    {title}
                </h2>

                <p style={{
                    fontSize: "1.25rem",
                    marginBottom: "2.5rem",
                    opacity: 0.9,
                    maxWidth: "700px",
                    marginInline: "auto"
                }}>
                    {subtitle}
                </p>

                <button style={{
                    backgroundColor: "white",
                    color: "hsl(var(--primary))",
                    padding: "1rem 3rem",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    border: "none",
                    borderRadius: "var(--border-radius)",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s"
                }}>
                    {buttonText}
                </button>
            </div>
        </section>
    );
};
