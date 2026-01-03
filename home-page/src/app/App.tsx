"use client";
import { useRef, useEffect } from "react";
import Loading from "./components/Loading";
import ArtBoard from "./components/ArtBoard";
import Gallery from "./components/Gallery";
import MainSection from "./components/MainSection";
import SubSection from "./components/SubSection";
import CustomScrollbar from "./components/CustomScrollbar";
import { usePageType } from "./hooks/pageType";
import { useImages } from "./hooks/images";
import { usePreloadImages } from "./hooks/preloadImages";
import * as RadixScrollArea from "@radix-ui/react-scroll-area";
import { useScroll } from "./hooks/scroll";

export default function App() {
  const { pageType, setPageType } = usePageType();
  const {
    allImages,
    filteredImages,
    galleryType,
    setGalleryType,
    getIndexByFilename,
  } = useImages();
  const { isLoading } = usePreloadImages(allImages, 10);
  const { scrollPosition, setScrollPosition, setArtBoardScrollPosition } =
    useScroll();
  const indexToScrollPosition = (index: number, total: number) => {
    if (total <= 1) return 0;
    return index / (total - 1);
  };
  const scrollPositionToIndex = (position: number, total: number) => {
    if (total <= 1) return 0;
    return Math.round(position * (total - 1));
  };

  const total = filteredImages.length;
  const currentIndex = scrollPositionToIndex(scrollPosition, total);

  const setCurrentIndex = (index: number) => {
    const position = indexToScrollPosition(index, total);
    setScrollPosition(position);
  };

  const touchStartX = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const viewport = e.currentTarget;
    const touchCurrentX = e.touches[0].clientX;
    const deltaX = touchStartX.current - touchCurrentX;
    viewport.scrollLeft += deltaX;
    touchStartX.current = touchCurrentX;
  };

  // Sync scrollPosition with viewport scroll
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = viewport;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        const newPosition = scrollLeft / maxScroll;
        setScrollPosition(newPosition);
      }
    };

    viewport.addEventListener("scroll", handleScroll);
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [setScrollPosition]);

  // Sync viewport scroll with scrollPosition changes from scrollbar
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const { scrollWidth, clientWidth } = viewport;
    const maxScroll = scrollWidth - clientWidth;
    const targetScroll = scrollPosition * maxScroll;

    viewport.scrollLeft = targetScroll;
  }, [scrollPosition]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative h-screen w-screen overflow-auto max-md:h-[100vw] max-md:w-[100vh]">
      <div className="fixed left-0 top-0 z-20 flex h-full w-fit p-11">
        <MainSection pageType={pageType} setPageType={setPageType} />
        <SubSection
          pageType={pageType}
          galleryType={galleryType}
          setGalleryType={setGalleryType}
        />
      </div>
      <CustomScrollbar
        scrollPosition={scrollPosition}
        setScrollPosition={setScrollPosition}
      />
      <RadixScrollArea.Root
        className="
      fixed left-0 top-0 z-10 
      h-full w-full 
      max-md:h-[100vw] max-md:w-[100vh]
      "
      >
        <RadixScrollArea.Viewport
          ref={viewportRef}
          className="h-full w-full"
          onWheel={(e) => {
            const viewport = e.currentTarget;
            viewport.scrollLeft += e.deltaY;
            // e.preventDefault();
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div className="h-screen w-fit flex">
            {pageType === "ArtBoard" ? (
              <ArtBoard
                imageList={allImages}
                index={currentIndex}
                changeIndex={setCurrentIndex}
              />
            ) : pageType === "Gallery" ? (
              <Gallery
                imageList={filteredImages}
                onClickImage={(filename) => {
                  setPageType("ArtBoard");
                  setArtBoardScrollPosition(
                    indexToScrollPosition(
                      getIndexByFilename(filename),
                      filteredImages.length,
                    ),
                  );
                }}
              />
            ) : (
              <div />
            )}
          </div>
        </RadixScrollArea.Viewport>
        <RadixScrollArea.Scrollbar orientation="horizontal" className="hidden">
          <RadixScrollArea.Thumb />
        </RadixScrollArea.Scrollbar>
      </RadixScrollArea.Root>
    </div>
  );
}
