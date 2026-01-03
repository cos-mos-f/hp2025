import { trackLinkClick } from "../utils/analytics";

interface LinkBoxProps {
  platform: string;
  userId: string;
  url: string;
}

const LinkBox = ({ platform, userId, url }: LinkBoxProps) => {
  const base = import.meta.env.BASE_URL;

  return (
    <a
      href={url}
      className="pointer-events-auto group relative flex h-10 items-end pr-12 no-underline"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackLinkClick(platform, url)}
    >
      <span className="w-[150px]">{platform}</span>
      <span className="select-text">{userId}</span>
      <span className="pointer-events-none absolute bottom-0 left-0 h-px w-[calc(100%-50px)] bg-current" />
      <img
        src={`${base}images/arrow.svg`}
        alt="arrow"
        className="absolute -bottom-2 right-0 h-[50px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
    </a>
  );
};

export default LinkBox;
