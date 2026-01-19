export const boardValidation = {
  board_frf_name: {
    required: true,
    pattern: /^[A-Za-z ]{2,255}$/,
    message: "Board member name must contain only letters"
  },

  board_frf_owner: {
    required: true,
    pattern: /^[A-Za-z ]{2,255}$/,
    message: "Owner name must contain only letters"
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
  },

  contact_number: {
    required: true,
    pattern: /^\d{10,15}$/,
    message: "Contact number must be 10–15 digits"
  },

  emergency_contact_number: {
    required: false,
    pattern: /^\d{10,15}$/,
    message: "Emergency contact must be 10–15 digits"
  },

  father_name: {
    required: false,
    pattern: /^[A-Za-z ]{2,255}$/,
    message: "Father name must contain only letters"
  },

  mother_name: {
    required: false,
    pattern: /^[A-Za-z ]{2,255}$/,
    message: "Mother name must contain only letters"
  },

  date_of_birth: {
    required: true,
    custom: (value: string) => {
      if (new Date(value) >= new Date()) {
        return "Date of birth must be in the past";
      }
      return null;
    }
  },

  joining_date: {
    required: true,
    custom: (value: string) => {
      if (new Date(value) > new Date()) {
        return "Joining date cannot be in the future";
      }
      return null;
    }
  },

  designation: {
    required: true,
    allowed: ["Chairperson", "Treasurer", "Secretary", "Member"],
    message: "Invalid board designation"
  }
};
