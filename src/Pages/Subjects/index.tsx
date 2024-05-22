import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../Components/ui/button";
import SearchBar from "../../Components/ComonComponents/searchBar";
import { Label } from "../../Components/ui/label";
import { Checkbox } from "../../Components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import GridActions from "../../Components/gridCellRendrer/GridActions";
import AgGrid from "../../Components/Grid";
import AddEditSubjects from "../../Components/models/addEditSubjects";
import { getSubject } from "../../HttpServices";
import Loader from "../../Components/loader";
import { formatDate } from "../../Utils/helper";

const Subjects = () => {
  const [subjectsPopup, setSubjectsPopup] = useState(false);
  const navigate = useNavigate();
  const [action, setAction] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [subjectsData, setSubjectsData] = useState([]);

  const token = localStorage.getItem("adminToken");

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
              setSubjectsPopup(true);
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
        flex: 1,
        sortable: false,
      },

      {
        headerName: "Created At",
        field: "createdAt",
        headerClass: "ag-header-custom",
        tooltipField: "email",
        flex: 1,
        sortable: false,
      },

      _action,
    ],
    []
  );

  const getRowClass = (params: any) => {
    if (params?.data?.isDeleted) {
      return "!bg-red-50";
    }
  };
  const getAllSub = async () => {
    try {
      setLoading(true);
      const response = await getSubject(token as string);
      if (response?.data?.status === 200) {
        const formattedSubjects = response?.data?.subjects.map(
          (subject: any) => ({
            ...subject,
            createdAt: formatDate(subject.createdAt),
          })
        );
        setSubjectsData(formattedSubjects);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSub();
  }, []);
  return (
    <>
      <div className="p-[21px] !pb-0 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 justify-between lg:justify-normal w-full ">
          <p className="font-semibold text-[25px]">Subjects</p>
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
            <Button onClick={() => setSubjectsPopup(true)}>Add Subjects</Button>
          </div>

          {subjectsPopup && (
            <AddEditSubjects
              open={subjectsPopup}
              getAllSub={getAllSub}
              onOpenChange={() => setSubjectsPopup(false)}
            />
          )}
        </div>
      </div>
      <div className="p-[21px] !pt-0">
        {loading ? (
          <>
            <div className="w-full h-[58vh] flex justify-center items-center">
              <Loader />
            </div>
          </>
        ) : (
          <>
            <AgGrid
              className="py-8"
              height="58vh"
              columnDefs={columnDefs}
              getRowClass={getRowClass}
              rowData={subjectsData}
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

export default Subjects;
