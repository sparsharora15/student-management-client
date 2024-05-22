import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../Components/ui/button";
import SearchBar from "../../Components/ComonComponents/searchBar";
import { Label } from "../../Components/ui/label";
import { Checkbox } from "../../Components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import GridActions from "../../Components/gridCellRendrer/GridActions";
import AgGrid from "../../Components/Grid";
import AddEditLectureSlots from "../../Components/models/addEditLectureSlots";
import { getLectures } from "../../HttpServices";
interface Lectures {
  lectureNumber: number;
  endTime: string;
  startTime: string;
}
const TimeSlots = () => {
  const [lecturePopup, setLecturePopup] = useState(false);
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();
  const [action, setAction] = useState("");
  const [lectures, setLectures] = useState<Lectures[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
              setLecturePopup(true);
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
        headerName: "Lecture",
        field: "lectureNumber",
        headerClass: "ag-header-custom1 ",
        tooltipField: "lecture",
        minWidth: 100,
        flex: 1,
        sortable: false,
        pinned: "left",
      },

      {
        headerName: "From",
        field: "startTime",
        headerClass: "ag-header-custom",
        tooltipField: "from",
        minWidth: 110,
        flex: 1,
        sortable: false,
      },
      {
        headerName: "To",
        field: "endTime",
        headerClass: "ag-header-custom",
        tooltipField: "to",
        minWidth: 110,
        flex: 1,
        sortable: false,
      },

      _action,
    ],
    []
  );

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
  useEffect(() => {
    console.log("lectures", lectures);
  }, [lectures]);
  return (
    <>
      <div className="p-[21px] !pb-0 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 justify-between lg:justify-normal w-full ">
          <p className="font-semibold text-[25px]">Lecture Slots</p>
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
            <Button onClick={() => setLecturePopup(true)}>
              Add Lecture Slots
            </Button>
          </div>

          {lecturePopup && (
            <AddEditLectureSlots
              open={lecturePopup}
              getSlots={getSlots}
              onOpenChange={() => setLecturePopup(false)}
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
          height="72vh"
          columnDefs={columnDefs}
          getRowClass={getRowClass}
          rowData={lectures}
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

export default TimeSlots;
