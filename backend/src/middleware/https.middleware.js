export const enforceHTTPS = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    return next(); // allow HTTP in dev
  }

  const isSecure =
    req.secure ||
    req.headers["x-forwarded-proto"] === "https";

  if (!isSecure) {
    return res.status(403).json({
      message: "HTTPS is required"
    });
  }

  next();
};
