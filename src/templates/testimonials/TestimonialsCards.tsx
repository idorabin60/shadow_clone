import React from "react";
import type { TestimonialsSchema } from "@/lib/ai/openai";
import { z } from "zod";

type TestimonialsProps = z.infer<typeof TestimonialsSchema>;

export const TestimonialsCards = ({ sectionTitle, testimonials }: TestimonialsProps) => {
    return (
        <section className="template-section">
            <div className="template-container">
                <h2 className="template-title">{sectionTitle}</h2>

                <div className="template-grid-3">
                    {testimonials.map((review, idx) => (
                        <div key={idx} className="template-card" style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                        }}>
                            <div style={{ marginBottom: "1.5rem" }}>
                                {/* 5 Stars SVG */}
                                <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem", color: "#F59E0B" }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <svg key={star} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ))}
                                </div>
                                <p style={{
                                    color: "hsl(var(--text-muted))",
                                    lineHeight: 1.6,
                                    fontStyle: "italic"
                                }}>
                                    "{review.text}"
                                </p>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", borderTop: "1px solid hsl(var(--border))", paddingTop: "1rem" }}>
                                <div style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    backgroundColor: "hsl(var(--primary) / 0.1)",
                                    color: "hsl(var(--primary))",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "bold",
                                    fontFamily: "var(--font-heading)"
                                }}>
                                    {review.authorName.charAt(0)}
                                </div>
                                <div style={{ fontWeight: 700, color: "hsl(var(--text))" }}>
                                    {review.authorName}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
