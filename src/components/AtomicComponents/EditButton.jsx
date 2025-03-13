import React from "react";
import EditIcon from "../../assets/edit.svg";
const EditButton = ({ onClick }) => {
  return (
    <div className="" style={{ cursor: "pointer" }} onClick={onClick}>
      <img src={EditIcon} alt="edit icon" className="w-6 h-6" />
    </div>
  );
};

export default EditButton;
