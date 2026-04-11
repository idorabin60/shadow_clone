export const dynamic = 'force-dynamic';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
            <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">404</h2>
                <p className="text-white/70">Page not found</p>
            </div>
        </div>
    );
}
