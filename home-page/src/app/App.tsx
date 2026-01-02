"use client";
import Loading from "./components/Loading";
import ScrollBar from "./components/ScrollBar";
import ArtBoard from "./components/ArtBoard";
import Gallery from "./components/Gallery";
import MainSection from "./components/MainSection";
import SubSection from "./components/SubSection";
import { usePageType } from "./hooks/pageType";
import { useImages } from "./hooks/images";
import { usePreloadImages } from "./hooks/preloadImages";
import { useScrollPositions } from "./hooks/scrollPositions";

export default function App() {
  const { pageType, setPageType } = usePageType();
  const { allImages, filteredImages, galleryType, setGalleryType } = useImages();
  const { isLoading } = usePreloadImages(allImages, 10);
  const {
    currentIndex,
    setCurrentIndex,
    currentPosition,
    setCurrentPosition,
    currentPositionGallery,
    setCurrentPositionGallery,
    setIsScrollBarHovered,
  } = useScrollPositions(pageType, allImages.length);

  const handleGalleryScrollChange = (position: number) => {
    setCurrentPositionGallery(position);
  };

  const changeImage = (index: number) => {
    setPageType("ArtBoard");
    setCurrentIndex(index);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative h-screen w-screen overflow-auto max-md:h-[100vw] max-md:w-[100vh]">
      <div className="relative z-20 flex h-full w-fit p-11">
        <ScrollBar
          currentPosition={currentPosition}
          onScrollChange={setCurrentPosition}
          setIsHovered={setIsScrollBarHovered}
        />
        <MainSection pageType={pageType} setPageType={setPageType} />
        <SubSection
          pageType={pageType}
          galleryType={galleryType}
          setGalleryType={setGalleryType}
        />
      </div>
      <div className="scrollbar-hidden fixed left-0 top-0 z-10 flex h-full w-full flex-row-reverse overflow-auto max-md:h-[100vw] max-md:w-[100vh]">
        {pageType === "ArtBoard" ? (
          <ArtBoard
            imageList={allImages}
            index={currentIndex}
            changeIndex={setCurrentIndex}
          />
        ) : pageType === "Gallery" ? (
          <Gallery
            imageList={filteredImages}
            currentPosition={currentPositionGallery}
            onScrollChange={handleGalleryScrollChange}
            onClickImage={changeImage}
          />
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
