import React from "react";
import CustomCheckbox from "./AtomicComponents/CustomCheckbox";

const VariantList = ({
  product,
  selectedVariants,
  onToggleVariantSelection,
}) => {
  return (
    <div className="mt-2">
      {product.variants.map((variant) => (
        <div
          key={variant.id}
          className="text-sm text-gray-600 border-b border-gray-200"
        >
          <div className="flex items-center gap-4 p-4 pl-10 pr-6 w-<100>">
            <CustomCheckbox
              state={
                selectedVariants.find((el)=>el.id===variant.id) ? "checked" : "unchecked"
              }
              onClick={() => onToggleVariantSelection(variant)}
            />
            <h3 className="font-medium">{variant.title}</h3>
            <h3 className="font-medium ml-auto">${variant.price}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VariantList;
