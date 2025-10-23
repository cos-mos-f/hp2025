import styles from "../styles/loading.module.css";

const Loading: React.FC = () => {
  const base = import.meta.env.BASE_URL;
  return (
    <div className={styles.loadingWrapper}>
      <img
        src={`${base}images/star.svg`}
        alt="Loading"
        className={styles.spinner}
      />
    </div>
  );
};

export default Loading;
