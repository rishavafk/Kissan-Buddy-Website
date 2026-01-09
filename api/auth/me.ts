import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from "../../lib/storage";
import jwt from "jsonwebtoken";

// CORS helper
function setCorsHeaders(res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Set CORS headers
    setCorsHeaders(res);

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const JWT_SECRET = process.env.SESSION_SECRET || 'default-secret-key';
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await storage.getUser(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName, role: user.role }
        });
    } catch (error: any) {
        return res.status(403).json({ message: "Invalid token" });
    }
}
