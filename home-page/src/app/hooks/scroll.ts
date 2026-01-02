import { atom, useAtom } from "jotai";
import { usePageType } from "./pageType";

const galleryScrollPositionAtom = atom(0); // 0-1

const artBoardScrollPositionAtom = atom(0); // 0-1

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
  return { scrollPosition, setScrollPosition };
};
