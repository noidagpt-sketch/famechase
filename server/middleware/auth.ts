import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "famechase-jwt-secret-change-in-production";

export interface AuthPayload {
  id: number;
  email: string;
  role: "user" | "admin";
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as AuthPayload;
  if (!user || user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
}
