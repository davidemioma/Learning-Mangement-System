"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  Icon: LucideIcon;
  label: string;
  href: string;
}

const SidebarItem = ({ Icon, label, href }: Props) => {
  const router = useRouter();

  const pathname = usePathname();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  return (
    <button
      className={cn(
        "flex items-center gap-2 pl-6 text-slate-500 text-sm font-[500] hover:text-slate-600 hover:bg-slate-300/20 transition-all",
        isActive &&
          "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
      )}
      onClick={() => router.push(href)}
    >
      <div className="flex items-center gap-2 py-4">
        <Icon
          size={22}
          className={cn("text-slate-500", isActive && "text-sky-700")}
        />

        <span>{label}</span>
      </div>

      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};

export default SidebarItem;
