import React, { memo } from "react";
import { ThreeDots } from "react-loader-spinner";

interface Props {
  color?: string;
  width?: string | number;
  height?: string | number;
}
const Loader: React.FC<Props> = ({ color, width, height }) => {
  return (
    <>
      <ThreeDots
        height={height || "20"}
        width={width || "46"}
        color={color || "white"}
        ariaLabel="three-dots-loading"
        visible={true}
      />
    </>
  );
};

export default memo(Loader);
