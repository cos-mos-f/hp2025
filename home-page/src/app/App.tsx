"use client";
import { useState, useEffect } from "react";
import Loading from "./components/Loading";
import { usePageType } from "./hooks/pageType";
import { useImages } from "./hooks/images";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { pageType } = usePageType();
  const { images } = useImages();

  // ------------------ 画像プリロード処理 ------------------
  const preloadImages = async (images: string[]) => {
    const base = import.meta.env.BASE_URL;
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

  useEffect(() => {
    // 全ての画像をプリロードし終わったらローディングを解除
    let imageFilenames = images.map((image) => image.filename);
    if (imageFilenames.length >= 10) {
      imageFilenames = imageFilenames.slice(0, 10);
    }
    preloadImages(imageFilenames).then(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div>main</div>
      <div>
        {pageType === "ArtBoard" ? (
          <div>"ArtBoard Component"</div>
        ) : pageType === "Gallery" ? (
          <div>"Gallery Component"</div>
        ) : (
          <div>"Contact Component"</div>
        )}
      </div>
    </div>
  );
}
