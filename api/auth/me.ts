import { storage } from "../../lib/storage";
import jwt from "jsonwebtoken";

export default async function handler(req: any, res: any) {
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

        res.status(200).json({
            user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName, role: user.role }
        });
    } catch (error: any) {
        return res.status(403).json({ message: "Invalid token" });
    }
}
