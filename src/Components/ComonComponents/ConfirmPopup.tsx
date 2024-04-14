import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Modal from "react-modal";
// import Loader from "../Loader";
import { classNames } from "../../Utils/helper";
import { Button } from "../ui/button";
import Loader from "../loader";

const ConfirmPopup = ({
  title,
  description,
  showConfirmPopup,
  btnTitle2,
  setIsOpen,
  saveHandler,
  saveTest,
  closeConfirmPopup,
  setFunction,
  deleteHandler,
  confirmLoading,
  btnTitle,
}: any) => {
  const customStyles: any = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      padding: "0.5rem",
      borderRadius: "10px",
      zIndex: "999999999",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <>
      <div className="w-0">
        {/* @ts-ignore */}
        <Modal
          style={customStyles}
          isOpen={showConfirmPopup}
          onRequestClose={closeConfirmPopup}
        >
          <div className="p-2">
            <div className="flex justify-between">
              <div className="text-center text-lg text-white font-bold "></div>
              <div className="text-center text-lg font-bold">{title}</div>
              <AiFillCloseCircle
                className="text-2xl cursor-pointer "
                onClick={() => setIsOpen(false)}
              />
            </div>
            {!saveTest && (
              <div className="whitespace-nowrap pt-2 font-bold">
                {" "}
                Are you sure?
              </div>
            )}
            <div className="w-96 pt-2">{description}</div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="ghost"
                onClick={() =>
                  saveHandler
                    ? saveHandler(true)
                    : setFunction
                    ? setFunction()
                    : setIsOpen(false)
                }
                className="flex  items-center  justify-center py-[6px] px-4 text-md border  rounded outline-none shadow-md first-letter:font-medium  "
              >
                {btnTitle2 ? btnTitle2 : "Cancel"}
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  saveHandler
                    ? saveHandler(false)
                    : saveTest
                    ? saveTest()
                    : deleteHandler()
                }
                // @ts-ignore
                className={classNames(
                  "flex items-center  justify-center  py-[6px] px-4 text-md border outline-none rounded shadow-md first-letter:font-medium text-white  "
                )}
              >
                {confirmLoading ? <Loader /> : btnTitle}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ConfirmPopup;
