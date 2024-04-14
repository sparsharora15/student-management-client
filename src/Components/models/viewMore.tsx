import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import AgGrid from "../Grid";

import SelectDropdown from "../ComonComponents/selectDropdown";
import { detailedInfoNavOptions } from "../../Utils/helper";
import { dropDownValues } from "../../Utils/interface";
interface AddEditOrganization {
  open: boolean;
  onOpenChange: () => void;
}

const ViewMore = ({ open, onOpenChange }: AddEditOrganization) => {
  const departmentdropDownValues: dropDownValues[] = [
    {
      value: "allSubjects",
      label: "All Subjects",
    },
    {
      value: "webTechnologies",
      label: "Web Technologies",
    },
    {
      value: "programmingWithC",
      label: "Programming With C",
    },
    {
      value: "dsa",
      label: "DSA",
    },
    {
      value: "maths",
      label: "Maths",
    },
    {
      value: "maths",
      label: "Maths",
    },
  ];
  const [departmentOptions, setDepartmentOptions] = useState<dropDownValues>(
    departmentdropDownValues[0]
  );
  const [selectedOption, setSelectedOption] = useState(
    detailedInfoNavOptions[0]
  );
  const getRowClass = (params: any) => {
    if (params?.data?.isDeleted) {
      return "!bg-red-50";
    }
  };
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Subject",
        field: "subject",
        headerClass: "ag-header-custom1 ",
        tooltipField: "subject",
        minWidth: 20,
        flex: 1,
        sortable: false,
        pinned: "left",
      },
      {
        headerName: "Assignee Teacher",
        field: "assigneeTeacher",
        headerClass: "ag-header-custom",
        tooltipField: "assigneeTeacher",
        minWidth: 100,
        flex: 1,
        sortable: false,
        pinned: "left",
      },

      {
        headerName: "Total Classes",
        field: "totalClasses",
        headerClass: "ag-header-custom",
        tooltipField: "totalClasses",
        minWidth: 110,
        flex: 1,
        sortable: false,
      },
      {
        headerName: "Mid Term Marks",
        field: "midTermMarks",
        headerClass: "ag-header-custom",
        tooltipField: "midTermMarks",
        minWidth: 110,
        flex: 1,
        sortable: false,
      },
      {
        headerName: "End Term Marks",
        field: "endTermMarks",
        headerClass: "ag-header-custom",
        tooltipField: "endTermMarks",
        minWidth: 150,
        flex: 1,
        sortable: false,
      },
      {
        headerName: "Classes Attended",
        field: "classesAttended",
        headerClass: "ag-header-custom",
        tooltipField: "contactNumber",
        minWidth: 150,
        flex: 1,
        sortable: false,
      },
      {
        headerName: "Absent",
        field: "absent",
        headerClass: "ag-header-custom2",
        tooltipField: "absent",
        minWidth: 150,
        flex: 1,
        sortable: false,
      },
      //   _action,
    ],
    []
  );
  const rowData = useMemo(
    () => [
      {
        subject: "Web Technologies",
        assigneeTeacher: "Mr. John Doe",
        totalClasses: 20,
        midTermMarks: 80,
        endTermMarks: 90,
        classesAttended: 18,
        absent: 2,
      },
      {
        subject: "Programming With C",
        assigneeTeacher: "Ms. Jane Doe",
        totalClasses: 25,
        midTermMarks: 70,
        endTermMarks: 85,
        classesAttended: 22,
        absent: 3,
      },
      {
        subject: "DSA",
        assigneeTeacher: "Dr. Smith",
        totalClasses: 30,
        midTermMarks: 75,
        endTermMarks: 88,
        classesAttended: 25,
        absent: 5,
      },
      {
        subject: "Maths",
        assigneeTeacher: "Prof. Johnson",
        totalClasses: 35,
        midTermMarks: 85,
        endTermMarks: 95,
        classesAttended: 30,
        absent: 5,
      },
    ],
    []
  );
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white p-[20px] max-h-[90vh] w-[90vw] ">
          <div className="w-full  flex flex-col">
            <p className="text-[#1E293B] font-semibold text-[24px]">
              Detailed Student Info
            </p>
            <div className="my-[20px] text-[#1E293B] gap-2 font-semibold text-[20px] flex ">
              <ul className=" flex flex-col gap-2 rounded-sm border w-[15%]">
                {detailedInfoNavOptions?.map((el, i) => {
                  return (
                    <li
                      className={`hover:bg-primary hover:text-[#FFFFFF] p-2 ${
                        selectedOption?.label === el?.label &&
                        "bg-primary text-[#FFFFFF]"
                      }`}
                      key={i}
                    >
                      {el.name}
                    </li>
                  );
                })}
              </ul>
              <div className="border rounded-sm flex flex-col p-2 w-[85%]">
                <div className="h-[3rem] flex w-full items-center gap-4">
                  <div className="w-[12rem]">
                    <SelectDropdown
                      options={departmentdropDownValues}
                      onChange={(selectedOption: any) =>
                        setDepartmentOptions(selectedOption)
                      }
                      value={departmentOptions}
                      placeholder="Select an option"
                    />
                  </div>
                  <span className="flex items-center">Total Classes:1000</span>
                  <span className="flex items-center">Total Present:1000</span>
                  <span className="flex items-center">Total Absent:1000</span>
                  <span className="flex items-center">Marks:500/500</span>
                  <span className="flex items-center">GPA:10</span>
                </div>
                <div className="">
                  <AgGrid
                    className="py-8"
                    height="58vh"
                    columnDefs={columnDefs}
                    getRowClass={getRowClass}
                    rowData={rowData}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewMore;
