import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { AiOutlineClose } from "react-icons/ai";
import { Button } from "../ui/button";

const CropModal = ({
  file,
  cancelButtonHandler,
  imageData,
  setImage,
  setImagePrev,
}: any) => {
  const [imgScale, setImgScale] = useState(1);
  const [imgCrpFileURL, setImgCrpFileURL] = useState<any>("");
  const editor = useRef(null);
  return (
    <div className="fixed z-40">
      <div
        className="absolute py-5 translate-x-[-50%] translate-y-[-50%] shadow-2xl w-[456px] top-1/2 left-1/2 
            bg-white rounded-xl"
      >
        <div className="flex justify-between border-b-2 items-center">
          <div className="text-[22px] leading-[26px] font-raleway pb-2 px-5">
            Crop image
          </div>
          <div className="px-4 items-center mb-2 cursor-pointer">
            <AiOutlineClose
              className="text-[20px]"
              onClick={() => {
                cancelButtonHandler(false);
              }}
            />
          </div>
        </div>
        <div className="bg-black">
          <AvatarEditor
            style={{
              width: "456px",
              height: "450px",
            }}
            ref={editor}
            image={file}
            width={250}
            height={250}
            border={50}
            color={[0, 0, 0]} // RGBA
            scale={imgScale}
            // borderRadius={200}
            rotate={0}
          />
        </div>
        <div className="flex items-center px-2 py-2 ">
          <label
            className={`text-[16px] leading-[19px] font-medium mb-1 text-textGray pr-2`}
          >
            Zoom:
          </label>
          <input
            className="w-full accent-primary cursor-pointer"
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={imgScale}
            onChange={(e: any) => setImgScale(e.target.value)}
          />
        </div>

        <div className="flex gap-2 justify-end mr-2">
          <Button onClick={() => cancelButtonHandler(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              if (editor.current) {
                const dataUrl = (editor.current as any).getImage().toDataURL();
                const result = await fetch(dataUrl);
                const blob = await result.blob();

                const _file = new File([blob], imageData.name, {
                  type: blob.type,
                });
                setImagePrev(_file);
                // save your file to state or upload with form data from here.
                let url = URL.createObjectURL(blob);
                setImage(url);
                cancelButtonHandler(false);
              }
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
