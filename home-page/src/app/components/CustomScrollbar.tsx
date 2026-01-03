"use client";

import { useRef, useState } from "react";

type CustomScrollbarProps = {
  scrollPosition: number;
  setScrollPosition: (position: number) => void;
};

const TRACK_PADDING_RATIO = 0.025;
const TRACK_RANGE_RATIO = 0.95;

export default function CustomScrollbar({
  scrollPosition,
  setScrollPosition,
}: CustomScrollbarProps) {
  const [isBarHovered, setIsBarHovered] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const positionFromClientY = (clientY: number) => {
    const barElement = barRef.current;
    if (!barElement) return 0;
    const rect = barElement.getBoundingClientRect();
    const y = clientY - rect.top;
    const ratio = y / rect.height;
    return Math.max(
      0,
      Math.min(1, (ratio - TRACK_PADDING_RATIO) / TRACK_RANGE_RATIO),
    );
  };

  const handleDrag = (moveEvent: MouseEvent) => {
    const newPosition = positionFromClientY(moveEvent.clientY);
    setScrollPosition(newPosition);
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDrag);
  };

  const startDrag = (clientY: number) => {
    setScrollPosition(positionFromClientY(clientY));
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  return (
    <div
      ref={barRef}
      className="fixed left-5 top-10 bottom-10 z-1000 flex w-10 flex-col items-center justify-center max-md:w-8 cursor-pointer"
      onMouseEnter={() => setIsBarHovered(true)}
      onMouseLeave={() => setIsBarHovered(false)}
      onClick={(e) => {
        const newPosition = positionFromClientY(e.clientY);
        setScrollPosition(newPosition);
      }}
      onWheel={(e) => {
        const barElement = barRef.current;
        if (!barElement) return;
        const { height } = barElement.getBoundingClientRect();
        if (height <= 0) return;
        const deltaRatio = e.deltaY / height;
        const nextPosition = Math.max(
          0,
          Math.min(1, scrollPosition + deltaRatio),
        );
        setScrollPosition(nextPosition);
        e.preventDefault();
      }}
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget ||
          (e.target as HTMLElement).tagName === "DIV"
        ) {
          e.preventDefault();
          startDrag(e.clientY);
        }
      }}
    >
      <div
        className={`h-full bg-black dark:bg-white transition-all ${isBarHovered ? "w-0.5" : "w-[0.5px]"}`}
      />
      <div
        className="absolute w-[60px] h-[60px] bg-center bg-no-repeat cursor-pointer max-md:w-10 max-md:h-10 dark:invert dark:brightness-200"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}images/star.svg')`,
          backgroundSize: "60px 60px",
          top: `${scrollPosition * 95 + 2.5}%`,
          transform: "translateY(-50%)",
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          startDrag(e.clientY);
        }}
      />
    </div>
  );
}
