"use client";

import React from "react";
import { IconType } from "react-icons";
import { Category } from "@prisma/client";
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import CategoryItem from "./CategoryItem";

interface Props {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  Music: FcMusic,
  Photography: FcOldTimeCamera,
  Fitness: FcSportsMode,
  Accounting: FcSalesPerformance,
  "Computer Science": FcMultipleDevices,
  Filming: FcFilmReel,
  Engineering: FcEngineering,
};

const Categories = ({ items }: Props) => {
  return (
    <div className="flex items-center gap-2 pb-2 overflow-x-auto scrollbar-hide">
      {items.map((category) => (
        <CategoryItem
          key={category.id}
          label={category.name}
          value={category.id}
          Icon={iconMap[category.name]}
        />
      ))}
    </div>
  );
};

export default Categories;
