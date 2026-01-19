export const financeValidation = {
  finance_report_frf_name: {
    required: true,
    pattern: /^[A-Za-z ]{2,255}$/,
    message: "Finance report name must contain only letters"
  },

  finance_report_frf_owner: {
    required: true,
    pattern: /^[A-Za-z ]{2,255}$/,
    message: "Owner name must contain only letters"
  },

  project_name: {
    required: true,
    minLength: 2,
    maxLength: 255,
    message: "Project name is required"
  },

  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    message: "Enter a valid email address"
  },

  secondary_email: {
    required: false,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    message: "Enter a valid secondary email"
  }

};