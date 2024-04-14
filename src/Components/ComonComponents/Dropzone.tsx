import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { HiArrowUpTray } from "react-icons/hi2";
import { toast } from "react-toastify";
import { getBase64 } from "../../Utils/helper";
import CropModal from "../models/CropModal";

interface Props {
  getFiles: (acceptedFiles: any) => void;
  accept?: Accept;
  maxFiles?: number;
  file: File;
  setImageChange?: () => void;
  disabled: boolean
  setImagePrev?:any
}
const Dropzone: React.FC<Props> = ({ getFiles, accept, maxFiles, file, setImageChange, disabled, setImagePrev }) => {
  const [preview, setPreview] = useState<any>("");
  const [imageData, setImageData] = useState<any>("");
  const [imageCropModal, setImageCropModal] = useState(false)
  const onDrop = useCallback((acceptedFiles: any) => {
    getFiles(acceptedFiles);
    setImageData(acceptedFiles[0])
    setImageCropModal(true)
  }, []);
  useMemo(() => {
    if (file && file?.name) getBase64(file).then((res: any) => { setPreview(res); if (setImageChange) setImageChange() });
    else setPreview(file)
  }, [file]);
  const { getRootProps, getInputProps, isDragActive, fileRejections, acceptedFiles, } = useDropzone({
    onDrop,
    maxFiles: maxFiles || 1,
    maxSize: 5e6,
    accept: accept || {
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/pdf": [".pdf"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    disabled: disabled || false
  });


  const errorData = () => {
    if (file === undefined && fileRejections.length) {
      toast.error("File is larger than 5MB")
    }
  }

  useEffect(() => {
    errorData()
  }, [fileRejections.length])

  return (
    <>
      <div
        {...getRootProps()}
        className="w-full h-full grid rounded-[5px]"
      >
        <input {...getInputProps()} />
        <div className="grid  gap-2 py-2 relative w-full h-full">
          { preview ? (
            <img alt="image preview" src={preview} className="w-[190px] p-1 h-[190px] object-cover border" />
          ) : (
            <div className="flex justify-center flex-col border w-[190px] p-1 h-[190px] text-center">
                <p>Drag and drop file here</p>
            </div>
          )}
        </div>
      </div>

      {imageCropModal &&
        <CropModal
          file={preview}
          imageData={imageData}
          cancelButtonHandler={setImageCropModal}
          setImage={setPreview}
          fileData={getFiles}
          setImagePrev={setImagePrev}
        />
      }
    </>

  );
};
export default memo(Dropzone);