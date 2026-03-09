"use client";

import React, { useState } from "react";

interface SectionEditorOverlayProps {
    sectionKey: string;
    sectionName: string;
    data: any;
    onSave: (sectionKey: string, newData: any) => void;
    children: React.ReactNode;
}

export const SectionEditorOverlay = ({
    sectionKey,
    sectionName,
    data,
    onSave,
    children,
}: SectionEditorOverlayProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<any>(data);

    const handleOpen = () => {
        setEditedData(data); // reset to current before opening
        setIsEditing(true);
    };

    const handleSave = () => {
        onSave(sectionKey, editedData);
        setIsEditing(false);
    };

    const handleChange = (key: string, value: any) => {
        setEditedData((prev: any) => ({ ...prev, [key]: value }));
    };

    // Render a simple recursive form for the JSON object
    const renderFields = (obj: any, path: string = "") => {
        return Object.keys(obj).map((key) => {
            const val = obj[key];
            const fieldPath = path ? `${path}.${key}` : key;

            if (typeof val === "string") {
                return (
                    <div key={fieldPath} style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", marginBottom: "0.25rem", color: "#333" }}>{key}</label>
                        {val.length > 50 ? (
                            <textarea
                                value={val}
                                onChange={(e) => handleChange(key, e.target.value)}
                                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", minHeight: "80px", fontFamily: "inherit", fontSize: "1rem" }}
                            />
                        ) : (
                            <input
                                type="text"
                                value={val}
                                onChange={(e) => handleChange(key, e.target.value)}
                                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", fontFamily: "inherit", fontSize: "1rem" }}
                            />
                        )}
                    </div>
                );
            }

            // Arrays of objects (like Services, FAQ, Testimonials)
            if (Array.isArray(val)) {
                return (
                    <div key={fieldPath} style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px dashed #ccc", borderRadius: "8px" }}>
                        <h4 style={{ marginBottom: "0.5rem", color: "#333", fontSize: "1rem" }}>{key} (Array)</h4>
                        {val.map((item, index) => (
                            <div key={index} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: index < val.length - 1 ? "1px solid #eee" : "none" }}>
                                <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#666" }}>Item {index + 1}</span>
                                {Object.keys(item).map(subKey => (
                                    <div key={subKey} style={{ marginTop: "0.5rem" }}>
                                        <label style={{ display: "block", fontSize: "0.75rem", color: "#333", marginBottom: "0.25rem" }}>{subKey}</label>
                                        <input
                                            type="text"
                                            value={item[subKey]}
                                            onChange={(e) => {
                                                const newArray = [...editedData[key]];
                                                newArray[index] = { ...newArray[index], [subKey]: e.target.value };
                                                handleChange(key, newArray);
                                            }}
                                            style={{ width: "100%", padding: "0.4rem", borderRadius: "4px", border: "1px solid #ddd", fontSize: "0.9rem" }}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                );
            }

            return null;
        });
    };

    return (
        <div
            style={{ position: "relative" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* The actual section template */}
            <div style={{ opacity: isEditing ? 0.3 : 1, transition: "opacity 0.2s" }}>
                {children}
            </div>

            {/* Hover Overlay Button */}
            {isHovered && !isEditing && (
                <div style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    zIndex: 50
                }}>
                    <button
                        onClick={handleOpen}
                        style={{
                            backgroundColor: "white",
                            color: "hsl(var(--primary))",
                            border: "1px solid hsl(var(--primary))",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            padding: "0.5rem 1rem",
                            borderRadius: "999px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}
                    >
                        ✏️ ערוך אזור ({sectionName})
                    </button>
                </div>
            )}

            {/* Editor Modal */}
            {isEditing && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }} dir="rtl">
                    <div style={{
                        backgroundColor: "white",
                        padding: "2rem",
                        borderRadius: "12px",
                        width: "90%",
                        maxWidth: "600px",
                        maxHeight: "85vh",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                    }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#111" }}>
                            עריכת {sectionName}
                        </h3>

                        <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem" }}>
                            {renderFields(editedData)}
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #eee" }}>
                            <button
                                onClick={() => setIsEditing(false)}
                                style={{ padding: "0.75rem 1.5rem", borderRadius: "6px", border: "1px solid #ccc", background: "white", cursor: "pointer", fontWeight: "bold" }}
                            >
                                ביטול
                            </button>
                            <button
                                onClick={handleSave}
                                style={{ padding: "0.75rem 1.5rem", borderRadius: "6px", border: "none", background: "hsl(var(--primary))", color: "white", cursor: "pointer", fontWeight: "bold" }}
                            >
                                שמור שינויים
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
