import React from "react";
import DragIcon from "../../assets/drag.svg";
const DragButton = ({onDragStart, onDragOver, onDragEnd}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e)}
      onDragOver={(e) => onDragOver(e)}
      onDragEnd={onDragEnd}
      className=""
      style={{ cursor: "pointer" }}
    >
      <img src={DragIcon} alt="drag icon" className="w-6 h-6" />
    </div>
  );
};

export default DragButton;
