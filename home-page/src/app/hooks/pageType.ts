import { atom, useAtom } from "jotai";
import { useEffect } from "react";

export type PageType = "Main" | "Works" | "Contact";

const getBasePath = () => {
  const base = import.meta.env.BASE_URL || "/";
  if (!base.startsWith("/")) return `/${base.endsWith("/") ? base : `${base}/`}`;
  return base.endsWith("/") ? base : `${base}/`;
};

const getRelativePath = () => {
  if (typeof window === "undefined") return "";
  const base = getBasePath();
  const { pathname } = window.location;
  if (pathname.startsWith(base)) {
    const rest = pathname.slice(base.length);
    return rest.replace(/^\/+/, "");
  }
  return pathname.replace(/^\/+/, "");
};

const pathToPageType = (path: string): PageType => {
  const segment = path.split("/")[0]?.toLowerCase();
  if (!segment || segment === "main") return "Main";
  if (segment === "works") return "Works";
  if (segment === "contact") return "Contact";
  return "Main";
};

const getInitialPageType = (): PageType => {
  if (typeof window === "undefined") return "Main";
  return pathToPageType(getRelativePath());
};

const pageTypeAtom = atom<PageType>(getInitialPageType());

const pageTypeToPath = (pageType: PageType) => {
  if (pageType === "Works") return "works";
  if (pageType === "Contact") return "contact";
  return "main";
};

const buildPathname = (pageType: PageType) => {
  const base = getBasePath();
  const segment = pageTypeToPath(pageType);
  return segment ? `${base}${segment}` : base;
};

export const usePageType = () => {
  const [pageType, setPageType] = useAtom(pageTypeAtom);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncFromLocation = () => {
      const nextPageType = pathToPageType(getRelativePath());
      setPageType(nextPageType);
    };
    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, [setPageType]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const current = pathToPageType(getRelativePath());
    if (current === pageType) return;
    const url = new URL(window.location.href);
    url.pathname = buildPathname(pageType);
    window.history.pushState({}, "", url);
  }, [pageType]);

  return { pageType, setPageType };
};
