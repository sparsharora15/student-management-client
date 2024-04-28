import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Components/Layout";
import Protected from "./Components/ProtectedRoutes";
import { Toaster } from "./Components/ui/toaster";
import Login from "./Pages/Auth/Login";
import Course from "./Pages/Course";
import Dashboard from "./Pages/Dashboard";
import Students from "./Pages/Student";
import Subjects from "./Pages/Subjects";
import Teachers from "./Pages/Teacher";
import TimeSlots from "./Pages/TimeSlot";
import TimeTable from "./Pages/TimeTable";
import ViewStudentProfile from "./Pages/ViewStudentProfile";
import ViewTecaherProfile from "./Pages/ViewTecaherProfile";
import StudentMarks from "./Pages/StudentMarks";
import StudentAttendance from "./Pages/StudentAttendance";
function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster />

        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Protected Components={<Dashboard />} />} />
            <Route
              path="/teacher"
              element={<Protected Components={<Teachers />} />}
            />
            <Route
              path="/students"
              element={<Protected Components={<Students />} />}
            />
            <Route path="/view/:id" element={<ViewStudentProfile />} />
            <Route
              path="/teacher/view/:id"
              element={<Protected Components={<ViewTecaherProfile />} />}
            />
            <Route
              path="/courses"
              element={<Protected Components={<Course />} />}
            />
            <Route
              path="/subjects"
              element={<Protected Components={<Subjects />} />}
            />
            <Route
              path="/timeTable"
              element={<Protected Components={<TimeTable />} />}
            />
            <Route
              path="/lectureSlots"
              element={<Protected Components={<TimeSlots />} />}
            />
            <Route
              path="/StudentMarks"
              element={<Protected Components={<StudentMarks />} />}
            />
            <Route
              path="/StudentAttendance"
              element={<Protected Components={<StudentAttendance />} />}
            />
          </Route>

          <Route
            path="/login"
            element={<Protected Components={<Login />}></Protected>}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
