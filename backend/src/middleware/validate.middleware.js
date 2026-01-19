export const validate = (schema) => {
  return (req, res, next) => {
    const errors = {};

    for (const field in schema) {
      const rules = schema[field];
      const value = req.body[field];

      // Required
      if (rules.required && (value === undefined || value === null || value === "")) {
        errors[field] = rules.message || `${field} is required`;
        continue;
      }

      // Skip optional empty
      if (!rules.required && (value === undefined || value === "")) continue;

      // Pattern
      if (rules.pattern && !rules.pattern.test(String(value))) {
        errors[field] = rules.message;
      }

      // Enum
      if (rules.allowed && !rules.allowed.includes(value)) {
        errors[field] = rules.message;
      }

      // Numeric
      if (rules.numeric && isNaN(Number(value))) {
        errors[field] = rules.message;
      }

      if (rules.min !== undefined && Number(value) < rules.min) {
        errors[field] = rules.message;
      }

      // Custom rule
      if (rules.custom) {
        const err = rules.custom(value, req.body);
        if (err) errors[field] = err;
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        message: "Validation failed",
        errors
      });
    }

    next();
  };
};
