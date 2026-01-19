const ALLOWED_TABLES = {
  students: "students",
  donors: "donors",
  volunteers: "volunteers",
  projects: "projects",
  finance_reports: "finance_reports",
  board_members: "board_members"
};

export const getSafeTable = (table) => {
  return ALLOWED_TABLES[table] || null;
};
