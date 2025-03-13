import React from "react";

const VariantList = ({ product, selectedVariants, onToggleVariantSelection }) => {
  return (
    <div className="mt-2 pl-8">
      {product.variants.map((variant) => (
        <div key={variant.id} className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedVariants.includes(variant.id)}
              onChange={() => onToggleVariantSelection(variant.id)}
            />
            <span>{variant.title}</span>
          </div>
          <span>${variant.price}</span>
        </div>
      ))}
    </div>
  );
};

export default VariantList;