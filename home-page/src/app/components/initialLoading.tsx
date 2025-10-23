import styles from "../styles/initLoading.module.css";

const InitialLoading: React.FC = () => {
  const base = import.meta.env.BASE_URL;
  console.log("Base URL for images:", base);

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

export default InitialLoading;
