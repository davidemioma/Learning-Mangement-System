"use client";

import React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import SearchInput from "../SearchInput";
import { isTeacher } from "@/lib/teacher";
import { usePathname } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";

const NavRoutes = () => {
  const { userId } = useAuth();

  const pathname = usePathname();

  const isSearchPage = pathname === "/search";

  const isCoursePage = pathname?.includes("/courses");

  const isTeacherPage = pathname?.startsWith("/teacher");

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher mode
            </Button>
          </Link>
        ) : null}

        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

export default NavRoutes;
