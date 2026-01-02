import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ImageItemWithIndex } from "./images";

export type GalleryLayoutImage = {
  type: "image";
  image: ImageItemWithIndex;
  width: number;
  height: number;
};

export type GalleryLayoutGroup = {
  type: "group";
  direction: "column" | "row";
  items: GalleryLayoutNode[];
};

export type GalleryLayoutNode = GalleryLayoutImage | GalleryLayoutGroup;

export const useGallery = (
  imageList: ImageItemWithIndex[],
  currentPosition: number,
  onScrollChange: (position: number) => void,
) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<GalleryLayoutGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const buildLayout = useCallback(() => {
    const layout: GalleryLayoutGroup[] = [];
    const galleryElement = galleryRef.current;
    if (!galleryElement) return layout;

    const { width, height } = galleryElement.getBoundingClientRect();
    const frame = Math.min(width, height);
    let i = 0;
    while (i < imageList.length) {
      if (i + 1 >= imageList.length) {
        const img1 = imageList[i];
        const width1 = frame * 0.5;
        const height1 = (width1 * img1.height) / img1.width;
        layout.push({
          type: "group",
          direction: "column",
          items: [
            {
              type: "image",
              image: img1,
              width: width1,
              height: height1,
            },
          ],
        });
        return layout;
      }
      const img1 = imageList[i];
      const img2 = imageList[i + 1];
      const img3 = imageList[i + 2];
      let WH = [false, false, false];
      if (!img3) {
        WH = [true, true, true];
      } else {
        WH = [
          img1.height > img1.width,
          img2.height > img2.width,
          img3.height > img3.width,
        ];
      }
      if (!WH[0] && WH[1] && WH[2]) {
        const baseCalc =
          1 /
          (img1.width * img2.height * img3.height +
            img2.width * img1.height * img3.height +
            img3.width * img2.height * img1.height);
        const widthBase = ((frame - 100) * img1.width) / img1.height - 20;
        const width2 =
          img2.width * img1.height * img3.height * baseCalc * widthBase;
        const width3 =
          img3.width * img1.height * img2.height * baseCalc * widthBase;
        const width1 = width2 + width3 + 20;
        const height1 = (width1 * img1.height) / img1.width;
        const height2 = (width2 * img2.height) / img2.width;
        const height3 = (width3 * img3.height) / img3.width;
        layout.push({
          type: "group",
          direction: "column",
          items: [
            {
              type: "image",
              image: img1,
              width: width1,
              height: height1,
            },
            {
              type: "group",
              direction: "row",
              items: [
                {
                  type: "image",
                  image: img2,
                  width: width2,
                  height: height2,
                },
                {
                  type: "image",
                  image: img3,
                  width: width3,
                  height: height3,
                },
              ],
            },
          ],
        });
        i += 3;
      } else if (WH[0] && WH[1] && !WH[2]) {
        const baseCalc =
          1 /
          (img1.width * img2.height * img3.height +
            img2.width * img1.height * img3.height +
            img3.width * img2.height * img1.height);
        const widthBase = ((frame - 100) * img3.width) / img3.height - 20;
        const width2 =
          img2.width * img1.height * img3.height * baseCalc * widthBase;
        const width1 =
          img1.width * img3.height * img2.height * baseCalc * widthBase;
        const width3 = width2 + width1 + 20;
        const height1 = (width1 * img1.height) / img1.width;
        const height2 = (width2 * img2.height) / img2.width;
        const height3 = (width3 * img3.height) / img3.width;
        layout.push({
          type: "group",
          direction: "column",
          items: [
            {
              type: "group",
              direction: "row",
              items: [
                {
                  type: "image",
                  image: img1,
                  width: width1,
                  height: height1,
                },
                {
                  type: "image",
                  image: img2,
                  width: width2,
                  height: height2,
                },
              ],
            },
            {
              type: "image",
              image: img3,
              width: width3,
              height: height3,
            },
          ],
        });
        i += 3;
      } else if ((WH[0] && !WH[1] && WH[2]) || (WH[0] && WH[1] && WH[2])) {
        const baseCalc =
          1 / (img1.width * img2.height + img2.width * img1.height);
        const width = (frame - 100) * img1.width * img2.width * baseCalc;
        const height1 = (width * img1.height) / img1.width;
        const height2 = (width * img2.height) / img2.width;
        layout.push({
          type: "group",
          direction: "column",
          items: [
            {
              type: "image",
              image: img1,
              width,
              height: height1,
            },
            {
              type: "image",
              image: img2,
              width,
              height: height2,
            },
          ],
        });
        i += 2;
      } else {
        const baseCalc =
          1 /
          (img1.width * img2.width * img3.height +
            img2.width * img1.height * img3.width +
            img3.width * img2.height * img1.width);
        const widthBase = frame - 120;
        const width =
          img1.width * img2.width * img3.width * baseCalc * widthBase;
        const height1 = (width * img1.height) / img1.width;
        const height2 = (width * img2.height) / img2.width;
        const height3 = (width * img3.height) / img3.width;
        layout.push({
          type: "group",
          direction: "column",
          items: [
            {
              type: "image",
              image: img1,
              width,
              height: height1,
            },
            {
              type: "image",
              image: img2,
              width,
              height: height2,
            },
            {
              type: "image",
              image: img3,
              width,
              height: height3,
            },
          ],
        });
        i += 3;
      }
    }
    return layout;
  }, [imageList]);

  useLayoutEffect(() => {
    setContent(buildLayout());
  }, [buildLayout]);

  useEffect(() => {
    setContent(buildLayout());
  }, [imageList, buildLayout]);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [imageList]);

  useEffect(() => {
    const galleryElement = galleryRef.current;
    if (!galleryElement) return;
    const maxScrollLeft =
      galleryElement.scrollWidth - galleryElement.clientWidth;
    const scrollLeft = maxScrollLeft * currentPosition;
    galleryElement.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, [currentPosition]);

  useEffect(() => {
    const galleryElement = galleryRef.current;
    if (!galleryElement) return;
    let isScrolling = false;
    let scrollDelta = 0;

    const handleWheel = (event: WheelEvent) => {
      scrollDelta += event.deltaY;
      onScrollChange(
        galleryElement.scrollLeft /
          (galleryElement.scrollWidth - galleryElement.clientWidth),
      );
      if (!isScrolling) {
        isScrolling = true;
        smoothScroll();
      }
    };

    const smoothScroll = () => {
      galleryElement.scrollBy({ left: scrollDelta / 5 });
      scrollDelta *= 0.85;
      if (Math.abs(scrollDelta) > 0.5) {
        requestAnimationFrame(smoothScroll);
      } else {
        isScrolling = false;
        scrollDelta = 0;
      }
    };

    document.addEventListener("wheel", handleWheel);
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, [onScrollChange]);

  return { galleryRef, content, isLoading };
};
