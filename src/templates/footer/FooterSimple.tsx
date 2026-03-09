import React from "react";
import type { BusinessInput } from "@/lib/ai/prompts";

interface FooterProps {
    businessInfo: BusinessInput;
}

export const FooterSimple = ({ businessInfo }: FooterProps) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            backgroundColor: "hsl(var(--background))",
            borderTop: "1px solid hsl(var(--border))",
            padding: "4rem 1.5rem 2rem",
            color: "hsl(var(--text-muted))"
        }}>
            <div className="template-container" style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem"
            }}>

                {/* Top Section */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center"
                }}>
                    <h3 style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.5rem",
                        color: "hsl(var(--text))",
                        marginBottom: "1rem"
                    }}>
                        {businessInfo.businessName}
                    </h3>
                    <p style={{ maxWidth: "400px", lineHeight: "1.6", marginBottom: "2rem" }}>
                        {businessInfo.description}
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}>
                        {businessInfo.contactInfo?.phone && (
                            <span style={{ fontWeight: 600 }}>טלפון: <span style={{ direction: "ltr", display: "inline-block" }}>{businessInfo.contactInfo.phone}</span></span>
                        )}
                        {businessInfo.contactInfo?.email && (
                            <span style={{ fontWeight: 600 }}>אימייל: <span style={{ direction: "ltr", display: "inline-block" }}>{businessInfo.contactInfo.email}</span></span>
                        )}
                        {businessInfo.contactInfo?.address && (
                            <span style={{ fontWeight: 600 }}>כתובת: {businessInfo.contactInfo.address}</span>
                        )}
                    </div>
                </div>

                {/* Bottom Section */}
                <div style={{
                    borderTop: "1px solid hsl(var(--border))",
                    paddingTop: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                    fontSize: "0.875rem"
                }}>
                    <p>© {currentYear} {businessInfo.businessName}. כל הזכויות שמורות.</p>
                    <p style={{ opacity: 0.7 }}>
                        נבנה באמצעות AI Landing Page Builder
                    </p>
                </div>
            </div>
        </footer>
    );
};
