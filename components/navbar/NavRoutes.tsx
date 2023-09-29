"use client";

import React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const NavRoutes = () => {
  const pathname = usePathname();

  const isSearchPage = pathname === "/search";

  const isTeacherPage = pathname?.startsWith("/teacher");

  const isPlayerPage = pathname?.includes("/chapter");

  return (
    <>
      <div className="flex items-center gap-2 ml-auto">
        {isTeacherPage || isPlayerPage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher mode
            </Button>
          </Link>
        )}

        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

export default NavRoutes;
