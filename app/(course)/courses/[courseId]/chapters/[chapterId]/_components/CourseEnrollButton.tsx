"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

interface Props {
  courseId: string;
  coursePrice: number;
}

const CourseEnrollButton = ({ courseId, coursePrice }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const res = await axios.post(`/api/courses/${courseId}/checkout`);

      window.location.assign(res.data.url);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <Button
        className="w-full md:w-auto"
        size="sm"
        disabled={isLoading}
        onClick={onClick}
      >
        Enroll for {formatPrice(coursePrice)}
      </Button>

      <div className="text-xs font-semibold flex flex-col">
        <span>Test Card No - 4242 4242 4242 4242</span>
        <span>Test Card Date - 04/24</span>
        <span>Test Card CVV - 242</span>
      </div>
    </div>
  );
};

export default CourseEnrollButton;
