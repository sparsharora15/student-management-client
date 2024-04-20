import { useEffect, useState } from "react";

import { RxAvatar } from "react-icons/rx";
import { useParams } from "react-router-dom";
import StudentIDCardPopup from "../../Components/models/viewIDCard";
import ViewMore from "../../Components/models/viewMore";
import { getTeacherById } from "../../HttpServices";
import { Teacher, TeachingDepartment } from "../../Utils/interface";
import { formatDate } from "../../Utils/helper";
import { TeachingDepartmentRenderer } from "../Teacher";

const ViewStudentProfile = () => {
  const { id } = useParams();
  const token = localStorage.getItem("adminToken");
  const [openViewMorePopup, setOpenViewMorePopup] = useState<boolean>(false);
  const [teacherData, setTeacherData] = useState<Teacher>();
  const [openViewIDCardPopup, setOpenViewIDCardPopup] =
    useState<boolean>(false);
  const getData = async () => {
    try {
      const res = await getTeacherById(token as string, id as string);
      if (res.data.status === 200) {
        setTeacherData(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="p-[21px] bg-primary flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 justify-between lg:justify-normal w-full ">
          <p className="font-semibold text-[25px] text-[#ffffff]">
            Teacher Profile
          </p>
        </div>
      </div>
      <div className="w-full  p-5">
        <div className="flex shadow-2xl gap-y-[1.5rem] flex-col p-[21px]">
          <div className="flex flex-row justify-between items-center flex-1 ">
            <div className=" flex gap-3 items-center">
              {teacherData?.profilePicturePublicId ? (
                <img
                  className="w-[80px] h-[80px]"
                  src={teacherData?.profilePicturePublicId}
                  alt="profile picture"
                />
              ) : (
                <RxAvatar className="w-[80px] h-[80px]" />
              )}
              <div className="font-medium text-[20px]">
                {teacherData?.fullName}
              </div>
            </div>
          </div>

          <div className="flex gap-2 ">
            <div className=" border-[1px] rounded-sm  justify-between lg:justify-normal w-full ">
              <p className=" p-2 font-medium text-[20px] bg-primary text-[#ffffff]">
                Personal Details
              </p>
              <div className="p-4 gap-2 flex flex-col">
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">Name:</p>
                  <p className="font-medium text-[20px] ">
                    {teacherData?.fullName}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">Gender:</p>
                  <p className="font-medium text-[20px] ">
                    {teacherData?.gender}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">DOB:</p>
                  <p className="font-medium text-[20px] ">
                    {formatDate(teacherData?.dob)}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">Address:</p>
                  <p className="font-medium text-[20px] ">
                    {teacherData?.address}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">Email:</p>
                  <p className="font-medium text-[20px] ">
                    {teacherData?.email}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">Contact No:</p>
                  <p className="font-medium text-[20px] ">
                    +91 {teacherData?.phoneNo}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">
                    Teaching departments:
                  </p>
                  <p className="font-medium text-[20px] ">
                    {Array.isArray(teacherData?.teachingDepartment) &&
                      TeachingDepartmentRenderer(
                        teacherData?.teachingDepartment as TeachingDepartment[]
                      )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ViewMore
        open={openViewMorePopup}
        onOpenChange={() => setOpenViewMorePopup(false)}
      />
      <StudentIDCardPopup
        open={openViewIDCardPopup}
        onOpenChange={() => setOpenViewIDCardPopup(false)}
      />
    </>
  );
};

export default ViewStudentProfile;
