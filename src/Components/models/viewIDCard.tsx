import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import logo from "../../images/logo-dtc.png";
import { RxAvatar } from "react-icons/rx";
import QRCode from "react-qr-code";
var Barcode = require("react-barcode");

interface AddEditOrganization {
  open: boolean;
  onOpenChange: () => void;
}

const StudentIDCardPopup = ({ open, onOpenChange }: AddEditOrganization) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white p-[20px]  w-[35%]">
          <div className="w-full  flex flex-col">
            <div className="mt-4 flex flex-col rounded-md">
              <div className="rounded-tl-md rounded-tr-md flex gap-2 items-center bg-[#3E4095] px-[1rem] py-2">
                <div className="w-max">
                  <img
                    src={logo}
                    className="w-[70px] h-[70px] bg-white rounded-[50%]"
                    alt=""
                  />
                </div>
                <div className=" items-center">
                  <p className="leading-[28px] flex flex-col justify-center font-semibold text-[35px] text-[#ffffff]">
                    Delhi Technical Campus
                    <p className="font-normal flex justify-center text-[15px] text-[#ffffff]">
                      (Affiliated to GGSIP University , Delhi)
                    </p>
                    <p className="leading-[20px]  font-normal text-center flex justify-center text-[15px] text-[#ffffff]">
                      28/1, Knowledge Park -III, Greater Noida <br /> Tel :
                      8527215678
                    </p>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 bg-white px-[1rem] py-2 gap-2">
                <div className="leading-[1.2rem] col-span-2">
                  <p className="font-bold text-red-600">Sparsh Arora</p>
                  <p className="font-semibold">Course : BCA</p>
                  <p className="font-semibold">Enrolment No : 02918002021</p>
                  <p className="font-semibold">F/Name : Suresh Arora</p>
                  <p className="font-semibold">
                    Address : Madanpuri colony, chilkana road , Saharanpur
                    247001
                  </p>
                  <p className="font-semibold">Phone No : 8433014744</p>
                  <p className="font-semibold">B.Group : O +</p>
                  <p className="font-semibold">DOB : 15-02-2003</p>
                </div>
                <div className="border">
                  <RxAvatar className="w-full h-full" />
                </div>
              </div>
              <div className="w-full justify-center flex gap-2 px-[1rem] items-center ">
                <div className="h-[50px] w-[50px] flex">
                  <QRCode className="h-full w-full" value="hey" />
                </div>
                <div className="h-[50px] w-[14rem]">
                  <Barcode
                    className="h-full w-full"
                    value="http://github.com/kciter"
                  />
                  ,
                </div>

              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentIDCardPopup;
