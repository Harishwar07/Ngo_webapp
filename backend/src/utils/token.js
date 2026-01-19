import jwt from "jsonwebtoken";

export const generateAccessToken = (user, sessionId) =>
  jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      session_id: sessionId
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );

export const generateRefreshToken = (user, sessionId) =>
  jwt.sign(
    {
      id: user.id,
      session_id: sessionId
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
