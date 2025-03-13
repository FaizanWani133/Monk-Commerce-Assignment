import React from "react";
import CrossIcon from "../../assets/cross.svg";
const CrossButton = ({ onClick }) => {
  return (
    <div className="" style={{ cursor: "pointer" }} onClick={onClick}>
      <img src={CrossIcon} alt="cross icon" className="w-5 h-5" />
    </div>
  );
};

export default CrossButton;
