import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db.js";
import { generateToken } from "../middleware/auth.js";

export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, password, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await query(
      "INSERT INTO users (name, email, phone, password_hash, city) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, created_at",
      [name, email, phone || null, passwordHash, city || null]
    );

    const user = result.rows[0];
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: "Failed to create account" });
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await query(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

export const handleAdminLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await query(
      "SELECT id, email, password_hash, name, role FROM admins WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const admin = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const token = generateToken({ id: admin.id, email: admin.email, role: "admin" });

    return res.json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ success: false, message: "Admin login failed" });
  }
};

export const handleGetMe: RequestHandler = async (req, res) => {
  try {
    const authUser = (req as any).user;
    if (!authUser) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    if (authUser.role === "admin") {
      const result = await query("SELECT id, email, name, role, created_at FROM admins WHERE id = $1", [authUser.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Admin not found" });
      }
      return res.json({ success: true, user: result.rows[0] });
    }

    const result = await query(
      "SELECT id, name, email, phone, city, role, created_at FROM users WHERE id = $1",
      [authUser.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(500).json({ success: false, message: "Failed to get user info" });
  }
};
