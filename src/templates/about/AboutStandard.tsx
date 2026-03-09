import React from "react";
import type { AboutSchema } from "@/lib/ai/openai";
import { z } from "zod";

type AboutProps = z.infer<typeof AboutSchema>;

export const AboutStandard = ({ title, paragraphs }: AboutProps) => {
    return (
        <section className="template-section">
            <div className="template-container">
                <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>

                    <div className="animate-ready">
                        <h2 className="template-title" style={{ marginBottom: "2.5rem" }}>
                            {title}
                            <div style={{
                                width: "60px",
                                height: "4px",
                                background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
                                margin: "1rem auto 0",
                                borderRadius: "4px"
                            }} />
                        </h2>

                        <div style={{
                            background: "hsl(var(--surface) / 0.5)",
                            backdropFilter: "blur(10px)",
                            padding: "3rem",
                            borderRadius: "calc(var(--border-radius) * 2)",
                            border: "1px solid hsl(var(--border) / 0.5)",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.02)"
                        }}>
                            {paragraphs.map((p, index) => (
                                <p key={index} style={{
                                    color: "hsl(var(--text-muted))",
                                    fontSize: "clamp(1.125rem, 2vw, 1.25rem)",
                                    lineHeight: 1.8,
                                    marginBottom: index === paragraphs.length - 1 ? 0 : "1.5rem"
                                }}>
                                    {p}
                                </p>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
