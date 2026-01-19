export const projectsValidator = {
  project_frf_name: {
    required: true,
    pattern: /^[A-Za-z ]{2,255}$/,
    message: "Invalid FRF name"
  },

  project_frf_owner: {
    required: true,
    pattern: /^[A-Za-z ]{2,255}$/,
    message: "Invalid owner name"
  },

  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    message: "Invalid email"
  },

  project_name: {
    required: true,
    minLength: 2,
    message: "Project name required"
  },

  project_id_code: {
    required: true,
    pattern: /^[A-Za-z0-9_-]{3,100}$/,
    message: "Invalid project code"
  },

  start_date: {
    required: true,
    custom: (value) => {
      const today = new Date().setHours(0, 0, 0, 0);
      if (new Date(value) < today) {
        return "Start date cannot be in the past";
      }
      return null;
    }
  },

  end_date: {
    required: false,
    custom: (value, data) => {
      if (!value || !data.start_date) return null;
      if (new Date(value) < new Date(data.start_date)) {
        return "End date cannot be before start date";
      }
      return null;
    }
  },

  budget: {
    required: false,
    numeric: true,
    min: 0,
    message: "Invalid budget"
  },

  budget_utilized: {
    required: false,
    numeric: true,
    custom: (value, data) => {
      if (!data?.budget || value === undefined) return null;
      if (Number(value) > Number(data.budget)) {
        return "Utilized budget cannot exceed budget";
      }
      return null;
    }
  },

  project_status: {
    required: true,
    allowed: ["Planning", "Ongoing", "Completed", "On-Hold"],
    message: "Invalid status"
  }
};
