import React, { useEffect, useState } from "react";
import styles from "../styles/subSection.module.css";
import LineText from "./lineText";
import LinkBox from "./linkBox";
type subSectionProps = {
  pageType: string;
  galleryType: string;
  setGalleryType: (galleryType: string) => void;
};

const SubSection: React.FC<subSectionProps> = ({
  pageType,
  galleryType,
  setGalleryType,
}) => {
  const [isAll, setIsAll] = useState(true);
  const [isFanArt, setIsFanArt] = useState(false);
  const [isOriginal, setIsOriginal] = useState(false);
  const [isWork, setIsWork] = useState(false);
  const mailText = "cos.mos.f.works@gmail.com";
  const mailLink = "mailto:cos.mos.f.works@gmail.com/";

  //ラインを切り替え
  const changeGalleryType = (gallery_type: string) => {
    setIsAll(gallery_type === "All");
    setIsFanArt(gallery_type === "FanArt");
    setIsOriginal(gallery_type === "Original");
    setIsWork(gallery_type === "Work");
  };
  useEffect(() => {
    changeGalleryType(galleryType);
  }, [galleryType]);

  const renderContent = () => {
    if (pageType === "artBoard") {
      return <div />;
    }
    if (pageType === "Gallery") {
      return (
        <div className={styles.subSection}>
          <LineText onClick={() => setGalleryType("All")} isActive={isAll}>
            all
          </LineText>
          <LineText
            onClick={() => setGalleryType("FanArt")}
            isActive={isFanArt}
          >
            fan art
          </LineText>
          <LineText
            onClick={() => setGalleryType("Original")}
            isActive={isOriginal}
          >
            original
          </LineText>
          <LineText onClick={() => setGalleryType("Work")} isActive={isWork}>
            work
          </LineText>
        </div>
      );
    }
    if (pageType === "Contact") {
      return (
        <div className={styles.subSection}>
          <LinkBox
            PlatForm="X"
            userId="@cos_mos_f"
            url="https://x.com/cos_mos_f"
          />
          <LinkBox
            PlatForm="Pixiv"
            userId="こすもす"
            url="https://www.pixiv.net/users/56797770"
          />
          <LinkBox
            PlatForm="Email"
            userId={`${mailText}`}
            url={`${mailLink}`}
          />
          <LinkBox
            PlatForm="Forms"
            userId="Google Forms"
            url="https://forms.gle/AhuyBKWvzG2EngJM8"
          />
        </div>
      );
    }
  };
  return <div>{renderContent()}</div>;
};

export default SubSection;
