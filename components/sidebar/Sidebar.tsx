import React from "react";
import Image from "next/image";
import SidebarRoutes from "./SidebarRoutes";
const Sidebar = () => {
  return (
    <div className="bg-white h-full border-r flex flex-col shadow-sm overflow-y-auto">
      <div className="p-6">
        <Image
          className="object-cover"
          src="/logo.svg"
          height={130}
          width={130}
          alt="logo"
        />
      </div>

      <SidebarRoutes />
    </div>
  );
};

export default Sidebar;
