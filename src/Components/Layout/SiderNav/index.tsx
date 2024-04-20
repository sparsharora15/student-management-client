import React, { useState, useEffect } from "react";
import { navOptions } from "../../../Utils/helper";
import { useNavigate } from "react-router-dom";
import { IconType } from "react-icons";
import { LuLogOut } from "react-icons/lu";

interface HandleOptionClickProps {
  name: string;
  path: string;
  icon: IconType;
}
const SideBar = () => {
  const [activeOption, setActiveOption] = useState<string | null>(
    window?.location?.pathname || null
  );
  const navigate = useNavigate();

  const handleOptionClick = (el: HandleOptionClickProps) => {
    setActiveOption(el.path);
    navigate(el.path);
  };

  useEffect(() => {
    window.history.replaceState(null, "", activeOption);
  }, [activeOption]);

  return (
    <>
      <nav
        className="w-[302px] bg-[#FFFFFF] flex-col flex justify-between"
        style={{ height: "calc(100vh - 56px)" }}
      >
        <ul className="flex flex-col py-[10px] px-[18px] gap-[5px] cursor-pointer">
          {navOptions?.map((el, i) => (
            <li
              key={i}
              onClick={() => handleOptionClick(el)}
              className={`font-semibold flex items-center gap-3 rounded-[6px] py-[8px] px-[13px] text-[20px] hover:bg-primary text-[#0F172A] hover:text-[#FFFFFF] ${
                el.path === activeOption ? "bg-primary text-[#FFFFFF]" : ""
              }`}
            >
              {<el.icon />}
              {el.name}
            </li>
          ))}
        </ul>
        <ul className="flex flex-col py-[10px] px-[18px] gap-[5px] cursor-pointer">
          <li
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate('/login')
            }}
            className={`font-semibold flex items-center gap-3 rounded-[6px] py-[8px] px-[13px] text-[20px] hover:bg-primary text-[#0F172A] hover:text-[#FFFFFF] `}
          >
            <LuLogOut />
            Logout
          </li>
        </ul>
      </nav>
    </>
  );
};

export default SideBar;
