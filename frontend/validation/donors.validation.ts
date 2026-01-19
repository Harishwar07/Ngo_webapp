export const donorsValidation = {
  donor_frf_name: {
    required: true,
    pattern: /^[A-Za-z ]{2,255}$/,
    message: "Donor name must contain only letters"
  },

  donor_frf_owner: {
    required: true,
    pattern: /^[A-Za-z ]{2,255}$/,
    message: "Owner name must contain only letters"
  },

  donor_id_code: {
    required: true,
    pattern: /^[A-Za-z0-9_-]{3,100}$/,
    message: "Invalid donor ID format"
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

  contact_person: {
    required: false,
    pattern: /^[A-Za-z ]{2,255}$/,
    message: "Contact person name must contain only letters"
  }
};
