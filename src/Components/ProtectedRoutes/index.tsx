import React from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { decodeToken } from "../../Utils/helper";
import { PageProps } from "../../Utils/interface";

const Protected = ({ Components }: PageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    decodeToken().then((res) => {
      if (res?.isDecode === false) {
        navigate("/login");
      } else {
        location.pathname === "/login" || location.pathname === "/register"
          ? navigate("/")
          : navigate(location.pathname);
      }
    });
  }, []);
  return <>{Components}</>;
};

export default Protected;
