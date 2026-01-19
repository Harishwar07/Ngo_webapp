export const PERMISSIONS = {
  Admin: ["students", "volunteers", "projects", "donors", "finance_reports", "board_members"],

  Super: ["students", "volunteers", "projects", "finance_reports"],

  Finance: ["finance_reports"],

  Coordinator: ["students", "volunteers", "projects"],

  Staff: ["students", "projects"],

  Member: [],

  Volunteer: ["volunteers"],

  Donor: ["donors"]
};
