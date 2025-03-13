import React from "react";

const CustomCheckbox = ({ state, onClick }) => {
  return (
    <div
      className="w-[24px] h-[24px] border-2 border-gray-900 rounded-sm cursor-pointer flex items-center justify-center"
      style={{
        backgroundColor:
          state === "checked" || state === "intermediate" ? "#008060" : "white",
        borderColor:
          state === "checked" || state === "intermediate" ? "#008060" : "#ccc",
      }}
      onClick={onClick}
    >
      {state === "checked" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}

      {state === "intermediate" && (
        <div className="w-3 h-1 bg-white rounded-xs"></div>
      )}
      {state === "unchecked" && <div className="w-3 h-3"></div>}
    </div>
  );
};

export default CustomCheckbox;
