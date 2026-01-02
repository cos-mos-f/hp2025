import imageList from "../imageList.json";
import { atom, useAtom } from "jotai";

export type GalleryType = "All" | "FanArt" | "Original" | "Work";

const galleryTypeAtom = atom<GalleryType>("All");

export const useImages = () => {
  const [galleryType, setGalleryType] = useAtom(galleryTypeAtom);

  const images = imageList.filter((image) => {
    if (galleryType === "All") return true;
    return (
      (galleryType === "FanArt" && image.tag.includes("f")) ||
      (galleryType === "Original" && image.tag.includes("o")) ||
      (galleryType === "Work" && image.tag.includes("w"))
    );
  });
  return { galleryType, setGalleryType, images };
};
