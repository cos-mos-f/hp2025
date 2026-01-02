import { atom, useAtom } from "jotai";

export type PageType = "ArtBoard" | "Gallery" | "Contact";

const pageTypeAtom = atom<PageType>("ArtBoard");

export const usePageType = () => {
  const [pageType, setPageType] = useAtom(pageTypeAtom);
  return { pageType, setPageType };
};
