import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../Components/ui/button";
import SearchBar from "../../Components/ComonComponents/searchBar";
import { Label } from "../../Components/ui/label";
import { Checkbox } from "../../Components/ui/checkbox";
import AddEditTeacher from "../../Components/models/addEditTeacher";
import AddEditCourse from "../../Components/models/addEditCourse";
import { useNavigate } from "react-router-dom";
import GridActions from "../../Components/gridCellRendrer/GridActions";
import AgGrid from "../../Components/Grid";
import { getCourses } from "../../HttpServices";
import Loader from "../../Components/loader";
import { CourseData } from "../../Utils/interface";

const Course = () => {
  const token = localStorage.getItem("adminToken");
  const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [coursePopup, setCoursePopup] = useState(false);
  const navigate = useNavigate();
  const [searchString, setSearchString] = useState<string>("");
  const [action, setAction] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const deleteUser = useCallback((gridParams: any) => {
    setAction("Archive");
    setIsOpen(true);
  }, []);
  const _action = {
    headerName: "Actions",
    field: "field8",
    headerClass: "ag-header-custom2",
    sortable: false,
    pinned: "right",
    maxWidth: 90,
    cellRenderer: (gridParams: any) => (
      <GridActions
        gridParams={gridParams}
        actions={[
          {
            title: "Edit",
            label: "Edit",
            className: "",
            callback: () => {
              setCoursePopup(true);
            },
          },
          {
            title: "View",
            label: "View",
            className: "",
            callback: () => navigate("/view/5"),
          },

          {
            title: gridParams?.data?.isDeleted ? "Unarchive" : "Archive",
            label: gridParams?.data?.isDeleted ? "Unarchive" : "Archive",
            className: "text-red-500",
            callback: deleteUser,
          },
        ].filter(Boolean)}
      />
    ),
  };
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Name",
        field: "name",
        headerClass: "ag-header-custom1 ",
        tooltipField: "name",
        minWidth: 100,
        flex: 1,
        sortable: false,
        pinned: "left",
      },

      {
        headerName: "Course Year",
        field: "courseYear",
        headerClass: "ag-header-custom",
        tooltipField: "email",
        minWidth: 110,
        flex: 1,
        sortable: false,
      },
      {
        headerName: "Total SEM",
        field: "totalSemesters",
        headerClass: "ag-header-custom",
        tooltipField: "Total SEM",
        minWidth: 110,
        flex: 1,
        sortable: false,
      },

      {
        headerName: "Total Subjects",
        field: "totalSubjects",
        headerClass: "ag-header-custom",
        tooltipField: "totalSubjects",
        minWidth: 150,
        flex: 1,
        sortable: false,
      },
      _action,
    ],
    []
  );
  const rowData = [
    {
      name: "BTech",
      courseYear: "4",
      totalSEM: 8,
      totalSubjects: 32,
    },
    {
      name: "BCA",
      courseYear: "3",
      totalSEM: 6,
      totalSubjects: 28,
    },
    {
      name: "BCOM",
      courseYear: "3",
      totalSEM: 6,
      totalSubjects: 20,
    },
    // Add more rows as needed
  ];

  const getRowClass = (params: any) => {
    if (params?.data?.isDeleted) {
      return "!bg-red-50";
    }
  };
  const getCoursesList = async () => {
    try {
      setLoading(true);
      // Pass the searchString as a parameter to getCourses function
      const coursesData = await getCourses(
        token as string,
        searchString as string
      );
      if (coursesData.data.status === 200) {
        setCourseData(coursesData.data.documents);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCoursesList();
  }, [searchString]);
  return (
    <>
      <div className="p-[21px] !pb-0 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 justify-between lg:justify-normal w-full ">
          <p className="font-semibold text-[25px]">Courses</p>
        </div>
        <div className="flex gap-3 flex-col lg:flex-row w-full justify-end">
          <div className="flex flex-col md:flex-row  justify-end md:justify-between gap-3">
            <div className="items-center flex gap-2">
              <Checkbox id="archived" />
              <Label htmlFor="archived">Show Archived</Label>
            </div>
            <div className="w-full lg:w-[200px]">
              <SearchBar
                placeholder="Search Courses"
                setSearchString={setSearchString}
              />
            </div>
            <Button onClick={() => setCoursePopup(true)}>Add Course</Button>
          </div>

          {coursePopup && (
            <AddEditCourse
              open={coursePopup}
              onOpenChange={() => setCoursePopup(false)}
            />
          )}
        </div>
      </div>
      <div className="p-[21px] !pt-0">
        {loading ? (
          <>
            <div className="w-full h-[58vh] flex justify-center items-center">
              <Loader color="#1B5299" />
            </div>
          </>
        ) : (
          <>
            <AgGrid
              className="py-8"
              height="58vh"
              columnDefs={columnDefs}
              getRowClass={getRowClass}
              rowData={courseData}
            />
          </>
        )}

        {/* <div className="flex w-full justify-end">
              <Pagination
                pageCount={pageCount}
                pageRangeDisplayed={5}
                forcePage={page - 1}
                handlePageClick={(selectedPage: any) =>
                  pageHandler(selectedPage)
                }
              />
            </div> */}
      </div>
    </>
  );
};

export default Course;
