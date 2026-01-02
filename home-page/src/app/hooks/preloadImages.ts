import { useEffect, useState } from "react";
import type { ImageItem } from "./images";

export const usePreloadImages = (images: ImageItem[], maxCount = 10) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const preloadImages = async (filenames: string[]) => {
      const base = import.meta.env.BASE_URL;
      const promises = filenames.map((filename) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = `${base}images/artWorks/${filename}`;
          img.onload = () => resolve();
          img.onerror = () => reject();
        });
      });
      await Promise.all(promises);
    };

    const imageFilenames = images.map((image) => image.filename);
    const limited = imageFilenames.slice(0, maxCount);

    preloadImages(limited)
      .then(() => {
        if (isMounted) setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [images, maxCount]);

  return { isLoading };
};
