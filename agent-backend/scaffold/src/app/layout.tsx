import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
    title: 'AI Generated Landing Page',
    description: 'Premium Hebrew landing page',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="he" dir="rtl">
            <body>{children}</body>
        </html>
    )
}
