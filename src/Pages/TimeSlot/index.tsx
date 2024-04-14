import React, { useCallback, useMemo, useState } from "react";
import { Button } from "../../Components/ui/button";
import SearchBar from "../../Components/ComonComponents/searchBar";
import { Label } from "../../Components/ui/label";
import { Checkbox } from "../../Components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import GridActions from "../../Components/gridCellRendrer/GridActions";
import AgGrid from "../../Components/Grid";
import AddEditLectureSlots from "../../Components/models/addEditLectureSlots";

const TimeSlots = () => {
  const [lecturePopup, setLecturePopup] = useState(false);
  const navigate = useNavigate();
  const [action, setAction] = useState("");
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
        field: "lecture",
        headerClass: "ag-header-custom1 ",
        tooltipField: "lecture",
        minWidth: 100,
        flex: 1,
        sortable: false,
        pinned: "left",
      },

      {
        headerName: "From",
        field: "from",
        headerClass: "ag-header-custom",
        tooltipField: "from",
        minWidth: 110,
        flex: 1,
        sortable: false,
      },
      {
        headerName: "To",
        field: "to",
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
  const rowData = [
    {
      lecture: "1",
      from: "09:00 AM",
      to: "10:30 AM",
    },
    {
      lecture: "2",
      from: "11:00 AM",
      to: "12:30 PM",
    },
    {
      lecture: "3",
      from: "01:00 PM",
      to: "02:30 PM",
    },
  ];

  const getRowClass = (params: any) => {
    if (params?.data?.isDeleted) {
      return "!bg-red-50";
    }
  };
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

export default TimeSlots;
