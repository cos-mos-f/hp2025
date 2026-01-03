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

  // スマホ判定（max-width: 768px）- メディアクエリを直接チェック
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  const positionFromClientY = (clientY: number) => {
    const barElement = barRef.current;
    if (!barElement) return 0;
    const rect = barElement.getBoundingClientRect();

    // モバイルの場合は横方向で計算（90度回転しているため）
    if (isMobile()) {
      const x = rect.right - clientY; // 右端からの距離（左右反転）
      const ratio = x / rect.width;
      return Math.max(
        0,
        Math.min(1, (ratio - TRACK_PADDING_RATIO) / TRACK_RANGE_RATIO),
      );
    }

    // 通常は縦方向で計算
    const y = clientY - rect.top;
    const ratio = y / rect.height;
    return Math.max(
      0,
      Math.min(1, (ratio - TRACK_PADDING_RATIO) / TRACK_RANGE_RATIO),
    );
  };

  const handleDrag = (moveEvent: MouseEvent | TouchEvent) => {
    let clientY: number;
    if ("touches" in moveEvent) {
      // スマホの場合はclientXを使用（90度回転しているため）
      clientY = isMobile()
        ? moveEvent.touches[0].clientX
        : moveEvent.touches[0].clientY;
    } else {
      clientY = moveEvent.clientY;
    }
    const newPosition = positionFromClientY(clientY);
    setScrollPosition(newPosition);
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", handleDrag as EventListener);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", handleDrag as EventListener);
    document.removeEventListener("touchend", stopDrag);
  };

  const startDrag = (clientY: number) => {
    setScrollPosition(positionFromClientY(clientY));
    document.addEventListener("mousemove", handleDrag as EventListener);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", handleDrag as EventListener, {
      passive: false,
    });
    document.addEventListener("touchend", stopDrag);
  };

  return (
    <div
      ref={barRef}
      className="fixed left-5 top-10 bottom-10 z-1000 flex w-10 flex-col items-center justify-center max-md:w-8 cursor-pointer"
      style={{ touchAction: "none" }}
      onMouseEnter={() => setIsBarHovered(true)}
      onMouseLeave={() => setIsBarHovered(false)}
      onClick={(e) => {
        const clientY = isMobile() ? e.clientX : e.clientY;
        const newPosition = positionFromClientY(clientY);
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
      onTouchStart={(e) => {
        if (
          e.target === e.currentTarget ||
          (e.target as HTMLElement).tagName === "DIV"
        ) {
          const clientY = isMobile()
            ? e.touches[0].clientX
            : e.touches[0].clientY;
          startDrag(clientY);
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
        onTouchStart={(e) => {
          const clientY = isMobile()
            ? e.touches[0].clientX
            : e.touches[0].clientY;
          startDrag(clientY);
        }}
      />
    </div>
  );
}
