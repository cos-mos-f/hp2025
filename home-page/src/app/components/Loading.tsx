const Loading: React.FC = () => {
  const base = import.meta.env.BASE_URL;
  return (
    <div className="fixed left-0 top-0 z-1000 flex h-screen w-screen items-center justify-center bg-white dark:bg-black max-md:left-auto max-md:top-auto max-md:-right-[50vh] max-md:-bottom-[50vw] max-md:h-[100vw] max-md:w-[100vh]">
      <img
        src={`${base}images/star.svg`}
        alt="Loading"
        className="h-20 w-20 animate-star-spin dark:invert dark:brightness-200"
      />
    </div>
  );
};

export default Loading;
