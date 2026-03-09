import React from "react";
import type { ServicesSchema } from "@/lib/ai/openai";
import { z } from "zod";

type ServicesProps = z.infer<typeof ServicesSchema>;

export const ServicesGrid = ({ sectionTitle, services }: ServicesProps) => {
    return (
        <section className="template-section">
            <div className="template-container">

                <div className="animate-ready" style={{ textAlign: "center", marginBottom: "4rem" }}>
                    <div style={{
                        display: "inline-block",
                        padding: "0.5rem 1rem",
                        backgroundColor: "hsl(var(--primary) / 0.1)",
                        color: "hsl(var(--primary))",
                        borderRadius: "999px",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        marginBottom: "1rem",
                    }}>
                        שירותי העסק
                    </div>
                    <h2 className="template-title" style={{ marginBottom: "1rem" }}>{sectionTitle}</h2>
                </div>

                <div className="template-grid-3 animate-ready">
                    {services.map((service, idx) => (
                        <div key={idx} className="template-card">
                            <div style={{
                                width: "56px",
                                height: "56px",
                                borderRadius: "1rem",
                                background: "linear-gradient(135deg, hsl(var(--primary)/0.2), hsl(var(--accent)/0.2))",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "1.5rem",
                                color: "hsl(var(--primary))",
                                boxShadow: "inset 0 2px 4px rgba(255,255,255,0.5)"
                            }}>
                                <span style={{ fontSize: "1.5rem", fontWeight: "900", fontFamily: "var(--font-heading)" }}>
                                    {(idx + 1).toString().padStart(2, '0')}
                                </span>
                            </div>
                            <h3 className="template-card-title">{service.title}</h3>
                            <p className="template-card-text">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
