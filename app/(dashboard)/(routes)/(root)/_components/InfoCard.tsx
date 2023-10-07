import React from "react";
import { LucideIcon } from "lucide-react";
import IconBadge from "@/components/icon-badge";

interface Props {
  label: string;
  Icon: LucideIcon;
  numberOfCourses: number;
  variant?: "default" | "success";
}

const InfoCard = ({ label, Icon, numberOfCourses, variant }: Props) => {
  return (
    <div className="flex items-center gap-2 p-3 border rounded-md">
      <IconBadge variant={variant} Icon={Icon} />

      <div>
        <p className="font-medium">{label}</p>

        <p className="text-gray-500 text-sm">
          {numberOfCourses} {numberOfCourses === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
