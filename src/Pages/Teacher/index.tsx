import { useCallback, useEffect, useMemo, useState } from "react";
import SearchBar from "../../Components/ComonComponents/searchBar";
import AgGrid from "../../Components/Grid";
import GridActions from "../../Components/gridCellRendrer/GridActions";
import { Button } from "../../Components/ui/button";
import { Checkbox } from "../../Components/ui/checkbox";
import { Label } from "../../Components/ui/label";

import ConfirmPopup from "../../Components/ComonComponents/ConfirmPopup";
import AddEditTeacher from "../../Components/models/addEditTeacher";
import { archiveTeacher, getTeacher, getTeacherById } from "../../HttpServices";
import { decodeToken, formatDate } from "../../Utils/helper";
import { Badge } from "../../Components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Teacher, TeachingDepartment } from "../../Utils/interface";
import { toast } from "../../Components/ui/use-toast";

export const TeachingDepartmentRenderer = (
props: TeachingDepartment | TeachingDepartment[]
) => {
  return (
    <>
      <>
        {Array.isArray(props) ? (
          props.map((element: TeachingDepartment, id) => (
            <Badge title={element.fullName} key={id}>
              {element.fullName}
            </Badge>
          ))
        ) : (
          <Badge title={props?.fullName}>{props?.fullName}</Badge>
        )}
      </>
    </>
  );
};

const Teachers = () => {
  const [showTeacherPopup, setTeacherPopup] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [action, setAction] = useState("");
  const [rowData, setRowData] = useState<Teacher[]>([]);
  const [teacherId, setTeacherId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<Boolean>(false); // set initial state of dropdown to closed
  const [checked, setChecked] = useState<Boolean>(false); // set initial state of dropdown to closed
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState<Teacher>();

  const getRowClass = (params: any) => {
    if (params?.data?.isDeleted) {
      return "!bg-red-50";
    }
  };
  const deleteUser = useCallback(async (gridParams: any) => {
    try {
      setTeacherId(gridParams.data._id);
      setAction("Archive");
      setIsOpen(true);
    } catch (err: any) {
      console.warn(err);
    }
  }, []);
  const deleteHandler = async () => {
    try {
      setConfirmLoading(true);
      const res = await archiveTeacher(token as string, teacherId);
      if (res.data.status === 200) {
        toast({
          variant: "success",
          title: res.data.message,
        });
        getAllTechersData();
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: err?.response?.data?.message,
      });
    } finally {
      setConfirmLoading(false);
      setIsOpen(false);
    }
  };
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
              setTeacherId(gridParams.data._id);
              getData(gridParams.data._id);
              setTeacherPopup(true);
            },
          },
          {
            title: "View",
            label: "View",
            className: "",
            callback: () => {
              navigate(`/teacher/view/${gridParams.data._id}`);
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
        headerName: "Employee ID",
        field: "employeeID",
        headerClass: "ag-header-custom1 ",
        tooltipField: "employeeID",
        minWidth: 20,
        flex: 1,
        sortable: false,
        pinned: "left",
      },
      {
        headerName: "Name",
        field: "fullName",
        headerClass: "ag-header-custom",
        tooltipField: "fullName",
        minWidth: 100,
        flex: 1,
        sortable: false,
        pinned: "left",
      },
      {
        headerName: "DOB",
        field: "dob",
        tooltipField: "dob",
        headerClass: "ag-header-custom",
        minWidth: 110,
        flex: 1,
        sortable: false,
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
        headerName: "Teaching Department",
        field: "teachingDepartment",
        headerClass: "ag-header-custom",
        minWidth: 110,
        flex: 1,
        sortable: false,
        cellRenderer: (gridProps: any) => {
          return TeachingDepartmentRenderer(gridProps.data.teachingDepartment);
        },
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
        field: "phoneNo",
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

  const getAllTechersData = async () => {
    try {
      const res = await getTeacher(token as string, checked as boolean);
      if (res.data.status === 200) {
        const formattedData = res.data.data.map((teacher: Teacher) => ({
          ...teacher,
          dob: formatDate(teacher.dob),
        }));
        setRowData(formattedData);
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const getData = async (id: string) => {
    try {
      const response = await getTeacherById(token as string, id);
      if (response.data.status === 200) {
        setTeacherData(response.data.data);
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    getAllTechersData();
  }, [checked]);

  return (
    <>
      <div className="p-[21px] !pb-0 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 justify-between lg:justify-normal w-full ">
          <p className="font-semibold text-[25px]">Teachers</p>
        </div>
        <div className="flex gap-3 flex-col lg:flex-row w-full justify-end">
          <div className="flex flex-col md:flex-row  justify-end md:justify-between gap-3">
            <div className="items-center flex gap-2">
              <Checkbox
                onCheckedChange={(checked) => {
                  setChecked(checked as boolean);
                }}
                id="archived"
              />
              <Label htmlFor="archived">Show Archived</Label>
            </div>
            <div className="w-full lg:w-[200px]">
              <SearchBar placeholder="Search User" />
            </div>
            <Button onClick={() => setTeacherPopup(true)}>Add Teacher</Button>
          </div>
          {showTeacherPopup && (
            <AddEditTeacher
              teacherData={teacherData as any}
              getAllTechersData={getAllTechersData}
              open={showTeacherPopup}
              teacherId={teacherId}
              onOpenChange={() => setTeacherPopup(false)}
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
      <ConfirmPopup
        showConfirmPopup={isOpen}
        title={"Archive user"}
        description={`Do you really want to archive this teacher?`}
        setIsOpen={setIsOpen}
        action={action}
        deleteHandler={deleteHandler}
        confirmLoading={confirmLoading}
        IsOpen={setIsOpen}
        btnTitle={"Archive"}
      />
    </>
  );
};

export default Teachers;
// const LazyLoadedTable = lazy(() => import("@/components/agGrid"));
