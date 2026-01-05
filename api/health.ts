export default function handler(req: any, res: any) {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: {
            hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
            hasSupabaseKey: !!process.env.VITE_SUPABASE_ANON_KEY,
            nodeEnv: process.env.NODE_ENV || 'not set'
        }
    });
}
