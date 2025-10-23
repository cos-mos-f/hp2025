import type React from "react";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Gallery.module.css";
import Loading from "./Loading";
type ImageItemG = {
  filename: string;
  title: string;
  width: number;
  height: number;
  tag: string;
  index: number;
};

type GalleryProps = {
  imageList: ImageItemG[];
  currentPosition: number;
  onScrollChange: (position: number) => void;
  onClickImage: (index: number) => void;
};

type imageProps = {
  data: ImageItemG;
  width: number;
  height: number;
};

const Gallery: React.FC<GalleryProps> = ({
  imageList,
  currentPosition,
  onScrollChange,
  onClickImage,
}) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const base = import.meta.env.BASE_URL;

  //画像フレーム
  const GalleryImage: React.FC<imageProps> = ({ data, width, height }) => {
    return (
      <img
        src={`${base}images/artWorks/${data.filename}`}
        alt={data.title}
        className={styles.image}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        loading="lazy"
        onClick={() => onClickImage(data.index)}
      />
    );
  };
  const galleryDimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (galleryRef.current) {
      const { width, height } = galleryRef.current.getBoundingClientRect();
      if (width > height) {
        galleryDimensions.current = { width, height };
      } else {
        galleryDimensions.current = { height, width };
      }
    }
  }, []);

  //スクロールバーからの位置変更
  useEffect(() => {
    const galleryElement = galleryRef.current;

    if (galleryElement) {
      const maxScrollLeft =
        galleryElement.scrollWidth - galleryElement.clientWidth;
      const scrollLeft = maxScrollLeft * currentPosition;
      galleryElement.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [currentPosition]);

  //マウスホイールからの位置変更
  useEffect(() => {
    const galleryElement = galleryRef.current;
    if (galleryElement) {
      let isScrolling = false;
      let scrollDelta = 0;
      const handleWheel = (event: WheelEvent) => {
        // event.preventDefault();
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
        if (!galleryElement) return;
        galleryElement.scrollBy({
          left: scrollDelta / 5, // 分割してスムーズに移動
        });
        scrollDelta *= 0.85; // 減速
        if (Math.abs(scrollDelta) > 0.5) {
          requestAnimationFrame(smoothScroll);
        } else {
          isScrolling = false;
          scrollDelta = 0; // 停止時にリセット
        }
      };
      document.addEventListener("wheel", handleWheel);
      return () => {
        document.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  //レイアウトの作成
  const layoutImages = (images: ImageItemG[]) => {
    const layout: React.ReactElement[] = [];
    let _100 = 0;
    if (galleryRef.current) {
      const galleryRect = galleryRef.current?.getBoundingClientRect();
      _100 = Math.min(galleryRect.height, galleryRect.width);
    }
    let i = 0;
    let key = 0;
    while (i < images.length) {
      if (i + 1 >= images.length) {
        const img1 = images[i];
        const width1 = _100 * 0.5;
        const height1 = (width1 * img1.height) / img1.width;
        layout.push(
          <div className={styles.verticalFrame} key={key}>
            <GalleryImage data={img1} width={width1} height={height1} />
          </div>,
        );
        return layout;
      }
      const img1 = images[i];
      const img2 = images[i + 1];
      const img3 = images[i + 2];
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
        // 上1下2
        const base =
          1 /
          (img1.width * img2.height * img3.height +
            img2.width * img1.height * img3.height +
            img3.width * img2.height * img1.height);
        const width_base = ((_100 - 100) * img1.width) / img1.height - 20;
        const width2 =
          img2.width * img1.height * img3.height * base * width_base;
        const width3 =
          img3.width * img1.height * img2.height * base * width_base;
        const width1 = width2 + width3 + 20;
        const height1 = (width1 * img1.height) / img1.width;
        const height2 = (width2 * img2.height) / img2.width;
        const height3 = (width3 * img3.height) / img3.width;
        layout.push(
          <div className={styles.verticalFrame} key={key}>
            <GalleryImage data={img1} width={width1} height={height1} />
            <div className={styles.horizontalFrame}>
              <GalleryImage data={img2} width={width2} height={height2} />
              <GalleryImage data={img3} width={width3} height={height3} />
            </div>
          </div>,
        );
        i += 3;
        key += 1;
      } else if (WH[0] && WH[1] && !WH[2]) {
        // 上2下1
        const base =
          1 /
          (img1.width * img2.height * img3.height +
            img2.width * img1.height * img3.height +
            img3.width * img2.height * img1.height);
        const width_base = ((_100 - 100) * img3.width) / img3.height - 20;
        const width2 =
          img2.width * img1.height * img3.height * base * width_base;
        const width1 =
          img1.width * img3.height * img2.height * base * width_base;
        const width3 = width2 + width1 + 20;
        const height1 = (width1 * img1.height) / img1.width;
        const height2 = (width2 * img2.height) / img2.width;
        const height3 = (width3 * img3.height) / img3.width;
        layout.push(
          <div className={styles.verticalFrame} key={key}>
            <div className={styles.horizontalFrame}>
              <GalleryImage data={img1} width={width1} height={height1} />
              <GalleryImage data={img2} width={width2} height={height2} />
            </div>
            <GalleryImage data={img3} width={width3} height={height3} />
          </div>,
        );
        i += 3;
        key += 1;
      } else if ((WH[0] && !WH[1] && WH[2]) || (WH[0] && WH[1] && WH[2])) {
        //2つのみ
        const base = 1 / (img1.width * img2.height + img2.width * img1.height);
        const width = (_100 - 100) * img1.width * img2.width * base;
        const height1 = (width * img1.height) / img1.width;
        const height2 = (width * img2.height) / img2.width;
        layout.push(
          <div className={styles.verticalFrame} key={key}>
            <GalleryImage data={img1} width={width} height={height1} />
            <GalleryImage data={img2} width={width} height={height2} />
          </div>,
        );
        i += 2;
        key += 1;
      } else {
        //3つ縦
        const base =
          1 /
          (img1.width * img2.width * img3.height +
            img2.width * img1.height * img3.width +
            img3.width * img2.height * img1.width);
        const width_base = _100 - 120;
        const width = img1.width * img2.width * img3.width * base * width_base;
        const height1 = (width * img1.height) / img1.width;
        const height2 = (width * img2.height) / img2.width;
        const height3 = (width * img3.height) / img3.width;
        layout.push(
          <div className={styles.verticalFrame} key={key}>
            <GalleryImage data={img1} width={width} height={height1} />
            <GalleryImage data={img2} width={width} height={height2} />
            <GalleryImage data={img3} width={width} height={height3} />
          </div>,
        );
        i += 3;
        key += 1;
      }
    }
    return layout;
  };
  //表示内容
  const [content, setContent] = useState(layoutImages(imageList));
  useEffect(() => {
    setContent(layoutImages(imageList));
  }, []);
  useEffect(() => {
    setContent(layoutImages(imageList));
  }, [imageList]);

  const [isLoading, setIsLoading] = useState(true);

  // 画像のレイアウト作成時にローディングを解除
  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1000); // 仮に500ms待つ
    return () => clearTimeout(timeout);
  }, [imageList]);

  return (
    <div className={styles.galleryWrapper} ref={galleryRef}>
      <div className={styles.space} />
      {isLoading ? (
        <div className={styles.skeleton}>
          <Loading />
        </div>
      ) : (
        content
      )}
    </div>
  );
};

export default Gallery;
