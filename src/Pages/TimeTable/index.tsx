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
import AddEditTimeTable from "../../Components/models/addEditTimeTable";
import { getLectures } from "../../HttpServices";
interface Lectures {
  lectureNumber: number;
  endTime: string;
  startTime: string;
  _id: string;
}
const TimeTable = () => {
  const token = localStorage.getItem("adminToken");

  const [timeTablePopup, setTimeTablePopup] = useState(false);
  const navigate = useNavigate();
  const [action, setAction] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [lectures, setLectures] = useState<Lectures[]>([]);

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
              setTimeTablePopup(true);
            },
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
        headerName: "Course Name",
        field: "courseName",
        headerClass: "ag-header-custom1 ",
        tooltipField: "courseName",

        flex: 1,
        sortable: false,
      },
      {
        headerName: "SEM",
        field: "sem",
        headerClass: "ag-header-custom",
        tooltipField: "SEM",
        flex: 1,
        sortable: false,
      },

      {
        headerName: "Total Lectures",
        field: "totalLectures",
        headerClass: "ag-header-custom",
        tooltipField: "totalLectures",
        flex: 1,
        sortable: false,
      },
      _action,
    ],
    []
  );
  const rowData = [
    { courseName: "BCA", sem: "1", totalLectures: 8 },
    { courseName: "BTech", sem: "2", totalLectures: 8 },
    { courseName: "BCOM", sem: "3", totalLectures: 5 },
    // Add more rows as needed
  ];
  const getSlots = async () => {
    try {
      const response = await getLectures(token as string);
      if (response.status === 200) {
        setLectures(response.data?.data[0].lectures);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getRowClass = (params: any) => {
    if (params?.data?.isDeleted) {
      return "!bg-red-50";
    }
  };
  useEffect(() => {
    getSlots();
  }, []);
  return (
    <>
      <div className="p-[21px] !pb-0 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 justify-between lg:justify-normal w-full ">
          <p className="font-semibold text-[25px]">Time Table</p>
        </div>
        <div className="flex gap-3 flex-col lg:flex-row w-full justify-end">
          <div className="flex flex-col md:flex-row  justify-end md:justify-between gap-3">
            <div className="items-center flex gap-2">
              <Checkbox id="archived" />
              <Label htmlFor="archived">Show Archived</Label>
            </div>
            <div className="w-full lg:w-[200px]">
              <SearchBar placeholder="Search User" />
            </div>
            <Button onClick={() => setTimeTablePopup(true)}>
              Add Time Table
            </Button>
          </div>

          {timeTablePopup && (
            <AddEditTimeTable
              open={timeTablePopup}
              lectures={lectures}
              onOpenChange={() => setTimeTablePopup(false)}
            />
          )}
        </div>
      </div>
      <div className="p-[21px] !pt-0">
        {/* {loading ? (
              <>
                <div className="w-full h-[58vh] flex justify-center items-center">
                  <Loader color="#1B5299" />
                </div>
              </>
            ) : (
              <> */}
        <AgGrid
          className="py-8"
          height="58vh"
          columnDefs={columnDefs}
          getRowClass={getRowClass}
          rowData={rowData}
        />
        {/* </>
            )} */}

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

export default TimeTable;
