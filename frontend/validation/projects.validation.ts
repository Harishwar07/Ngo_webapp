export const projectsValidation = {
  project_frf_name: {
    required: true,
    pattern: /^[A-Za-z ]{2,255}$/,
    message: "FRF name must contain only letters and spaces (min 2 chars)"
  },

  project_frf_owner: {
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

  email_opt_out: {
    required: false,
    allowed: ["Yes", "No"],
    message: "Invalid email opt-out value"
  },

  project_name: {
    required: true,
    minLength: 2,
    maxLength: 255,
    message: "Project name must be between 2 and 255 characters"
  },

  project_id_code: {
    required: true,
    pattern: /^[A-Za-z0-9_-]{3,100}$/,
    message: "Project ID must be alphanumeric (3–100 chars)"
  },

start_date: {
  required: true,
  custom: (value: string) => {
    if (!value) return "Start date is required";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(value);
    if (start > today) {
      return "Start date cannot be in the future";
    }

    return null;
  }
},

    end_date: {
    required: false,
    custom: (value: string, data?: any) => {
        if (!value || !data?.start_date) return null;

        const start = new Date(data.start_date);
        const end = new Date(value);

        if (end < start) {
        return "End date cannot be before start date";
        }

        return null;
    }
    },


  duration: {
    required: false,
    maxLength: 100,
    message: "Duration must not exceed 100 characters"
  },

  project_status: {
    required: true,
    allowed: ["Planning", "Ongoing", "Completed", "On-Hold"],
    message: "Invalid project status"
  },

  objective: {
    required: false,
    maxLength: 2000,
    message: "Objective too long"
  },

  budget: {
    required: false,
    numeric: true,
    min: 0,
    message: "Budget must be a positive number"
  },

  budget_utilized: {
  required: false,
  numeric: true,
  min: 0,
  custom: (value: number, data?: any) => {
    if (
      value == null ||
      data?.budget == null ||
      data.budget === ""
    ) {
      return null;
    }

    if (Number(value) > Number(data.budget)) {
      return "Budget utilized cannot exceed budget";
    }

    return null;
  }
},

  impact_summary: {
    required: false,
    maxLength: 2000,
    message: "Impact summary too long"
  },

  location_name: {
    required: true,
    pattern: /^[A-Za-z0-9 ,.-]{2,255}$/,
    message: "Invalid location name"
  },

  target_group: {
    required: false,
    maxLength: 255,
    message: "Target group too long"
  },

  responsible_officer: {
    required: true,
    pattern: /^[A-Za-z ]{2,255}$/,
    message: "Responsible officer name must contain only letters"
  }
};
