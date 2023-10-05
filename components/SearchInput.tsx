"use client";

import React, { useEffect, useState } from "react";
import qs from "query-string";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const SearchInput = () => {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const [value, setValue] = useState("");

  const debouncedValue = useDebounce(value);

  const categoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debouncedValue,
          categoryId,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }, [debouncedValue, categoryId, pathname, router]);

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />

      <Input
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        value={value}
        placeholder="Search for a course"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
