import React from "react";
import type { HeroSchema } from "@/lib/ai/openai";
import { z } from "zod";

type HeroProps = z.infer<typeof HeroSchema>;

export const HeroCentered = ({ headline, subHeadline, ctaText }: HeroProps) => {
    return (
        <section className="template-section" style={{
            paddingTop: "10rem",
            paddingBottom: "10rem",
            position: "relative",
            backgroundColor: "hsl(var(--background))"
        }}>
            {/* Decorative Background Elements */}
            <div className="hero-blob-1"></div>
            <div className="hero-blob-2"></div>

            <div className="template-container animate-ready" style={{ textAlign: "center" }}>

                {/* Subtle pill badge */}
                <div style={{
                    display: "inline-block",
                    padding: "0.5rem 1.25rem",
                    backgroundColor: "hsl(var(--primary) / 0.1)",
                    color: "hsl(var(--primary))",
                    borderRadius: "999px",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    marginBottom: "2rem",
                    border: "1px solid hsl(var(--primary) / 0.2)"
                }}>
                    ברוכים הבאים
                </div>

                <h1 style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(3rem, 6vw, 4.5rem)",
                    fontWeight: 900,
                    color: "hsl(var(--text))",
                    marginBottom: "1.5rem",
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em"
                }}>
                    {headline.split(" ").map((word, index, array) => {
                        // Highlight the last word or two dynamically using the new class
                        const isHighlight = index >= array.length - 2;
                        return (
                            <span key={index} className={isHighlight ? "text-gradient" : ""} style={{ display: "inline-block", marginLeft: "0.25em" }}>
                                {word}
                            </span>
                        );
                    })}
                </h1>

                <p className="template-subtitle" style={{ fontSize: "clamp(1.25rem, 2vw, 1.5rem)", maxWidth: "800px" }}>
                    {subHeadline}
                </p>

                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1rem" }}>
                    <button className="template-button">
                        {ctaText}
                    </button>
                    <button style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1rem 2.5rem",
                        backgroundColor: "transparent",
                        color: "hsl(var(--text))",
                        fontWeight: 700,
                        fontFamily: "var(--font-heading)",
                        borderRadius: "9999px",
                        border: "2px solid hsl(var(--border))",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        fontSize: "1.125rem"
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "hsl(var(--primary))";
                            e.currentTarget.style.color = "hsl(var(--primary))";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "hsl(var(--border))";
                            e.currentTarget.style.color = "hsl(var(--text))";
                        }}
                    >
                        מי אנחנו הגלילה מטה
                    </button>
                </div>
            </div>
        </section>
    );
};
