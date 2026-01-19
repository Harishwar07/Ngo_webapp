import { studentsValidation } from "./students.validation";
import { volunteersValidation } from "./volunteers.validation";
import { donorsValidation } from "./donors.validation";
import { boardValidation } from "./board.validation";
import { financeValidation } from "./finance.validation";
import { projectsValidation } from "./projects.validation";

export const validationMap: Record<string, any> = {
  students: studentsValidation,
  volunteers: volunteersValidation,
  donors: donorsValidation,
  board_members: boardValidation,
  finance_reports: financeValidation,
  projects: projectsValidation
};
