import React, { lazy, useCallback, useMemo, useRef, useState } from "react";
import { Checkbox } from "../../Components/ui/checkbox";
import { Label } from "../../Components/ui/label";
import SearchBar from "../../Components/ComonComponents/searchBar";
import { Button } from "../../Components/ui/button";
import GridActions from "../../Components/gridCellRendrer/GridActions";
import AgGrid from "../../Components/Grid";
import { useNavigate } from "react-router-dom";
import AddEditTeacher from "../../Components/models/addEditTeacher";
import ConfirmPopup from "../../Components/ComonComponents/ConfirmPopup";

const Students = () => {
  const [showTeacherPopup, setTeacherPopup] = useState(false);
  const [action, setAction] = useState("");
  const [isOpen, setIsOpen] = useState<Boolean>(false); // set initial state of dropdown to closed
  const navigate = useNavigate();
  const getRowClass = (params: any) => {
    if (params?.data?.isDeleted) {
      return "!bg-red-50";
    }
  };
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
              setTeacherPopup(true);
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
        headerName: "Erollment No",
        field: "erollmentNo",
        headerClass: "ag-header-custom1 ",
        tooltipField: "erollmentNo",
        minWidth: 20,
        flex: 1,
        sortable: false,
        pinned: "left",
      },
      {
        headerName: "Name",
        field: "name",
        headerClass: "ag-header-custom",
        tooltipField: "name",
        minWidth: 100,
        flex: 1,
        sortable: false,
        pinned: "left",
      },

      {
        headerName: "Email",
        field: "email",
        headerClass: "ag-header-custom",
        tooltipField: "email",
        minWidth: 110,
        flex: 1,
        sortable: false,
      },
      {
        headerName: "Department",
        field: "department",
        headerClass: "ag-header-custom",
        tooltipField: "department",
        minWidth: 110,
        flex: 1,
        sortable: false,
      },
      {
        headerName: "Address",
        field: "address",
        headerClass: "ag-header-custom",
        tooltipField: "address",
        minWidth: 150,
        flex: 1,
        sortable: false,
      },
      {
        headerName: "Contact number",
        field: "contactNumber",
        headerClass: "ag-header-custom",
        tooltipField: "contactNumber",
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
      erollmentNo: "123456",
      name: "John Doe",
      email: "john.doe@example.com",
      department: "BCom",
      address: "123 Main St, Springfield, IL",
      contactNumber: "555-123-4567",
    },
    {
      erollmentNo: "654321",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      department: "BCA",
      address: "456 Elm St, Springfield, IL",
      contactNumber: "555-987-6543",
    },
  ];

  return (
    <>
      <div className="p-[21px] !pb-0 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 justify-between lg:justify-normal w-full ">
          <p className="font-semibold text-[25px]">Students</p>
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
            <Button onClick={() => setTeacherPopup(true)}>Add Student</Button>
          </div>
          {/* {showTeacherPopup && (
            <AddEditTeacher
              getAllTechersData={() => {}}
              open={showTeacherPopup}
              onOpenChange={() => setTeacherPopup(false)}
            />
          )} */}
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
      <ConfirmPopup
        showConfirmPopup={isOpen}
        confirmLoading={false}
        // title={selectedData?.isDeleted ? "Unarchive Pack" : "Archive Pack"}
        title={"Archive user"}
        description={`Do you really want to archive this user?`}
        // description={`Do you really want to ${
        //   selectedData?.isDeleted ? "unarchive" : "archive"
        // } this pack?`}
        setIsOpen={setIsOpen}
        action={action}
        // deleteHandler={deleteData}
        IsOpen={setIsOpen}
        // distOrgId={distOrgId}
        // custOrgId={custOrgId}
        btnTitle={
          action === "changeStatus" ? "Yes" : false ? "Unarchive" : "Archive"
        }
      />
    </>
  );
};

export default Students;
// const LazyLoadedTable = lazy(() => import("@/components/agGrid"));
