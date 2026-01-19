export const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ["*"],

  admin: [
    "users.read",
    "users.create",
    "users.approve",
    "students.*",
    "volunteers.*",
    "donors.*",
    "projects.*",
    "finance_reports.*",
    "board_members.*"
  ],

  coordinator: [
    "students.read", "students.create", "students.update",
    "volunteers.read", "volunteers.create", "volunteers.update",
    "donors.read", "donors.create", "donors.update",
    "projects.read", "projects.create", "projects.update",
    "finance_reports.read", "finance_reports.create", "finance_reports.update",
    "board_members.read", "board_members.create", "board_members.update"
  ],

  staff: [
    "students.read", "students.create", "students.update",
    "volunteers.read", "volunteers.create", "volunteers.update",
    "donors.read", "donors.create", "donors.update",
    "projects.read", "projects.create", "projects.update",
    "finance_reports.read", "finance_reports.create", "finance_reports.update",
    "board_members.read", "board_members.create", "board_members.update"
  ],

  member: [
    "students.read",
    "volunteers.read",
    "projects.read",
    "finance_reports.read",
    "board_members.read",
    "donors.read"
  ],

  donor: [
    "donors.read",
    "donors.create",
    "donors.update"
  ],

  finance_reports: [
    "finance_reports.read",
    "finance_reports.create",
    "finance_reports.update"
  ]
};
