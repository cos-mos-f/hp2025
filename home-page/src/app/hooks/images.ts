import imageListData from "../imageList.json";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import type { PageType } from "./pageType";

export type ImageItem = {
  filename: string;
  title: string;
  width: number;
  height: number;
  tag: string;
};

export type GalleryType = "All" | "FanArt" | "Original" | "Work";

const galleryTypeAtom = atom<GalleryType>("All");

const imageList = imageListData as ImageItem[];

const readGalleryTypeFromQuery = (): GalleryType | null => {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const raw = url.searchParams.get("galleryType");
  if (raw === null) return null;
  if (
    raw === "All" ||
    raw === "FanArt" ||
    raw === "Original" ||
    raw === "Work"
  ) {
    return raw;
  }
  return null;
};

export const useImages = (pageType: PageType) => {
  const [galleryType, setGalleryType] = useAtom(galleryTypeAtom);

  // URLクエリパラメータからgalleryTypeを同期
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pageType !== "Gallery") return;
    const syncFromLocation = () => {
      const galleryTypeFromQuery = readGalleryTypeFromQuery();
      if (galleryTypeFromQuery !== null) {
        setGalleryType(galleryTypeFromQuery);
      }
    };
    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, [pageType, setGalleryType]);

  // galleryTypeが変更されたらURLを更新
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pageType !== "Gallery") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("galleryType")) {
        url.searchParams.delete("galleryType");
        window.history.replaceState({}, "", url);
      }
      return;
    }
    const url = new URL(window.location.href);
    const currentGalleryType = url.searchParams.get("galleryType");
    if (currentGalleryType === galleryType) return;
    url.searchParams.set("galleryType", galleryType);
    window.history.replaceState({}, "", url);
  }, [galleryType, pageType]);

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

  const getIndexByFilename = (filename: string): number => {
    const image = filteredImages.find((img) => img.filename === filename);
    return image ? image.index : -1;
  };
  return {
    galleryType,
    setGalleryType,
    allImages,
    filteredImages,
    getIndexByFilename,
  };
};
