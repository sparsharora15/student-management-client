import React, { useEffect, useState } from "react";
import SideBar from "./SiderNav";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { decodeToken } from "../../Utils/helper";
import { Roles } from "../../Utils/enum";

const Layout = () => {
  const [role, setRole] = useState<Roles>();
  useEffect(() => {
    decodeToken().then((res) => {
      if (res?.isDecode === false) {
        setRole(Roles.STUDENT);
        localStorage.setItem('role',Roles.STUDENT)
      } else {
        // @ts-ignore
        setRole(res.deCodedToken?.payload?.user?.role);
        // @ts-ignore
        localStorage.setItem('role',res.deCodedToken?.payload?.user?.role)
      }
    });
  }, []);
  return (
    <>
      {role === Roles.ADMIN || (role === Roles.TEACHER && <Header />)}

      <div className={"flex h-[calc(100vh-56px)]"}>
        {role === Roles.ADMIN || (role === Roles.TEACHER && <SideBar role={role} />)}
        <div className={"w-full bg-[#E2E8F0] p-5"}>
          <div
            className={
              "overflow-y-scroll rounded-md w-full bg-[#FFFFFF] h-[calc(100vh-96px)]"
            }
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
