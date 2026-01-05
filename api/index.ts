import { app, initializeApp } from '../server/index';

export default async function handler(req: any, res: any) {
    // Health check endpoint - runs BEFORE any initialization
    if (req.url === '/api/health' || req.url?.startsWith('/api/health?')) {
        return res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            env: {
                hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
                hasSupabaseKey: !!process.env.VITE_SUPABASE_ANON_KEY,
                hasSessionSecret: !!process.env.SESSION_SECRET,
                nodeEnv: process.env.NODE_ENV || 'not set'
            }
        });
    }

    try {
        console.log("Vercel Function Start: " + req.method + " " + req.url);
        await initializeApp();
        console.log("App initialized, handling request...");

        // Wrap app call to catch synchronous errors in express dispatch
        app(req, res);
    } catch (e: any) {
        console.error("CRITICAL VERCEL ERROR:", e);
        res.status(500).json({
            error: "Vercel Function Error",
            details: e.message,
            stack: e.stack
        });
    }
}
