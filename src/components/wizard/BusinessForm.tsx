import React, { useState } from "react";
import type { BusinessInput } from "@/lib/ai/prompts";

interface BusinessFormProps {
    onSubmit: (data: BusinessInput) => void;
    isLoading: boolean;
}

export const BusinessForm = ({ onSubmit, isLoading }: BusinessFormProps) => {
    const [formData, setFormData] = useState<BusinessInput & { servicesString: string }>({
        businessName: "",
        businessType: "מסעדה",
        description: "",
        uniqueSellingProposition: "",
        targetAudience: "",
        servicesString: "", // Temporary string to parse into the array
        services: [],
        tone: "professional",
        contactInfo: { phone: "" }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Parse the comma separated services string
        const parsedServices = formData.servicesString
            .split(",")
            .map(s => s.trim())
            .filter(s => s.length > 0);

        onSubmit({
            ...formData,
            services: parsedServices
        });
    };

    const inputStyle = {
        width: "100%",
        padding: "0.75rem",
        borderRadius: "var(--border-radius)",
        border: "1px solid hsl(var(--border))",
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--text))",
        fontFamily: "var(--font-body)",
        marginBottom: "1rem",
        transition: "border-color 0.2s"
    };

    const labelStyle = {
        display: "block",
        marginBottom: "0.5rem",
        fontWeight: 600,
        fontSize: "0.875rem",
        color: "hsl(var(--text))"
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div>
                <label style={labelStyle}>שם העסק *</label>
                <input
                    required
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder='לדוגמה: "מוסך רונן"'
                    style={inputStyle}
                />
            </div>

            <div>
                <label style={labelStyle}>סוג תעשייה/עסק *</label>
                <input
                    required
                    type="text"
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    placeholder='לדוגמה: מוסך, משרד עו"ד'
                    style={inputStyle}
                />
            </div>

            <div>
                <label style={labelStyle}>תיאור קצר של העסק *</label>
                <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="מה אתם עושים בדיוק?"
                    style={{ ...inputStyle, resize: "vertical" }}
                />
            </div>

            <div>
                <label style={labelStyle}>ייחודיות (למה לבחור בכם?) *</label>
                <textarea
                    required
                    rows={2}
                    value={formData.uniqueSellingProposition}
                    onChange={(e) => setFormData({ ...formData, uniqueSellingProposition: e.target.value })}
                    placeholder="לדוגמה: פתוחים 24/7, מחירים הוגנים, ניסיון של 20 שנה"
                    style={{ ...inputStyle, resize: "vertical" }}
                />
            </div>

            <div>
                <label style={labelStyle}>איזה שירותים אתם מספקים? *</label>
                <input
                    required
                    type="text"
                    value={formData.servicesString}
                    onChange={(e) => setFormData({ ...formData, servicesString: e.target.value })}
                    placeholder='הפרד בפסיק: תיקון מנוע, החלפת מצבר, פאנצ׳ר מאכר'
                    style={inputStyle}
                />
            </div>

            <div>
                <label style={labelStyle}>קהל יעד</label>
                <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder='לדוגמה: משפחות, צעירים, לקוחות עסקיים'
                    style={inputStyle}
                />
            </div>

            <div>
                <label style={labelStyle}>סגנון כתיבה</label>
                <select
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
                    style={inputStyle}
                >
                    <option value="professional">אמין ומקצועי (Professional)</option>
                    <option value="friendly">בית וחמים (Friendly)</option>
                    <option value="luxury">יוקרתי (Luxury)</option>
                    <option value="casual">קליל (Casual)</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    backgroundColor: isLoading ? "hsl(var(--secondary))" : "hsl(var(--primary))",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--border-radius)",
                    fontFamily: "var(--font-heading)",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    cursor: isLoading ? "not-allowed" : "pointer"
                }}
            >
                {isLoading ? "...מייצר אתר בבינה מלאכותית" : "צור דף נחיתה!"}
            </button>
        </form>
    );
};
