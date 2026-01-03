import { useEffect, useRef, useState } from "react";
import type { ImageItem } from "./images";

export const useMain = (
  imageList: ImageItem[],
  index: number,
  changeIndex: (nextIndex: number) => void,
) => {
  const base = import.meta.env.BASE_URL;
  const mainFrameRef = useRef<HTMLDivElement | null>(null);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const updateFrameSize = () => {
      if (mainFrameRef.current) {
        const rect = mainFrameRef.current.getBoundingClientRect();
        setFrameSize({ width: rect.width, height: rect.height });
      }
    };

    window.addEventListener("resize", updateFrameSize);
    updateFrameSize();
    return () => window.removeEventListener("resize", updateFrameSize);
  }, []);

  useEffect(() => {
    let canceled = false;
    setLoadedMap({});

    for (const image of imageList) {
      const img = new Image();
      img.src = `${base}images/artWorks/${image.filename}`;
      img.onload = () => {
        if (canceled) return;
        setLoadedMap((prev) => ({ ...prev, [image.filename]: true }));
      };
    }

    return () => {
      canceled = true;
    };
  }, [imageList, base]);

  useEffect(() => {
    const interval = setInterval(() => {
      changeIndex((index + 1) % imageList.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [index, changeIndex, imageList.length]);

  return {
    mainFrameRef,
    base,
    frameSize,
    loadedMap,
  };
};
