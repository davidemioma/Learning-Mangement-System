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

      //   const res = await axios.post(`/api/courses/${courseId}/checkout`);

      //   window.location.assign(res.data.url);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full md:w-auto"
      size="sm"
      disabled={isLoading}
      onClick={onClick}
    >
      Enroll for {formatPrice(coursePrice)}
    </Button>
  );
};

export default CourseEnrollButton;
