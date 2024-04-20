import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUser } from "react-icons/fa";

const Header = () => {
  return (
    <>
      <div className="w-full shadow-lg bg-[#FFFFFF] h-[56px] flex p-[16px] items-center justify-between">
        <div className="flex items-center gap-[15px]">
          <GiHamburgerMenu className="text-[#1E293B] " />
          <p className="font-semibold text-[18px] text-[#192434]">
            Student Management
          </p>
        </div>
        <div>
          <FaUser />
        </div>
      </div>
    </>
  );
};

export default Header;
