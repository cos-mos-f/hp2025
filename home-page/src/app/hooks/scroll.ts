import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { usePageType, type PageType } from "./pageType";
import { useWorksType } from "./images";

const worksScrollPositionAtom = atom(0); // 0-1

const mainScrollPositionAtom = atom(0); // 0-1

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
  const raw = url.searchParams.get("mainIndex");
  if (raw === null) return null;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) return null;
  return parsed;
};

export const useScroll = () => {
  const { pageType } = usePageType();
  const { worksType } = useWorksType();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pageType !== "Works") return;
    setWorksScrollPosition(0);
  }, [worksType]);

  const [worksScrollPosition, setWorksScrollPosition] = useAtom(
    worksScrollPositionAtom,
  );
  const [mainScrollPosition, setMainScrollPosition] = useAtom(
    mainScrollPositionAtom,
  );

  const scrollPosition =
    pageType === "Works" ? worksScrollPosition : mainScrollPosition;
  const setScrollPosition =
    pageType === "Works" ? setWorksScrollPosition : setMainScrollPosition;
  return {
    scrollPosition,
    setScrollPosition,
    setWorksScrollPosition,
    setMainScrollPosition,
  };
};

export const useMainIndexQuery = (total: number, pageType: PageType) => {
  const [mainScrollPosition, setMainScrollPosition] = useAtom(
    mainScrollPositionAtom,
  );
  const hasSyncedFromQuery = useRef(false);

  const setMainIndex = useCallback(
    (nextIndex: number) => {
      if (total <= 0) return;
      const clampedIndex = clampIndex(nextIndex, total);
      setMainScrollPosition(indexToScrollPosition(clampedIndex, total));
    },
    [setMainScrollPosition, total],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (total <= 0) return;
    if (pageType !== "Main") return;
    const syncFromLocation = () => {
      const indexFromQuery = readIndexFromQuery();
      if (indexFromQuery === null) return;
      const clampedIndex = clampIndex(indexFromQuery, total);
      setMainScrollPosition(indexToScrollPosition(clampedIndex, total));
    };
    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, [pageType, setMainScrollPosition, total]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (total <= 0) return;
    const nextIndex = scrollPositionToIndex(mainScrollPosition, total);
    if (!hasSyncedFromQuery.current) {
      const url = new URL(window.location.href);
      const currentIndex = url.searchParams.get("mainIndex");
      if (currentIndex === null) {
        hasSyncedFromQuery.current = true;
      } else {
        const parsedIndex = Number.parseInt(currentIndex, 10);
        if (!Number.isNaN(parsedIndex) && parsedIndex === nextIndex) {
          hasSyncedFromQuery.current = true;
        } else {
          return;
        }
      }
    }
    if (pageType !== "Main") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("mainIndex")) {
        url.searchParams.delete("mainIndex");
        window.history.replaceState({}, "", url);
      }
      return;
    }
    const url = new URL(window.location.href);
    const currentIndex = url.searchParams.get("mainIndex");
    const nextIndexText = String(nextIndex);
    if (currentIndex === nextIndexText) return;
    url.searchParams.set("mainIndex", nextIndexText);
    window.history.replaceState({}, "", url);
  }, [mainScrollPosition, pageType, total]);

  return {
    mainIndex: scrollPositionToIndex(mainScrollPosition, total),
    setMainIndex,
  };
};
