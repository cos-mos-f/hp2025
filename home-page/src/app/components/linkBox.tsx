import styles from "../styles/LinkBox.module.css";

interface LinkBoxProps {
  PlatForm: string;
  userId: string;
  url: string;
}

const LinkBox: React.FC<LinkBoxProps> = ({ PlatForm, userId, url }) => {
  const base = import.meta.env.BASE_URL;

  return (
    <a
      href={url}
      className={styles.linkBox}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.platform}>{PlatForm}</span>
      <span className={styles.userId}>{userId}</span>
      <img
        src={`${base}images/arrow.svg`}
        alt="arrow"
        className={styles.arrow}
      />
    </a>
  );
};

export default LinkBox;
