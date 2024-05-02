import * as jose from "jose";
import { FaChartColumn } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { PiStudentFill } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { IoBookSharp } from "react-icons/io5";
import { FaBook } from "react-icons/fa6";
import { FaBusinessTime } from "react-icons/fa";
import { MdCoPresent } from "react-icons/md";
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { IoTime } from "react-icons/io5";
import { JWTSECRET } from "./constants";

export const navOptions: { name: string; path: string; icon: IconType }[] = [
  {
    name: "Dashboard",
    path: "/",
    icon: FaChartColumn,
  },
  {
    name: "Students",
    path: "/students",
    icon: PiStudentFill,
  },
  {
    name: "Teacher",
    path: "/teacher",
    icon: GiTeacher,
  },
  {
    name: "Courses",
    path: "/courses",
    icon: IoBookSharp,
  },
  {
    name: "Subjects",
    path: "/subjects",
    icon: FaBook,
  },
  {
    name: "Lecture Slots",
    path: "/lectureSlots",
    icon: IoTime,
  },
  {
    name: "Time Table",
    path: "/timeTable",
    icon: FaBusinessTime,
  },
  {
    name: "Attendance",
    path: "/studentAttendance",
    icon: MdCoPresent,
  },
  {
    name: "Student Marks",
    path: "/studentMarks",
    icon: BsFillFileEarmarkSpreadsheetFill,
  },
];
export const teacherNavOptions: { name: string; path: string; icon: IconType }[] = [

  {
    name: "Students",
    path: "/students",
    icon: PiStudentFill,
  },
  {
    name: "Attendance",
    path: "/studentAttendance",
    icon: MdCoPresent,
  },
  {
    name: "Student Marks",
    path: "/studentMarks",
    icon: BsFillFileEarmarkSpreadsheetFill,
  },
];

export const detailedInfoNavOptions = [
  {
    name: "1st SEM",
    label: "1stSem",
  },
  {
    name: "2nd SEM",
    label: "2ndSem",
  },
  {
    name: "3rd SEM",
    label: "3rdSem",
  },
  {
    name: "4th SEM",
    label: "4thSem",
  },
  {
    name: "5th SEM",
    label: "5thSem",
  },
  {
    name: "6th SEM",
    label: "6thSem",
  },
];

export const addOneDay = (date = new Date()) => {
  date.setDate(date.getDate() + 1);

  return date;
};
export const headerToken = (token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return headers;
};
export const isValidDate = (d: Date) => {
  return d instanceof Date && !isNaN(+d);
};
export const addQueryParamsToURL = (_url: URL | string, params: any) => {
  let url = new URL(_url);
  Object.keys(params || {}).forEach((key: string) =>
    url.searchParams.append(
      key,
      ["", null, undefined].includes(params[key])
        ? ""
        : isValidDate(params[key])
        ? params[key].toISOString()
        : typeof params[key] === "object"
        ? JSON.stringify(params[key] || {})
        : params[key] !== undefined
        ? params[key]
        : ""
    )
  );
  return url;
};

export const decodeToken = async () => {
  try {
    let token = localStorage.getItem("adminToken");

    const deCodedToken = await jose.jwtVerify(
      token as string,
      new TextEncoder().encode(JWTSECRET)
    );
    return { isDecode: true, deCodedToken: deCodedToken };
  } catch (e) {
    console.warn(e);
    return { isDecode: false };
  }
};
export const getAuthorizationConfig = (token: string) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
export const formatDate = (
  dateString: string | undefined
): string | undefined => {
  if (dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return dateString;
};

export const classNames = (...className: string[]) => {
  className.filter(Boolean).join(" ");
};

export const alertTextColor = (_alert: string): string => {
  switch (_alert) {
    case "alert":
      return "text-red-600";
    case "warning":
      return "text-orange-600";
    case "regular":
      return "";
    default:
      return "";
  }
};
export const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      resolve(reader.result);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
};
export const isNotFutureDate = (inputDate: Date): boolean => {
  const currentDate = new Date();
  return inputDate <= currentDate;
};
