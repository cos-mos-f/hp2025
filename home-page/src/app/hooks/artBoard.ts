import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import type { ImageItem } from "./images";

export const useArtBoard = (
  imageList: ImageItem[],
  index: number,
  changeIndex: (nextIndex: number) => void,
) => {
  const base = import.meta.env.BASE_URL;
  const artFrameRef = useRef<HTMLDivElement | null>(null);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const updateFrameSize = () => {
      if (artFrameRef.current) {
        const rect = artFrameRef.current.getBoundingClientRect();
        setFrameSize({ width: rect.width, height: rect.height });
      }
    };

    window.addEventListener("resize", updateFrameSize);
    updateFrameSize();
    return () => window.removeEventListener("resize", updateFrameSize);
  }, []);

  const scaledImageSize = useMemo(() => {
    if (!frameSize.width || !frameSize.height) return { width: 0, height: 0 };

    const { width, height } = imageList[index];
    const widthRatio = frameSize.width / width;
    const heightRatio = frameSize.height / height;
    const scale = Math.min(widthRatio, heightRatio);

    return {
      width: Math.floor(width * scale),
      height: Math.floor(height * scale),
    };
  }, [index, frameSize.width, frameSize.height, imageList]);

  useEffect(() => {
    setIsImageLoaded(false);
    const img = new Image();
    img.src = `${base}images/artWorks/${imageList[index].filename}`;
    img.onload = () => setIsImageLoaded(true);
  }, [index, imageList, base]);

  useEffect(() => {
    const interval = setInterval(() => {
      changeIndex((index + 1) % imageList.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [index, changeIndex, imageList.length]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const rect = artFrameRef.current?.getBoundingClientRect();
      if (!rect) return;

      const isHorizontal = rect.width >= rect.height;
      const isNext = isHorizontal
        ? event.clientX > rect.left + rect.width / 2
        : event.clientY > rect.top + rect.height / 2;

      changeIndex(
        isNext
          ? (index + 1) % imageList.length
          : (index - 1 + imageList.length) % imageList.length,
      );
    },
    [changeIndex, imageList.length, index],
  );

  return {
    artFrameRef,
    base,
    scaledImageSize,
    isImageLoaded,
    handleClick,
  };
};
