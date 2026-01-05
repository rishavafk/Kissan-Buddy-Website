import { storage } from "../../server/storage";
import { loginSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    try {
        const credentials = loginSchema.parse(req.body);
        const user = await storage.getUserByUsername(credentials.username);

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const JWT_SECRET = process.env.SESSION_SECRET || 'default-secret-key';
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName, role: user.role },
            token
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ message: "Invalid input", details: error.errors });
        }
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
