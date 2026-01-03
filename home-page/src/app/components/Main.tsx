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
    <div className="flex w-screen flex-row items-end justify-end p-10 text-center">
      <div className="origin-right scale-x-[1.3] mb-0 mr-5 h-[30px] select-text text-[16pt] tracking-[-1px] max-md:text-[10pt]">
        {activeImage.title}
      </div>
      <div
        ref={mainFrameRef}
        onClick={(e) => {
          trackImageClick(activeImage.filename, "main_frame");
          handleClick(e);
        }}
        className="relative flex h-full w-[68%] items-center justify-center overflow-hidden border border-black dark:border-white max-md:aspect-square max-md:w-auto"
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
      </div>
    </div>
  );
};

export default Main;
