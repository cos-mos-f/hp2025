import { useRef, useEffect, useState, useCallback, type FC } from "react";
import styles from "../styles/scrollBar.module.css";

interface ScrollBarProps {
  currentPosition: number; // 0~1の連続量
  onScrollChange: (position: number) => void; // 連続量(0~1)を渡す
  setIsHovered: (isHovered: boolean) => void; // 連続量(0~1)を渡す
}

const ScrollBar: FC<ScrollBarProps> = ({
  currentPosition,
  onScrollChange,
  setIsHovered,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const animationIntervalRef = useRef<number | null>(null);

  const animateScroll = useCallback(
    (start: number, end: number) => {
      const duration = 150; // アニメーションの持続時間 (ミリ秒) - 短縮
      const frameRate = 60; // 1秒間に更新する回数
      const totalFrames = (duration / 1000) * frameRate;
      const step = (end - start) / totalFrames;
      let currentFrame = 0;

      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current); // 既存のアニメーションをキャンセル
      }

      animationIntervalRef.current = window.setInterval(() => {
        currentFrame++;
        const newPosition = start + step * currentFrame;
        onScrollChange(Math.min(Math.max(newPosition, 0), 1)); // 0~1の範囲内に制限

        if (currentFrame >= totalFrames) {
          clearInterval(animationIntervalRef.current!); // アニメーション終了
          animationIntervalRef.current = null;
        }
      }, 1000 / frameRate);
    },
    [onScrollChange],
  );

  const handleScroll = useCallback(
    (event: WheelEvent) => {
      const delta = event.deltaY > 0 ? 0.1 : -0.1; // スクロール速度を向上
      const targetPosition = Math.min(Math.max(currentPosition + delta, 0), 1);
      animateScroll(currentPosition, targetPosition);
    },
    [currentPosition, animateScroll],
  );

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      if (rect.bottom === 50) {
        const clickY = rect.right - event.clientX;
        const targetPosition = Math.min(Math.max(clickY / rect.width, 0), 1);
        animateScroll(currentPosition, targetPosition);
      } else {
        const clickY = event.clientY - rect.top;
        const targetPosition = Math.min(Math.max(clickY / rect.height, 0), 1);
        animateScroll(currentPosition, targetPosition);
      }
    }
  };

  const handleDragStart = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    setIsDragging(true);
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current); // ドラッグ中はアニメーションを停止
    }
    event.preventDefault();
  };

  const handleDragMove = useCallback(
    (event: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const dragY = event.clientY - rect.top;
        const newPosition = Math.min(Math.max(dragY / rect.height, 0), 1);
        onScrollChange(newPosition);
      }
    },
    [isDragging, onScrollChange],
  );

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
    }
    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging, handleDragMove]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener(
        "wheel",
        handleScroll as unknown as EventListener,
      );
    }
    return () => {
      if (container) {
        container.removeEventListener(
          "wheel",
          handleScroll as unknown as EventListener,
        );
      }
    };
  }, [currentPosition, handleScroll]);

  const base = import.meta.env.BASE_URL;

  return (
    <div
      className={styles.scrollBarContainer}
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)} // ホバー開始
      onMouseLeave={() => setIsHovered(false)} // ホバー終了
    >
      <div className={styles.bar} />
      <img
        src={`${base}images/star.svg`}
        alt="Star"
        className={styles.indicator}
        style={{ top: `${currentPosition * 90 + 5}%` }}
        onMouseDown={handleDragStart}
      />
    </div>
  );
};

export default ScrollBar;
