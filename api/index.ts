// Minimal test - no imports
export default function handler(req: any, res: any) {
    res.status(200).json({
        message: "API is working!",
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });
}
