import { useState, useCallback } from "react";

interface UseDragAndDropOptions {
  dropHandler?:
    | null
    | ((
        draggedElementData: string,
        droppableElementData: string | null,
      ) => void);
  baseDroppableClassString?: string;
  dragActiveDroppableClassString?: string;
  dragActiveDroppableHoverClassString?: string;
}

interface DraggableProps {
  draggable: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

interface DroppableProps {
  className: string;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function useDragAndDrop({
  dropHandler = null,
  baseDroppableClassString = "",
  dragActiveDroppableClassString = "",
  dragActiveDroppableHoverClassString = "",
}: UseDragAndDropOptions) {
  const [activeDraggable, setActiveDraggable] = useState<string | null>(null);
  const [activeDroppable, setActiveDroppable] = useState<string | null>(null);

  // sets draggable element data and drag-active droppable styles
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, id: string, data: string) => {
      e.dataTransfer.setData("id", id);
      e.dataTransfer.setData("draggableData", data);
      setActiveDraggable(id);
    },
    [],
  );

  // adds hover-active droppable styles when hovering
  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>, id: string) => {
      setActiveDroppable(id);
    },
    [],
  );

  // required for droppable functionality
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  // removes hover-active droppable styles when no longer hovering
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (
      e.target === e.currentTarget ||
      !e.currentTarget.contains(e.relatedTarget as Node) // for if dragleave is jump from child element directly to outside the droppable
    ) {
      setActiveDroppable(null);
    }
  }, []);

  // ensures active drag and drop styles removed
  const handleDragEnd = useCallback(() => {
    setActiveDraggable(null);
    setActiveDroppable(null);
  }, []);

  // calls dropHandler with draggable element data and optional droppable element data
  const handleDrop = useCallback(
    (
      e: React.DragEvent<HTMLDivElement>,
      id: string,
      droppableElementData: string | null = null,
    ) => {
      const draggedId = e.dataTransfer.getData("id");
      // don't allow dropping onto self
      if (draggedId !== id) {
        const draggedElementData = e.dataTransfer.getData("draggableData");
        if (dropHandler) dropHandler(draggedElementData, droppableElementData);
      }
    },
    [dropHandler],
  );

  // determines correct styles to apply when drag active
  const droppableClasses = useCallback(
    (
      id: string,
      activeDraggable: string | null,
      activeDroppable: string | null,
    ): string => {
      // don't allow dropping onto self
      if (activeDraggable && id !== activeDraggable) {
        return id === activeDroppable
          ? dragActiveDroppableHoverClassString
          : dragActiveDroppableClassString;
      }
      return "";
    },
    [dragActiveDroppableHoverClassString, dragActiveDroppableClassString],
  );

  // applies draggable functionality with set draggable data
  const getDraggableProps = useCallback(
    (draggableId: string, draggableData: string): DraggableProps => {
      return {
        draggable: true,
        onDragStart: (e) => handleDragStart(e, draggableId, draggableData),
        onDragEnd: handleDragEnd,
      };
    },
    [handleDragStart, handleDragEnd],
  );

  // applies droppable functionality with optionally set droppable data + styling
  const getDroppableProps = useCallback(
    (droppableId: string, droppableData?: string): DroppableProps => {
      return {
        className: `${baseDroppableClassString} ${droppableClasses(
          droppableId,
          activeDraggable,
          activeDroppable,
        )}`,
        onDragEnter: (e) => handleDragEnter(e, droppableId),
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: (e) => handleDrop(e, droppableId, droppableData || null),
      };
    },
    [
      activeDraggable,
      activeDroppable,
      baseDroppableClassString,
      droppableClasses,
      handleDragEnter,
      handleDragOver,
      handleDragLeave,
      handleDrop,
    ],
  );

  // draggable id and droppable id can only be the same if they are in fact the same element
  return { getDraggableProps, getDroppableProps };
}
