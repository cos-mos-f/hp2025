// Google Analytics event tracking utilities

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>,
    ) => void;
  }
}

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>,
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
};

// Page navigation events
export const trackPageView = (pageName: string) => {
  trackEvent("page_view", {
    page_title: pageName,
    page_location: window.location.href,
  });
};

// Section navigation
export const trackSectionChange = (section: string) => {
  trackEvent("section_change", {
    section_name: section,
  });
};

// Works category filter
export const trackWorksFilter = (filterType: string) => {
  trackEvent("works_filter", {
    filter_type: filterType,
  });
};

// Image interactions
export const trackImageView = (imageName: string, index: number) => {
  trackEvent("image_view", {
    image_name: imageName,
    image_index: index,
  });
};

export const trackImageClick = (imageName: string, source: string) => {
  trackEvent("image_click", {
    image_name: imageName,
    click_source: source,
  });
};

// External link clicks
export const trackLinkClick = (platform: string, url: string) => {
  trackEvent("link_click", {
    platform,
    link_url: url,
  });
};

// Scroll interaction
export const trackScroll = (scrollPercentage: number) => {
  trackEvent("scroll_interaction", {
    scroll_percentage: Math.round(scrollPercentage * 100),
  });
};
