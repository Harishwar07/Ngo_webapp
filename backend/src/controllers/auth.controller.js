import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

export const refreshToken = async (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const [[session]] = await db.query(
      `
      SELECT us.user_id, us.refresh_token, us.expires_at, u.email, u.role
      FROM user_sessions us
      JOIN users u ON u.id = us.user_id
      WHERE us.session_id = ?
      `,
      [payload.session_id]
    );

    if (
      !session ||
      session.refresh_token !== token ||
      new Date(session.expires_at) < new Date()
    ) {
      return res.status(403).json({ message: "Session expired" });
    }

    const newAccessToken = generateAccessToken(
      { id: session.user_id, email: session.email, role: session.role },
      payload.session_id
    );

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000
    });

    res.json({ message: "Access token refreshed" });
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};


const getClientInfo = (req) => {
  return {
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    device: req.headers['user-agent'] || 'Unknown'
  };
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { ip, device } = getClientInfo(req);


    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? AND is_active = 1 AND is_approved = 1",
      [email]
    );

    if (!users.length) {
      await db.query(
        `
        INSERT INTO login_logs (email, ip_address, device, status)
        VALUES (?, ?, ?, 'FAILED')
        `,
        [email, ip, device]
      );

      return res.status(403).json({message: "Account pending admin approval or invalid credentials"});
    }

    const user = users[0];

    const now = new Date();

    // If account locked
    if (user.lock_until && new Date(user.lock_until) > now) {
      await db.query(
        `
        INSERT INTO login_logs (user_id, email, ip_address, device, status)
        VALUES (?, ?, ?, ?, 'FAILED')
        `,
        [user.id, email, ip, device]
      );

      return res.status(403).json({
        message: "Account locked. Try again later."
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {

      const attempts = (user.failed_attempts || 0) + 1;
      let lockUntil = null;

      if (attempts >= 5) {
        lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await db.query(
        `
        UPDATE users 
        SET failed_attempts = ?, lock_until = ?
        WHERE id = ?
        `,
        [attempts, lockUntil, user.id]
      );

      await db.query(
        `
        INSERT INTO login_logs (user_id, email, ip_address, device, status)
        VALUES (?, ?, ?, ?, 'FAILED')
        `,
        [user.id, email, ip, device]
      );

      return res.status(401).json({
        message: lockUntil
          ? "Too many failed attempts. Account locked for 15 minutes."
          : "Invalid credentials"
      });
    }

    // Reset counters
    await db.query(
      `
      UPDATE users
      SET failed_attempts = 0, lock_until = NULL, last_login = NOW()
      WHERE id = ?
      `,
      [user.id]
    );

    // Log success
    await db.query(
      `
      INSERT INTO login_logs (user_id, email, ip_address, device, status)
      VALUES (?, ?, ?, ?, 'SUCCESS')
      `,
      [user.id, email, ip, device]
    );

    // 3️⃣ Create session AFTER user exists
    // Create session
    const sessionId = crypto.randomBytes(32).toString("hex");

    await db.query(
    `
    INSERT INTO user_sessions
    (user_id, session_id, ip_address, device, expires_at)
    VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
    `,
    [user.id, sessionId, ip, device]
    );

    // Tokens
    const accessToken = generateAccessToken(
    { id: user.id, email: user.email, role: user.role },
    sessionId
    );
    const refreshToken = generateRefreshToken(
    { id: user.id },
    sessionId
    );

    // Save refresh token
    await db.query(
    `UPDATE user_sessions SET refresh_token = ? WHERE session_id = ?`,
    [refreshToken, sessionId]
    );

    // Cookies
    res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000
    });

    res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
    user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role.toLowerCase()
    },
    message: "Login successful"
    });



  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  const sessionId = req.user?.session_id;

  if (sessionId) {
    await db.query(
      `DELETE FROM user_sessions WHERE session_id = ?`,
      [sessionId]
    );
  }

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res.json({ message: "Logged out successfully" });
};
