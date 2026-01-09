import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from "../../lib/storage";
import { loginSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
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

    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    try {
        console.log('[Login] Processing login request');

        const credentials = loginSchema.parse(req.body);
        const user = await storage.getUserByUsername(credentials.username) ||
            await storage.getUserByEmail(credentials.username);

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
            console.log('[Login] Invalid credentials');
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const JWT_SECRET = process.env.SESSION_SECRET || 'default-secret-key';
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('[Login] Login successful for user:', user.username);

        return res.status(200).json({
            user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName, role: user.role },
            token
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            console.error('[Login] Validation error:', error.errors);
            return res.status(400).json({ message: "Invalid input", details: error.errors });
        }
        console.error("[Login] Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
