import { useScrollBar } from "../hooks/scrollBar";

type ScrollBarProps = {
  currentPosition: number;
  onScrollChange: (position: number) => void;
  setIsHovered: (isHovered: boolean) => void;
};

const ScrollBar = ({
  currentPosition,
  onScrollChange,
  setIsHovered,
}: ScrollBarProps) => {
  const base = import.meta.env.BASE_URL;
  const {
    containerRef,
    handleClick,
    handleDragStart,
    handleMouseEnter,
    handleMouseLeave,
  } = useScrollBar(currentPosition, onScrollChange, setIsHovered);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group left-5 top-0 flex h-full w-10 cursor-pointer items-center justify-center max-md:fixed max-md:top-[5vw] max-md:h-[90vw] max-md:w-[30px]"
    >
      <div className="h-full w-px bg-black transition-all duration-200 group-hover:w-[2px] dark:bg-white" />
      <img
        src={`${base}images/star.svg`}
        alt="Star"
        className="absolute h-[60px] w-[60px] -translate-y-1/2 dark:invert dark:brightness-200 max-md:h-10 max-md:w-10"
        style={{ top: `${currentPosition * 90 + 5}%` }}
        onMouseDown={handleDragStart}
      />
    </div>
  );
};

export default ScrollBar;
