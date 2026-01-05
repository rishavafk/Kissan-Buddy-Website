import { app, initializeApp } from '../server/index';

export default async function handler(req: any, res: any) {
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
