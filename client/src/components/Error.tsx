import React from "react";

type TErrorProps = {
  title?: string;
  text: string;
  desc?: string;
  path?: string;
  icon?: React.ReactNode | string;
  btnText?: string;
  btnAction?: () => void;
  secondaryBtnText?: string;
  secondaryBtnAction?: () => void;
};

const ErrorCmp = ({
  title,
  text,
  desc,
  path,
  icon = "🔍",
  btnText = "Go Back",
  btnAction,
  secondaryBtnText,
  secondaryBtnAction,
}: TErrorProps) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="bg-white/95 backdrop-blur-md border border-slate-100 rounded-3xl p-8 md:p-12 shadow-xl max-w-lg w-full text-center flex flex-col items-center gap-6 transition-all">
        {/* Icon / Badge */}
        {icon && (
          <div className="w-16 h-16 bg-blue-50 text-blue-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner select-none">
            {icon}
          </div>
        )}

        {/* Text Details */}
        <div className="flex flex-col gap-2.5">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
          )}
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {text}
            {path && (
              <span className="inline-block font-mono text-xs font-semibold px-2 py-0.5 ml-1 bg-gray-100 text-gray-800 rounded-md border border-gray-200">
                {path}
              </span>
            )}
          </p>
          {desc && (
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed mt-1">
              {desc}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {(btnText || secondaryBtnText) && (
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center mt-2">
            {btnText && btnAction && (
              <button
                type="button"
                onClick={btnAction}
                className="w-full sm:w-auto bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer text-sm"
              >
                {btnText}
              </button>
            )}
            {secondaryBtnText && secondaryBtnAction && (
              <button
                type="button"
                onClick={secondaryBtnAction}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-2xl transition-all cursor-pointer text-sm"
              >
                {secondaryBtnText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorCmp;
