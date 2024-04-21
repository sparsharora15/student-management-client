import React, { useEffect, useState } from "react";
import { Checkbox } from "../../Components/ui/checkbox";
import { Label } from "../../Components/ui/label";
import { Button } from "../../Components/ui/button";

import { RxAvatar } from "react-icons/rx";
import ViewMore from "../../Components/models/viewMore";
import StudentIDCardPopup from "../../Components/models/viewIDCard";
import { getStudentById } from "../../HttpServices";
import { useParams } from "react-router-dom";
import { Student, TeachingDepartment } from "../../Utils/interface";
import { formatDate } from "../../Utils/helper";
import { TeachingDepartmentRenderer } from "../Teacher";
const ViewStudentProfile = () => {
  const { id } = useParams();
  const token = localStorage.getItem("adminToken");
  const [openViewMorePopup, setOpenViewMorePopup] = useState<boolean>(false);
  const [openViewIDCardPopup, setOpenViewIDCardPopup] =
    useState<boolean>(false);
  const [studentData, setStudentData] = useState<Student>();

  const getStudentData = async () => {
    try {
      const response = await getStudentById(id as string);
      if (response.data.status === 200) {
        console.log(response?.data.data);
        setStudentData(response?.data.data?.student);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    getStudentData();
  }, []);


  return (
    <>
      <div className="p-[21px] bg-primary flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 justify-between lg:justify-normal w-full ">
          <p className="font-semibold text-[25px] text-[#ffffff]">
            Student Profile
          </p>
        </div>
      </div>
      <div className="w-full  p-5">
        <div className="flex shadow-2xl gap-y-[1.5rem] flex-col p-[21px]">
          <div className="flex flex-row justify-between items-center flex-1 ">
            <div className=" flex gap-3 items-center">
              {studentData?.profilePicturePublicId ? (
                <div
                  className="border w-[100px] h-[100px] flex items-center justify-center p-2"
                >
                  <img
                    className="w-full h-full"
                    src={studentData?.profilePicturePublicId}
                    alt="profile picture"
                    style={{ aspectRatio: "1", objectFit: "contain" }}
                  />
                </div>
              ) : (
                <RxAvatar className="w-[80px] h-[80px]" />
              )}
              <div className="font-medium text-[20px]">
                {studentData?.fullName}
              </div>
            </div>
            <Button onClick={() => setOpenViewIDCardPopup(true)}>
              View ID Card
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2  gap-2 ">
            <div className=" border-[1px] rounded-sm  justify-between lg:justify-normal w-full ">
              <p className=" p-2 font-medium text-[20px] bg-primary text-[#ffffff]">
                Personal Details
              </p>
              <div className="p-4 gap-2 flex flex-col">
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">Name:</p>
                  <p className="font-medium text-[20px] ">
                    {studentData?.fullName}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">Gender:</p>
                  <p className="font-medium text-[20px] ">
                    {studentData?.gender}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">DOB:</p>
                  <p className="font-medium text-[20px] ">
                    {" "}
                    {formatDate(studentData?.dob)}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">Address:</p>
                  <p className="font-medium text-[20px] ">
                    {studentData?.address}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">Email:</p>
                  <p className="font-medium text-[20px] ">
                    {studentData?.email}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">Contact No:</p>
                  <p className="font-medium text-[20px] ">
                    +91 {studentData?.phoneNo}
                  </p>
                </div>
              </div>
            </div>

            <div className=" border-[1px] rounded-sm  justify-between lg:justify-normal w-full ">
              <p className=" p-2 font-medium text-[20px] bg-primary text-[#ffffff]">
                Academic Details
              </p>
              <div className="p-4 gap-2 flex flex-col">
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">Course:</p>
                  <p className="font-medium text-[20px] flex gap-2">
                    {TeachingDepartmentRenderer(
                      studentData?.course as TeachingDepartment
                    )}
                    <span
                      onClick={() => setOpenViewMorePopup(true)}
                      className="underline cursor-pointer text-[blue]"
                    >
                      view more
                    </span>
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">Batch:</p>
                  <p className="font-medium text-[20px] ">2021-24</p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">DOB:</p>
                  <p className="font-medium text-[20px] ">
                    {" "}
                    {formatDate(studentData?.dob)}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">Current SEM:</p>
                  <p className="font-medium text-[20px] ">5th</p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">
                    Total Subjects (Current SEM):
                  </p>
                  <p className="font-medium text-[20px] ">5</p>
                </div>
                <div className="flex gap-x-2">
                  <p className="font-medium text-[20px] ">Overall GPA:</p>
                  <p className="font-medium text-[20px] ">7.54</p>
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
        studentData={studentData as Student}
      />
    </>
  );
};

export default ViewStudentProfile;
