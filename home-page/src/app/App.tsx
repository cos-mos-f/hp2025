"use client";
import { useState, useEffect } from "react";
import styles from "./styles/Home.module.css";
import ScrollBar from "./components/scrollBar";
import ArtBoard from "./components/artBoard";
import Gallery from "./components/gallery";
import MainSection from "./components/mainSection";
import SubSection from "./components/subSection";
import imageList from "./imageList.json";
import InitialLoading from "./components/initialLoading";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPositionArtBoard, setCurrentPositionArtBoard] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPositionGallery, setCurrentPositionGallery] = useState(0);
  const [pageType, setPageType] = useState("artBoard");
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isScrollBarHovered, setIsScrollBarHovered] = useState(false);
  const [galleryType, setGalleryType] = useState("All");
  //galleryTypeでフィルターしたimageList
  const makeList = () => {
    const list = [];
    for (let i = 0; i < imageList.length; i++) {
      const item = {
        filename: imageList[i].filename,
        title: imageList[i].title,
        width: imageList[i].width,
        height: imageList[i].height,
        tag: imageList[i].tag,
        index: i,
      };
      if (
        (galleryType === "FanArt" && !item.tag.includes("f")) ||
        (galleryType === "Original" && !item.tag.includes("o")) ||
        (galleryType === "Work" && !item.tag.includes("w"))
      ) {
        continue;
      }
      list.push(item);
    }
    return list;
  };
  const [filteredImageList, setFilteredImageList] = useState(makeList());

  // 全ての画像をプリロードする関数
  const preloadImages = async (images: string[]) => {
    const base = import.meta.env.BASE_URL;
    console.log("Base URL for images:", base);
    const promises = images.map((filename) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = `${base}images/artWorks/${filename}`;
        img.onload = () => resolve();
        img.onerror = () => reject();
      });
    });
    await Promise.all(promises);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // 全ての画像をプリロードし終わったらローディングを解除
    const imageFilenames = imageList.map((image) => image.filename);
    preloadImages(imageFilenames).then(() => setIsLoading(false));
  }, []);

  //ギャラリーの表示内容を更新
  useEffect(() => {
    const list = makeList();
    setFilteredImageList(list);
  }, [galleryType]);

  useEffect(() => {
    if (pageType === "artBoard") {
      setCurrentPosition(currentPositionArtBoard);
    } else if (pageType === "Gallery") {
      setCurrentPosition(currentPositionGallery);
    }
  }, [pageType, currentPositionArtBoard, currentPositionGallery]);

  const handleScrollChange = (position: number) => {
    if (pageType === "artBoard") {
      setCurrentPositionArtBoard(position);
    } else if (pageType === "Gallery") {
      setCurrentPositionGallery(position);
    }
    setCurrentPosition(position);
  };

  const handleGalleryScrollChange = (position: number) => {
    setCurrentPositionGallery(position);
  };

  const changeIndex = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const index = Math.round(currentPositionArtBoard * (imageList.length - 1));
    if (currentIndex !== index) {
      changeIndex(index);
    }
  }, [currentPositionArtBoard]);

  useEffect(() => {
    if (!isScrollBarHovered) {
      setCurrentPositionArtBoard(currentIndex / (imageList.length - 1));
    }
  }, [currentIndex]);
  useEffect(() => {
    fetch("https://backend.cos-mos-f.com/notify")
      .then(() => console.log("通知送信"))
      .catch((err) => console.log("通知失敗", err));
  }, []);
  const ChangeImage = (index: number) => {
    setPageType("artBoard");
    setCurrentIndex(index);
  };

  const renderContent = () => {
    if (pageType === "artBoard") {
      return (
        <ArtBoard
          imageList={imageList}
          index={currentIndex}
          changeIndex={changeIndex}
        />
      );
    }
    if (pageType === "Gallery") {
      return (
        <Gallery
          imageList={filteredImageList}
          currentPosition={currentPositionGallery}
          onScrollChange={handleGalleryScrollChange}
          onClickImage={ChangeImage}
        />
      );
    }
    if (pageType === "Contact") {
      return <div />;
    }
  };

  if (isLoading) {
    return <InitialLoading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <ScrollBar
          currentPosition={currentPosition}
          onScrollChange={handleScrollChange}
          setIsHovered={setIsScrollBarHovered}
        />
        <MainSection pageType={pageType} setPageType={setPageType} />
        <SubSection
          pageType={pageType}
          galleryType={galleryType}
          setGalleryType={setGalleryType}
        />
      </div>
      <div className={styles.back}>{renderContent()}</div>
    </div>
  );
}
