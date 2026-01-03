import { useMain } from "../hooks/main";
import type { ImageItem } from "../hooks/images";
import { trackImageView, trackImageClick } from "../utils/analytics";
import { useEffect } from "react";

type MainProps = {
  imageList: ImageItem[];
  index: number;
  changeIndex: (index: number) => void;
};

const Main = ({ imageList, index, changeIndex }: MainProps) => {
  const { mainFrameRef, base, frameSize, loadedMap, handleClick } = useMain(
    imageList,
    index,
    changeIndex,
  );
  const activeImage = imageList[index];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = index > 0 ? index - 1 : imageList.length - 1;
    changeIndex(newIndex);
    trackImageClick(activeImage.filename, "nav_prev");
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = index < imageList.length - 1 ? index + 1 : 0;
    changeIndex(newIndex);
    trackImageClick(activeImage.filename, "nav_next");
  };

  const getScaledSize = (image: ImageItem) => {
    if (!frameSize.width || !frameSize.height) return { width: 0, height: 0 };

    const widthRatio = frameSize.width / image.width;
    const heightRatio = frameSize.height / image.height;
    const scale = Math.min(widthRatio, heightRatio);

    return {
      width: Math.floor(image.width * scale),
      height: Math.floor(image.height * scale),
    };
  };
  const activeImageSize = getScaledSize(activeImage);
  const isActiveLoaded = Boolean(loadedMap[activeImage.filename]);

  useEffect(() => {
    if (activeImage) {
      trackImageView(activeImage.filename, index);
    }
  }, [activeImage.filename, index]);

  return (
    <div className="flex h-screen w-screen flex-row items-end justify-end p-10 text-center max-md:h-[100vw] max-md:w-[100vh]">
      <div className="origin-right scale-x-[1.3] mb-0 mr-5 h-[30px] select-text text-[16pt] tracking-[-1px] max-md:text-[10pt]">
        {activeImage.title}
      </div>
      <div
        ref={mainFrameRef}
        onClick={(e) => {
          trackImageClick(activeImage.filename, "main_frame");
          handleClick(e);
        }}
        className="group relative flex h-full w-[68%] items-center justify-center overflow-hidden border border-black dark:border-white max-md:aspect-square max-md:w-auto"
      >
        {!isActiveLoaded && (
          <div
            className="skeleton-shimmer"
            style={{
              width: activeImageSize.width,
              height: activeImageSize.height,
            }}
          />
        )}
        {imageList.map((imageItem, imageIndex) => {
          const imageSize = getScaledSize(imageItem);
          const isActive = imageIndex === index;

          return (
            <img
              key={imageItem.filename}
              src={`${base}images/artWorks/${imageItem.filename}`}
              alt={imageItem.title}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: imageSize.width,
                height: imageSize.height,
                zIndex: isActive ? 10 : 0,
                opacity: isActive ? 1 : 0,
                pointerEvents: "none",
              }}
            />
          );
        })}

        {/* Left Navigation */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 h-full z-20  opacity-20 hover:opacity-100 active:opacity-100 cursor-pointer"
          aria-label="Previous image"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 max-md:w-8 max-md:h-8 stroke-black dark:stroke-white pointer-events-none"
          >
            <title>Previous</title>
            <circle cx="24" cy="24" r="23" strokeWidth="1" />
            <path
              d="M28 16 L20 24 L28 32"
              strokeWidth="1"
              strokeLinecap="square"
              strokeLinejoin="inherit"
            />
          </svg>
        </button>

        {/* Right Navigation */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 h-full z-20  opacity-20 hover:opacity-100 active:opacity-100 cursor-pointer"
          aria-label="Next image"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 max-md:w-8 max-md:h-8 stroke-black dark:stroke-white pointer-events-none"
          >
            <title>Next</title>
            <circle cx="24" cy="24" r="23" strokeWidth="1" />
            <path
              d="M20 16 L28 24 L20 32"
              strokeWidth="1"
              strokeLinecap="square"
              strokeLinejoin="inherit"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Main;
