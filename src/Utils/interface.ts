import * as z from "zod";
import { validateUserName } from "./regex";

export interface LoginCredentials {
  email: string;
  password: string;
}
export interface CourseData {
  name: string;
  _id: string;
  courseYear: string;
  totalSubjects: number;
  totalSemesters: number;
}
export interface PageProps {
  Components: JSX.Element;
}
export interface TeachingDepartment {
  _id: string;
  fullName: string;
}
export interface Teacher {
  employeeID: string;
  fullName: string;
  dob: string;
  gender: "male" | "female";
  email: string;
  teachingDepartment: TeachingDepartment;
  address: string;
  phoneNo: string;
  profilePicturePublicId: string;
}

export interface dropDownValues {
  value: string;
  label: string;
}
export interface Subject {
  fullName: string;
}
const semester = z.object({
  id: z.string().uuid(),
  semesterName: z.string(),
  subjects: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
});
export const validationSchema = z.object({
  totalSem: z.string().min(1),
  fullName: z
    .string()
    .min(1, { message: "Name is required" })
    .max(255, { message: "User Name must be at most 255 characters" })
    .refine((value) => validateUserName(value), {
      message: "Special characters are not allowed in the user name.",
    }),
  courseYear: z.string().min(1, { message: "this is a required." }),
  semesters: z.array(semester),
});
