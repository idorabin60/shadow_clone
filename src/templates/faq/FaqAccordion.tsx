import React from "react";
import type { FaqSchema } from "@/lib/ai/openai";
import { z } from "zod";

type FaqProps = z.infer<typeof FaqSchema>;

export const FaqAccordion = ({ sectionTitle, faqs }: FaqProps) => {
    return (
        <section className="template-section">
            <div className="template-container" style={{ maxWidth: "800px" }}>
                <h2 className="template-title">{sectionTitle}</h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {faqs.map((faq, idx) => (
                        <details
                            key={idx}
                            style={{
                                backgroundColor: "hsl(var(--surface))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--border-radius)",
                                padding: "1.5rem",
                                cursor: "pointer"
                            }}
                        >
                            <summary style={{
                                fontFamily: "var(--font-heading)",
                                fontSize: "1.125rem",
                                fontWeight: 700,
                                color: "hsl(var(--text))",
                                outline: "none",
                                listStyle: "none",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                {faq.question}
                                <span style={{ color: "hsl(var(--primary))", fontSize: "1.5rem" }}>+</span>
                            </summary>
                            <div style={{
                                marginTop: "1rem",
                                paddingTop: "1rem",
                                borderTop: "1px solid hsl(var(--border))",
                                color: "hsl(var(--text-muted))",
                                lineHeight: 1.6
                            }}>
                                {faq.answer}
                            </div>
                        </details>
                    ))}
                </div>
            </div>

            {/* Small inline style to hide the default details disclosure triangle since we added a custom '+' sign */}
            <style>{`
        details > summary::-webkit-details-marker {
          display: none;
        }
      `}</style>
        </section>
    );
};
