import { storage } from "../../lib/storage";
import { insertUserSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    try {
        const userData = insertUserSchema.parse(req.body);

        const existingUser = await storage.getUserByUsername(userData.username) ||
            await storage.getUserByEmail(userData.email);

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await storage.createUser({ ...userData, password: hashedPassword });

        const JWT_SECRET = process.env.SESSION_SECRET || 'default-secret-key';
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName, role: user.role },
            token
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ message: "Invalid input", details: error.errors });
        }
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
