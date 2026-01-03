import * as Tabs from "@radix-ui/react-tabs";
import type { WorksType } from "../hooks/images";
import type { PageType } from "../hooks/pageType";
import LinkBox from "./LinkBox";
import { trackWorksFilter } from "../utils/analytics";

type SubSectionProps = {
  pageType: PageType;
  worksType: WorksType;
  setWorksType: (worksType: WorksType) => void;
};

const SubSection = ({ pageType, worksType, setWorksType }: SubSectionProps) => {
  if (pageType === "Main") {
    return <div />;
  }

  if (pageType === "Works") {
    return (
      <Tabs.Root
        value={worksType}
        onValueChange={(value) => {
          const newWorksType = value as WorksType;
          setWorksType(newWorksType);
          trackWorksFilter(newWorksType);
        }}
        className="flex h-full flex-col items-start justify-end select-text"
      >
        <Tabs.List className="flex flex-col items-start gap-2">
          <Tabs.Trigger
            value="All"
            className="pointer-events-auto relative inline-block transition-opacity after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-100 hover:opacity-80 hover:after:scale-x-100 data-[state=active]:opacity-100 data-[state=active]:after:scale-x-100"
          >
            all
          </Tabs.Trigger>
          <Tabs.Trigger
            value="FanArt"
            className="pointer-events-auto relative inline-block transition-opacity after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-100 hover:opacity-80 hover:after:scale-x-100 data-[state=active]:opacity-100 data-[state=active]:after:scale-x-100"
          >
            fan art
          </Tabs.Trigger>
          <Tabs.Trigger
            value="Original"
            className="pointer-events-auto relative inline-block transition-opacity after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-100 hover:opacity-80 hover:after:scale-x-100 data-[state=active]:opacity-100 data-[state=active]:after:scale-x-100"
          >
            original
          </Tabs.Trigger>
          <Tabs.Trigger
            value="Work"
            className="pointer-events-auto relative inline-block transition-opacity after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-100 hover:opacity-80 hover:after:scale-x-100 data-[state=active]:opacity-100 data-[state=active]:after:scale-x-100"
          >
            work
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    );
  }

  const mailText = "cos.mos.f.works@gmail.com";
  const mailLink = "mailto:cos.mos.f.works@gmail.com/";

  return (
    <div className="flex h-full flex-col items-start justify-end select-text">
      <LinkBox platform="X" userId="@cos_mos_f" url="https://x.com/cos_mos_f" />
      <LinkBox
        platform="Pixiv"
        userId="こすもす"
        url="https://www.pixiv.net/users/56797770"
      />
      <LinkBox platform="Email" userId={mailText} url={mailLink} />
      <LinkBox
        platform="Forms"
        userId="Google Forms"
        url="https://forms.gle/AhuyBKWvzG2EngJM8"
      />
    </div>
  );
};

export default SubSection;
