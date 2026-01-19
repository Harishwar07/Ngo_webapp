export const sanitizeQuery = (req, res, next) => {
  for (const key in req.query) {
    if (typeof req.query[key] === "string") {
      req.query[key] = req.query[key]
        .replace(/[<>]/g, "")
        .trim();
    }
  }
  next();
};
