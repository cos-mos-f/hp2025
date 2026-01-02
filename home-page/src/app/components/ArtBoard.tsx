import { useArtBoard } from "../hooks/artBoard";
import type { ImageItem } from "../hooks/images";

type ArtBoardProps = {
  imageList: ImageItem[];
  index: number;
  changeIndex: (index: number) => void;
};

const ArtBoard = ({ imageList, index, changeIndex }: ArtBoardProps) => {
  const { artFrameRef, base, scaledImageSize, isImageLoaded, handleClick } =
    useArtBoard(imageList, index, changeIndex);

  return (
    <div className="flex w-full flex-row items-end justify-end p-10 text-center">
      <div className="mb-0 mr-5 h-[30px] select-text text-[16pt] tracking-[-1px] max-md:text-[10pt]" style={{ transform: "scaleX(1.25)", transformOrigin: "right" }}>
        {imageList[index].title}
      </div>
      <div
        ref={artFrameRef}
        onClick={handleClick}
        className="relative flex h-full w-[68%] items-center justify-center overflow-hidden border border-black dark:border-white max-md:aspect-square max-md:w-auto"
      >
        {!isImageLoaded && (
          <div
            className="skeleton-shimmer"
            style={{
              width: scaledImageSize.width,
              height: scaledImageSize.height,
            }}
          />
        )}
        <img
          src={`${base}images/artWorks/${imageList[index].filename}`}
          alt={imageList[index].title}
          className="-z-10"
          style={{
            display: isImageLoaded ? "block" : "none",
            width: scaledImageSize.width,
            height: scaledImageSize.height,
          }}
        />
      </div>
    </div>
  );
};

export default ArtBoard;
