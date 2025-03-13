import React, { useState } from "react";

const DiscountSection = ({ rounded }) => {
  const [isDiscountVisible, setIsDiscountVisible] = useState(false);
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountvalue, setDiscountvalue] = useState("0");

  const toggleDiscountVisibility = () => {
    setIsDiscountVisible(!isDiscountVisible);
  };

  const toggleDiscountType = (type) => {
    setDiscountType(type);
  };

  const handleDiscountvalueChange = (value) => {
    setDiscountvalue(value);
  };

  return (
    <div className="flex items-center gap-2 w-[141px] h-[32px]">
      {!isDiscountVisible ? (
        <button
          onClick={toggleDiscountVisibility}
          style={{ cursor: "pointer" }}
          className={`bg-green-700 text-white px-4  ${
            rounded ? "rounded-2xl" : ""
          } hover:bg-green-800 h-[32px]`}
        >
          Add Discount
        </button>
      ) : (
        <>
          <input
            min="0"
            className={`border-0 ${
              rounded ? "rounded-2xl" : ""
            } p-2 outline-none w-[69px] h-[32px] bg-white`}
            value={discountvalue}
            onChange={(e) => handleDiscountvalueChange(e.target.value)}
          />
          <select
            className={`bg-white border-0 ${
              rounded ? "rounded-2xl" : ""
            }  text-sm outline-none h-[32px]`}
            value={discountType}
            onChange={(e) => toggleDiscountType(e.target.value)}
          >
            <option value="PERCENTAGE">% off</option>
            <option value="FLAT">Flat off</option>
          </select>
        </>
      )}
    </div>
  );
};

export default DiscountSection;
