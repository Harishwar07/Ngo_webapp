export const studentsValidation = {
  student_frf_name: {
    required: true,
    pattern: /^[A-Za-z ]{2,255}$/,
    message: "Student name must contain only letters and spaces"
  },

  student_frf_owner: {
    required: true,
    pattern: /^[A-Za-z ]{2,255}$/,
    message: "Owner name must contain only letters and spaces"
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

  parents_contact_number: {
    required: true,
    pattern: /^\d{10,15}$/,
    message: "Mobile number must be 10–15 digits"
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

  school: {
    required: true,
    pattern: /^[A-Za-z0-9 .,'-]{2,255}$/,
    message: "Enter a valid school name"
  },

  date_of_birth: {
    required: true,
    custom: (value: string) => {
      const dob = new Date(value);
      const today = new Date();
      if (dob >= today) return "Date of birth cannot be in the future";

      const age = today.getFullYear() - dob.getFullYear();
      if (age < 3) return "Student age must be at least 3 years";

      return null;
    }
  }
};

