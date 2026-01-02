import imageListData from "../imageList.json";
import { atom, useAtom } from "jotai";

export type ImageItem = {
  filename: string;
  title: string;
  width: number;
  height: number;
  tag: string;
};

export type ImageItemWithIndex = ImageItem & {
  index: number;
};

export type GalleryType = "All" | "FanArt" | "Original" | "Work";

const galleryTypeAtom = atom<GalleryType>("All");

const imageList = imageListData as ImageItem[];

export const useImages = () => {
  const [galleryType, setGalleryType] = useAtom(galleryTypeAtom);

  const allImages = imageList;
  const filteredImages = allImages
    .map((image, index) => ({ ...image, index }))
    .filter((image) => {
      if (galleryType === "All") return true;
      return (
        (galleryType === "FanArt" && image.tag.includes("f")) ||
        (galleryType === "Original" && image.tag.includes("o")) ||
        (galleryType === "Work" && image.tag.includes("w"))
      );
    });

  return { galleryType, setGalleryType, allImages, filteredImages };
};
