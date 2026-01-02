import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

export const useScrollBar = (
  currentPosition: number,
  onScrollChange: (position: number) => void,
  setIsHovered: (isHovered: boolean) => void,
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const animationIntervalRef = useRef<number | null>(null);

  const animateScroll = useCallback(
    (start: number, end: number) => {
      const duration = 150;
      const frameRate = 60;
      const totalFrames = (duration / 1000) * frameRate;
      const step = (end - start) / totalFrames;
      let currentFrame = 0;

      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }

      animationIntervalRef.current = window.setInterval(() => {
        currentFrame++;
        const newPosition = start + step * currentFrame;
        onScrollChange(clamp(newPosition));

        if (currentFrame >= totalFrames) {
          clearInterval(animationIntervalRef.current!);
          animationIntervalRef.current = null;
        }
      }, 1000 / frameRate);
    },
    [onScrollChange],
  );

  const handleScroll = useCallback(
    (event: WheelEvent) => {
      const delta = event.deltaY > 0 ? 0.1 : -0.1;
      const targetPosition = clamp(currentPosition + delta);
      animateScroll(currentPosition, targetPosition);
    },
    [currentPosition, animateScroll],
  );

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const isHorizontal = rect.width > rect.height;
      const clickPosition = isHorizontal
        ? rect.right - event.clientX
        : event.clientY - rect.top;
      const base = isHorizontal ? rect.width : rect.height;
      const targetPosition = clamp(clickPosition / base);
      animateScroll(currentPosition, targetPosition);
    },
    [animateScroll, currentPosition],
  );

  const handleDragStart = useCallback(
    (event: MouseEvent<HTMLImageElement>) => {
      setIsDragging(true);
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
      event.preventDefault();
    },
    [],
  );

  const handleDragMove = useCallback(
    (event: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isHorizontal = rect.width > rect.height;
        const dragPosition = isHorizontal
          ? rect.right - event.clientX
          : event.clientY - rect.top;
        const base = isHorizontal ? rect.width : rect.height;
        const newPosition = clamp(dragPosition / base);
        onScrollChange(newPosition);
      }
    },
    [isDragging, onScrollChange],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
    }
    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleScroll as EventListener);
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleScroll as EventListener);
      }
    };
  }, [currentPosition, handleScroll]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), [setIsHovered]);
  const handleMouseLeave = useCallback(() => setIsHovered(false), [setIsHovered]);

  return {
    containerRef,
    handleClick,
    handleDragStart,
    handleMouseEnter,
    handleMouseLeave,
  };
};
