"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Draggable,
  Droppable,
  DropResult,
  DragDropContext,
} from "@hello-pangea/dnd";

interface Props {
  initialChapters: Chapter[];
  onReorder: (updatedData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

const ChapterList = ({ initialChapters, onReorder, onEdit }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  const [chapters, setChapters] = useState(initialChapters);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(initialChapters);
  }, [initialChapters]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);

    const [reorderedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);

    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setChapters(items);

    const bulkUpdatedData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdatedData);
  };

  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "bg-slate-200 flex items-center gap-2 mb-4 text-sm text-slate-700 border border-slate-200 rounded-md",
                      chapter.isPublished &&
                        "bg-sky-100 text-sky-700 border-sky-200"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        chapter.isPublished &&
                          "border-r-sky-200 hover:bg-sky-300"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="w-5 h-5" />
                    </div>

                    <span>{chapter.title}</span>

                    <div className="ml-auto pr-2 flex items-center gap-2">
                      {chapter.isFree && <Badge>Free</Badge>}

                      <Badge
                        className={cn(
                          "bg-slate-500",
                          chapter.isPublished && "bg-sky-700"
                        )}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>

                      <Pencil
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                        onClick={() => onEdit(chapter.id)}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChapterList;
