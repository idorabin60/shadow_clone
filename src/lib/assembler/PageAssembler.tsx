import React from "react";
import type { GeneratedPageData } from "@/lib/ai/orchestrator";
import type { BusinessInput } from "@/lib/ai/prompts";

// Import all templates
import { HeroCentered } from "@/templates/hero/HeroCentered";
import { AboutStandard } from "@/templates/about/AboutStandard";
import { ServicesGrid } from "@/templates/services/ServicesGrid";
import { TestimonialsCards } from "@/templates/testimonials/TestimonialsCards";
import { FaqAccordion } from "@/templates/faq/FaqAccordion";
import { CtaBanner } from "@/templates/cta/CtaBanner";
import { FooterSimple } from "@/templates/footer/FooterSimple";

// Editor Wrapper
import { SectionEditorOverlay } from "@/components/editor/SectionEditorOverlay";

interface PageAssemblerProps {
    data: GeneratedPageData | null;
    businessInfo: BusinessInput;
    theme: string;
    isEditorMode?: boolean;
    onSectionEdit?: (sectionKey: keyof GeneratedPageData, newData: any) => void;
}

export const PageAssembler = ({
    data,
    businessInfo,
    theme,
    isEditorMode = false,
    onSectionEdit
}: PageAssemblerProps) => {
    if (!data) {
        return (
            <div style={{ padding: "4rem", textAlign: "center", color: "hsl(var(--text-muted))" }}>
                <h3>אין נתונים להצגה.</h3>
                <p>אנא מלא את פרטי העסק ליצירת הדף.</p>
            </div>
        );
    }

    // Helper to wrap sections based on mode
    const renderSection = (key: keyof GeneratedPageData, name: string, dataObj: any, Component: any) => {
        if (!isEditorMode || !onSectionEdit) {
            return <Component {...dataObj} />;
        }

        return (
            <SectionEditorOverlay
                sectionKey={key}
                sectionName={name}
                data={dataObj}
                onSave={(k, newData) => onSectionEdit(k as keyof GeneratedPageData, newData)}
            >
                <Component {...dataObj} />
            </SectionEditorOverlay>
        );
    };

    return (
        <div
            data-theme={theme}
            dir="rtl"
            style={{
                width: "100%",
                minHeight: "100vh",
                backgroundColor: "hsl(var(--background))",
                color: "hsl(var(--text))",
                fontFamily: "var(--font-body)"
            }}
        >
            {renderSection("hero", "פתיח (Hero)", data.hero, HeroCentered)}
            {renderSection("about", "אודות", data.about, AboutStandard)}
            {renderSection("services", "שירותים", data.services, ServicesGrid)}
            {renderSection("testimonials", "המלצות", data.testimonials, TestimonialsCards)}
            {renderSection("faq", "שאלות נפוצות", data.faq, FaqAccordion)}
            {renderSection("cta", "הנעה לפעולה", data.cta, CtaBanner)}
            <FooterSimple businessInfo={businessInfo} />
        </div>
    );
};
