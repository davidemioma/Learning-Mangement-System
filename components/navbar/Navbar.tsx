import React from "react";
import NavRoutes from "./NavRoutes";
import MobileSidebar from "../sidebar/MobileSidebar";

const Navbar = () => {
  return (
    <div className="bg-white h-full w-full flex items-center px-4 border-b shadow-sm">
      <MobileSidebar />

      <NavRoutes />
    </div>
  );
};

export default Navbar;
