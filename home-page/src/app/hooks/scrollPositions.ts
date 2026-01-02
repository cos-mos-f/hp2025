import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import type { PageType } from "./pageType";

const currentPositionArtBoardAtom = atom(0);
const currentPositionGalleryAtom = atom(0);
const currentIndexAtom = atom(0);
const isScrollBarHoveredAtom = atom(false);

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

export const useScrollPositions = (pageType: PageType, imageCount: number) => {
  const [currentPositionArtBoard, setCurrentPositionArtBoard] = useAtom(
    currentPositionArtBoardAtom,
  );
  const [currentPositionGallery, setCurrentPositionGallery] = useAtom(
    currentPositionGalleryAtom,
  );
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const [isScrollBarHovered, setIsScrollBarHovered] = useAtom(
    isScrollBarHoveredAtom,
  );

  const currentPosition = useMemo(() => {
    if (pageType === "ArtBoard") return currentPositionArtBoard;
    if (pageType === "Gallery") return currentPositionGallery;
    return 0;
  }, [pageType, currentPositionArtBoard, currentPositionGallery]);

  const setCurrentPosition = useCallback(
    (position: number) => {
      const next = clamp(position);
      if (pageType === "ArtBoard") {
        setCurrentPositionArtBoard(next);
      } else if (pageType === "Gallery") {
        setCurrentPositionGallery(next);
      }
    },
    [pageType, setCurrentPositionArtBoard, setCurrentPositionGallery],
  );

  useEffect(() => {
    if (imageCount <= 1) return;
    const index = Math.round(currentPositionArtBoard * (imageCount - 1));
    if (currentIndex !== index) {
      setCurrentIndex(index);
    }
  }, [currentPositionArtBoard, currentIndex, imageCount, setCurrentIndex]);

  useEffect(() => {
    if (imageCount <= 1) return;
    if (!isScrollBarHovered) {
      setCurrentPositionArtBoard(currentIndex / (imageCount - 1));
    }
  }, [currentIndex, imageCount, isScrollBarHovered, setCurrentPositionArtBoard]);

  return {
    currentIndex,
    setCurrentIndex,
    currentPosition,
    setCurrentPosition,
    currentPositionGallery,
    setCurrentPositionGallery,
    setIsScrollBarHovered,
  };
};
