type TProp = {
  text: string;
  path?: string;
  btnText?: string;
  btnAction: () => void;
};

const ErrorCmp = ({ text, path, btnText = "Go Back", btnAction }: TProp) => {
  return (
    <div className="min-h-[30rem] flex justify-center items-center flex-col gap-5">
      <h1 className="text-lg w-3/5 text-center sm:text-2xl sm:w-full font-semibold">
        <span>{text}</span>
        {path && <span className="text-gray-700">{path}</span>}
      </h1>
      {btnText && btnAction && (
        <button
          onClick={btnAction}
          className="bg-black rounded px-3 py-1 text-white text-sm sm:text-xl"
        >
          {btnText}
        </button>
      )}
    </div>
  );
};

export default ErrorCmp;
