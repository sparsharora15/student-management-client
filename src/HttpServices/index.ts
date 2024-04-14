import axios from "axios";
import { BASE_URL } from "../Utils/constants";
import {
  LoginCredentials,
  Subject,
  validationSchema,
} from "../Utils/interface";
import { getAuthorizationConfig } from "../Utils/helper";
import * as z from "zod";

export const login = async (data: LoginCredentials) => {
  return await axios.post(`${BASE_URL}admin/login`, data);
};
export const addSubject = async (token: string, data: Subject) => {
  const config = getAuthorizationConfig(token);

  return await axios.post(`${BASE_URL}admin/subject`, data, config);
};

export const getSubject = async (token: string) => {
  const config = getAuthorizationConfig(token);

  return await axios.get(`${BASE_URL}admin/subject`, config);
};
export const createCourse = async (
  token: string,
  data: z.infer<typeof validationSchema>
) => {
  const config = getAuthorizationConfig(token);

  return await axios.post(`${BASE_URL}admin/course`, data, config);
};
export const getCourses = async (token: string, searchString?: string) => {
  const config = getAuthorizationConfig(token);
  const queryParams = searchString
    ? `?name=${encodeURIComponent(searchString)}`
    : "";

  return await axios.get(`${BASE_URL}admin/course${queryParams}`, config);
};
export const crateTeacher = async (
  token: string,
  formData: FormData,
  payload: any
) => {
  const config = getAuthorizationConfig(token);
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, JSON.stringify(value));
  });
  return await axios.post(`${BASE_URL}admin/teacher`, formData, config);
};
export const updateTeacher = async (
  token: string,
  formData: FormData,
  payload: any,
  teacherId: string
) => {
  const config = getAuthorizationConfig(token);
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, JSON.stringify(value));
  });
  return await axios.put(`${BASE_URL}admin/teacher?teacherId=${teacherId}`, formData, config);
};
export const getTeacher = async (token: string, checked?: boolean) => {
  const config = getAuthorizationConfig(token);

  return await axios.get(
    `${BASE_URL}admin/teacher?isArchived=${checked}`,
    config
  );
};
export const archiveTeacher = async (token: string, teacherId: string) => {
  const config = getAuthorizationConfig(token);

  return await axios.delete(
    `${BASE_URL}admin/teacher?teacherId=${teacherId}`,
    config
  );
};
export const getTeacherById = async (token: string, teacherId: string) => {
  const config = getAuthorizationConfig(token);

  return await axios.get(
    `${BASE_URL}admin/teacherById?teacherId=${teacherId}`,
    config
  );
};
