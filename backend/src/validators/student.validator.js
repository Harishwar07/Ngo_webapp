import { body } from "express-validator";

export const createStudentValidator = [
  body("student_frf_name")
    .trim()
    .notEmpty().withMessage("Student name is required")
    .isLength({ min: 2, max: 100 }),

  body("email")
    .isEmail().withMessage("Invalid email"),

  body("parents_contact_number")
    .isNumeric().withMessage("Contact number must be numeric")
    .isLength({ min: 10, max: 15 }),

  body("class_name")
    .isIn(["Class 5", "Class 6", "Class 7", "Class 8", "Class 9"])
    .withMessage("Invalid class"),

  body("section")
    .isIn(["A", "B", "C", "D"])
    .withMessage("Invalid section"),

  body("medium")
    .isIn(["English", "Tamil", "Hindi"])
    .withMessage("Invalid medium"),

  body("monthly_income")
    .optional()
    .isInt({ min: 0 }).withMessage("Income must be a positive number"),

  body("date_of_birth")
    .isISO8601().withMessage("Invalid date format")
];
