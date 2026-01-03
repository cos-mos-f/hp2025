import type { ImageItem } from "../hooks/images";
import {
  useWorks,
  type WorksLayoutGroup,
  type WorksLayoutNode,
} from "../hooks/works";
import Loading from "./Loading";
import { trackImageClick } from "../utils/analytics";

type WorksProps = {
  imageList: ImageItem[];
  onClickImage: (filename: string) => void;
};

const Works = ({ imageList, onClickImage }: WorksProps) => {
  const { worksRef, content, isLoading } = useWorks(imageList);

  const base = import.meta.env.BASE_URL;

  const renderNode = (node: WorksLayoutNode, key: string) => {
    if (node.type === "image") {
      return (
        <img
          key={key}
          src={`${base}images/artWorks/${node.image.filename}`}
          alt={node.image.title}
          className="border border-black"
          style={{ width: `${node.width}px`, height: `${node.height}px` }}
          loading="lazy"
          onClick={() => {
            trackImageClick(node.image.filename, "works_grid");
            onClickImage(node.image.filename);
          }}
        />
      );
    }

    const isRow = node.direction === "row";
    return (
      <div
        key={key}
        className={`flex shrink-0 gap-5 ${isRow ? "flex-row" : "flex-col"}`}
      >
        {node.items.map((child, index) => renderNode(child, `${key}-${index}`))}
      </div>
    );
  };

  const renderGroup = (group: WorksLayoutGroup, groupIndex: number) => {
    return (
      <div key={`group-${groupIndex}`} className="flex shrink-0 px-2.5">
        {renderNode(group, `group-${groupIndex}`)}
      </div>
    );
  };

  return (
    <div
      ref={worksRef}
      className="flex h-screen w-fit flex-row py-10 max-md:h-[100vw] "
    >
      <div className="h-full w-[40vw] shrink-0 max-md:w-[40vh] gap-3 " />
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        content.map(renderGroup)
      )}
    </div>
  );
};

export default Works;
