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

export type WorksType = "All" | "FanArt" | "Original" | "Work";

const worksTypeAtom = atom<WorksType>("All");

const imageList = imageListData as ImageItem[];

const readWorksTypeFromQuery = (): WorksType | null => {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const raw = url.searchParams.get("worksType");
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
  const [worksType, setWorksType] = useAtom(worksTypeAtom);

  // URLクエリパラメータからworksTypeを同期
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pageType !== "Works") return;
    const syncFromLocation = () => {
      const worksTypeFromQuery = readWorksTypeFromQuery();
      if (worksTypeFromQuery !== null) {
        setWorksType(worksTypeFromQuery);
      }
    };
    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, [pageType, setWorksType]);

  // worksTypeが変更されたらURLを更新
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pageType !== "Works") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("worksType")) {
        url.searchParams.delete("worksType");
        window.history.replaceState({}, "", url);
      }
      return;
    }
    const url = new URL(window.location.href);
    const currentWorksType = url.searchParams.get("worksType");
    if (currentWorksType === worksType) return;
    url.searchParams.set("worksType", worksType);
    window.history.replaceState({}, "", url);
  }, [worksType, pageType]);

  const allImages = imageList;
  const filteredImages = allImages
    .map((image, index) => ({ ...image, index }))
    .filter((image) => {
      if (worksType === "All") return true;
      return (
        (worksType === "FanArt" && image.tag.includes("f")) ||
        (worksType === "Original" && image.tag.includes("o")) ||
        (worksType === "Work" && image.tag.includes("w"))
      );
    });

  const getIndexByFilename = (filename: string): number => {
    const image = filteredImages.find((img) => img.filename === filename);
    return image ? image.index : -1;
  };
  return {
    worksType,
    setWorksType,
    allImages,
    filteredImages,
    getIndexByFilename,
  };
};
