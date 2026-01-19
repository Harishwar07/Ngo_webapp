import sanitizeHtml from "sanitize-html";

const cleanString = (value) => {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {}
  })
    .replace(/[<>]/g, "")     // extra hardening
    .trim();
};

export const sanitizeBody = (req, res, next) => {
  const sanitized = {};

  for (const key in req.body) {
    const value = req.body[key];

    if (typeof value === "string") {
      sanitized[key] = cleanString(value);
    }
    else if (Array.isArray(value)) {
      sanitized[key] = value.map(v =>
        typeof v === "string" ? cleanString(v) : v
      );
    }
    else {
      sanitized[key] = value;
    }
  }

  req.body = sanitized;
  next();
};
