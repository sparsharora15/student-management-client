import React from "react";
import SideBar from "./SiderNav";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <>
      <Header />
      <div className={"flex h-[calc(100vh-56px)]"}>
        <SideBar />
        <div className={"w-full bg-[#E2E8F0] p-5"}>
          <div
            className={"overflow-y-scroll rounded-md w-full bg-[#FFFFFF] h-[calc(100vh-96px)]"}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
