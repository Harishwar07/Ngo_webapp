export type ValidationRule = {
  required?: boolean;
  pattern?: RegExp;
  min?: number;
  max?: number;
  message: string;
};

export type ValidationSchema = Record<string, ValidationRule[]>;

export function validateField(
  field: string,
  value: any,
  rule: any,
  data?: any
) {
  if (rule.required && (value === "" || value === null || value === undefined)) {
    return rule.message || `${field} is required`;
  }

  if (rule.pattern && value && !rule.pattern.test(String(value))) {
    return rule.message;
  }

  if (rule.numeric && value !== "" && isNaN(Number(value))) {
    return rule.message;
  }

  if (rule.min !== undefined && Number(value) < rule.min) {
    return rule.message;
  }

  if (rule.max !== undefined && Number(value) > rule.max) {
    return rule.message;
  }

  if (rule.custom) {
    return rule.custom(value, data); // ✅ MUST pass data
  }

  return null;
}
