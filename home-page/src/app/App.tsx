"use client";
import { useRef, useEffect, useCallback } from "react";
import Loading from "./components/Loading";
import Main from "./components/Main";
import Works from "./components/Works";
import MainSection from "./components/MainSection";
import SubSection from "./components/SubSection";
import CustomScrollbar from "./components/CustomScrollbar";
import { usePageType } from "./hooks/pageType";
import { useImages } from "./hooks/images";
import { usePreloadImages } from "./hooks/preloadImages";
import * as RadixScrollArea from "@radix-ui/react-scroll-area";
import { useMainIndexQuery, useScroll } from "./hooks/scroll";
import { useSmoothWheel } from "./hooks/smoothWheel";

export default function App() {
  const { pageType, setPageType } = usePageType();
  const {
    allImages,
    filteredImages,
    worksType,
    setWorksType,
    getIndexByFilename,
  } = useImages(pageType);
  const { isLoading } = usePreloadImages(allImages, 10);
  const { scrollPosition, setScrollPosition } = useScroll();

  const total = filteredImages.length;
  const { mainIndex: currentIndex, setMainIndex } = useMainIndexQuery(
    total,
    pageType,
  );

  const touchStartX = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const isScrollbarInputRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const isMobile = window.innerWidth <= 768;
    touchStartX.current = isMobile
      ? e.touches[0].clientY
      : e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const viewport = e.currentTarget;
    const isMobile = window.innerWidth <= 768;
    const touchCurrentX = isMobile
      ? e.touches[0].clientY
      : e.touches[0].clientX;
    const deltaX = touchStartX.current - touchCurrentX;
    viewport.scrollLeft += deltaX;
    touchStartX.current = touchCurrentX;
    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    if (maxScroll > 0) {
      setScrollPosition(viewport.scrollLeft / maxScroll);
    } else {
      setScrollPosition(0);
    }
  };

  const { addDelta, setTarget, stop } = useSmoothWheel({
    getMax: () => {
      const viewport = viewportRef.current;
      if (!viewport) return 0;
      return Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    },
    getCurrent: () => {
      const viewport = viewportRef.current;
      return viewport ? viewport.scrollLeft : 0;
    },
    setCurrent: (value) => {
      const viewport = viewportRef.current;
      if (viewport) {
        viewport.scrollLeft = value;
      }
    },
    onStep: (value, max) => {
      if (max > 0) {
        setScrollPosition(value / max);
      } else {
        setScrollPosition(0);
      }
    },
  });

  const { addDelta: addPositionDelta } = useSmoothWheel({
    getMax: () => 1,
    getCurrent: () => scrollPosition,
    setCurrent: setScrollPosition,
    epsilon: 0.002,
  });

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
    if (isScrollbarInputRef.current) {
      setTarget(targetScroll);
      stop();
      isScrollbarInputRef.current = false;
    }
  }, [scrollPosition, setTarget, stop]);

  const handleScrollbarPositionChange = useCallback(
    (position: number) => {
      isScrollbarInputRef.current = true;
      setScrollPosition(position);
    },
    [setScrollPosition],
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative h-screen w-screen overflow-auto max-md:h-[100vw] max-md:w-[100vh]">
      <div className="pointer-events-none fixed left-0 top-0 z-20 flex h-full w-fit p-11">
        <MainSection pageType={pageType} setPageType={setPageType} />
        <SubSection
          pageType={pageType}
          worksType={worksType}
          setWorksType={setWorksType}
        />
      </div>
      <CustomScrollbar
        scrollPosition={scrollPosition}
        setScrollPosition={handleScrollbarPositionChange}
        onWheelDelta={(deltaRatio) => {
          const viewport = viewportRef.current;
          if (!viewport) return;
          const maxScroll = Math.max(
            0,
            viewport.scrollWidth - viewport.clientWidth,
          );
          const scaledDeltaRatio = deltaRatio * 0.5;
          if (maxScroll > 0) {
            addDelta(scaledDeltaRatio * maxScroll);
          } else {
            addPositionDelta(scaledDeltaRatio);
          }
        }}
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
            let delta =
              Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (e.deltaMode === 1) {
              delta *= 16;
            } else if (e.deltaMode === 2) {
              delta *= viewport.clientHeight;
            }
            addDelta(delta * 2.1);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div className="h-screen w-fit flex">
            {pageType === "Main" ? (
              <Main
                imageList={allImages}
                index={currentIndex}
                changeIndex={setMainIndex}
              />
            ) : pageType === "Works" ? (
              <Works
                imageList={filteredImages}
                onClickImage={(filename) => {
                  setPageType("Main");
                  setMainIndex(getIndexByFilename(filename));
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
