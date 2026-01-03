type LineProps = {
  isActive: boolean;
};

const Line = ({ isActive }: LineProps) => {
  return (
    <div className="relative mx-2 h-px w-full">
      <span
        className={`absolute bottom-0 left-0 h-px w-full origin-left bg-black transition-transform duration-300 ${
          isActive ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </div>
  );
};

export default Line;
