import type { ImageItemWithIndex } from "../hooks/images";
import {
  useGallery,
  type GalleryLayoutGroup,
  type GalleryLayoutNode,
} from "../hooks/gallery";
import Loading from "./Loading";

type GalleryProps = {
  imageList: ImageItemWithIndex[];
  onClickImage: (filename: string) => void;
};

const Gallery = ({ imageList, onClickImage }: GalleryProps) => {
  const { galleryRef, content, isLoading } = useGallery(imageList);

  const base = import.meta.env.BASE_URL;

  const renderNode = (node: GalleryLayoutNode, key: string) => {
    if (node.type === "image") {
      return (
        <img
          key={key}
          src={`${base}images/artWorks/${node.image.filename}`}
          alt={node.image.title}
          className="border border-black dark:border-white"
          style={{ width: `${node.width}px`, height: `${node.height}px` }}
          loading="lazy"
          onClick={() => onClickImage(node.image.filename)}
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

  const renderGroup = (group: GalleryLayoutGroup, groupIndex: number) => {
    return (
      <div key={`group-${groupIndex}`} className="flex shrink-0 px-2.5">
        {renderNode(group, `group-${groupIndex}`)}
      </div>
    );
  };

  return (
    <div
      ref={galleryRef}
      className="flex h-screen w-fit flex-row py-10 max-md:h-[100vw] "
    >
      <div className="h-full w-[40vw] shrink-0 max-md:w-[40vh] " />
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

export default Gallery;
