import { app, initializeApp } from '../server/index';

export default async function handler(req: any, res: any) {
    // Health check endpoint - runs BEFORE initialization
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
        await initializeApp();
        app(req, res);
    } catch (e: any) {
        console.error("VERCEL FUNCTION ERROR:", e);
        res.status(500).json({
            error: "Server Error",
            message: e.message
        });
    }
}
