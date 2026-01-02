import * as Tabs from "@radix-ui/react-tabs";
import Line from "./Line";
import type { PageType } from "../hooks/pageType";

type MainSectionProps = {
  pageType: PageType;
  setPageType: (pageType: PageType) => void;
};

const MainSection = ({ pageType, setPageType }: MainSectionProps) => {
  const isGallery = pageType === "Gallery";
  const isContact = pageType === "Contact";

  return (
    <Tabs.Root
      value={pageType}
      onValueChange={(value) => setPageType(value as PageType)}
      className="flex h-full w-[280px] flex-col items-start justify-end pl-10 max-md:w-[28vh]"
    >
      <Tabs.List className="flex w-full flex-col items-start">
        <Tabs.Trigger
          value="ArtBoard"
          className="pb-8 text-left text-[28pt] font-100 leading-[32pt] tracking-[-2px] transition-opacity hover:opacity-80 data-[state=active]:opacity-100 max-md:text-[20pt]"
        >
          cosmos
          <br />
          gallery
        </Tabs.Trigger>
        <div className="flex w-full items-end">
          <Tabs.Trigger
            value="Gallery"
            className="relative inline-block text-left transition-opacity after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-100 hover:opacity-80 hover:after:scale-x-100 data-[state=active]:opacity-100 data-[state=active]:after:scale-x-100"
          >
            works
          </Tabs.Trigger>
          <Line isActive={isGallery} />
        </div>
        <div className="flex w-full items-end">
          <Tabs.Trigger
            value="Contact"
            className="relative inline-block text-left transition-opacity after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-100 hover:opacity-80 hover:after:scale-x-100 data-[state=active]:opacity-100 data-[state=active]:after:scale-x-100"
          >
            contact
          </Tabs.Trigger>
          <Line isActive={isContact} />
        </div>
      </Tabs.List>
    </Tabs.Root>
  );
};

export default MainSection;
