import React from "react";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  size?: "default" | "sm";
  variant?: "default" | "success";
}

const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

const CourseProgress = ({ value, size, variant }: Props) => {
  return (
    <div>
      <Progress className="h-2" value={value} variant={variant} />

      <p
        className={cn(
          "mt-2 text-sky-700 font-medium",
          colorByVariant[variant || "default"],
          sizeByVariant[size || "default"]
        )}
      >
        {Math.round(value)}% Completed
      </p>
    </div>
  );
};

export default CourseProgress;
