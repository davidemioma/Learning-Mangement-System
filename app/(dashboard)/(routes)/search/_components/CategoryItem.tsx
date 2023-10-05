"use client";

import React from "react";
import qs from "query-string";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  label: string;
  value?: string;
  Icon?: IconType;
}

const CategoryItem = ({ label, value, Icon }: Props) => {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const title = searchParams.get("title");

  const categoryId = searchParams.get("categoryId");

  const isSelected = categoryId === value;

  const onClickHandler = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <button
      className={cn(
        "flex items-center gap-1 py-2 px-3 text-sm border border-slate-200 rounded-full hover:border-sky-700 transition",
        isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
      )}
      type="button"
      onClick={onClickHandler}
    >
      {Icon && <Icon size={20} />}

      <div className="truncate">{label}</div>
    </button>
  );
};

export default CategoryItem;
