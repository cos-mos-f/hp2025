import { atom, useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { usePageType, type PageType } from "./pageType";

const galleryScrollPositionAtom = atom(0); // 0-1

const artBoardScrollPositionAtom = atom(0); // 0-1

export const indexToScrollPosition = (index: number, total: number) => {
  if (total <= 1) return 0;
  return index / (total - 1);
};

export const scrollPositionToIndex = (position: number, total: number) => {
  if (total <= 1) return 0;
  return Math.round(position * (total - 1));
};

const clampIndex = (index: number, total: number) => {
  if (total <= 0) return 0;
  return Math.min(Math.max(index, 0), total - 1);
};

const readIndexFromQuery = () => {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const raw = url.searchParams.get("index");
  if (raw === null) return null;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) return null;
  return parsed;
};

export const useScroll = () => {
  const { pageType } = usePageType();
  const [galleryScrollPosition, setGalleryScrollPosition] = useAtom(
    galleryScrollPositionAtom,
  );
  const [artBoardScrollPosition, setArtBoardScrollPosition] = useAtom(
    artBoardScrollPositionAtom,
  );

  const scrollPosition =
    pageType === "Gallery" ? galleryScrollPosition : artBoardScrollPosition;
  const setScrollPosition =
    pageType === "Gallery"
      ? setGalleryScrollPosition
      : setArtBoardScrollPosition;
  return {
    scrollPosition,
    setScrollPosition,
    setGalleryScrollPosition,
    setArtBoardScrollPosition,
  };
};

export const useArtBoardIndexQuery = (total: number, pageType: PageType) => {
  const [artBoardScrollPosition, setArtBoardScrollPosition] = useAtom(
    artBoardScrollPositionAtom,
  );

  const setArtBoardIndex = useCallback(
    (nextIndex: number) => {
      if (total <= 0) return;
      const clampedIndex = clampIndex(nextIndex, total);
      setArtBoardScrollPosition(indexToScrollPosition(clampedIndex, total));
    },
    [setArtBoardScrollPosition, total],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (total <= 0) return;
    if (pageType !== "ArtBoard") return;
    const syncFromLocation = () => {
      const indexFromQuery = readIndexFromQuery();
      if (indexFromQuery === null) return;
      const clampedIndex = clampIndex(indexFromQuery, total);
      setArtBoardScrollPosition(indexToScrollPosition(clampedIndex, total));
    };
    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, [pageType, setArtBoardScrollPosition, total]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pageType !== "ArtBoard") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("index")) {
        url.searchParams.delete("index");
        window.history.replaceState({}, "", url);
      }
      return;
    }
    if (total <= 0) return;
    const nextIndex = scrollPositionToIndex(artBoardScrollPosition, total);
    const url = new URL(window.location.href);
    const currentIndex = url.searchParams.get("index");
    const nextIndexText = String(nextIndex);
    if (currentIndex === nextIndexText) return;
    url.searchParams.set("index", nextIndexText);
    window.history.replaceState({}, "", url);
  }, [artBoardScrollPosition, pageType, total]);

  return {
    artBoardIndex: scrollPositionToIndex(artBoardScrollPosition, total),
    setArtBoardIndex,
  };
};
