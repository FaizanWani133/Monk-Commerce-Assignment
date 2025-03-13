import React from "react";
import DiscountSection from "./DiscountSection";
import CrossButton from "./AtomicComponents/CrossButton";
import DragButton from "./AtomicComponents/DragButton";

const ProductListVaraintItem = ({
  productIndex,
  variantIndex,
  variant,
  onVariantDragStart,
  onVariantDragOver,
  onVariantDragEnd,
  product,
  onRemoveVariant,
}) => {
  return (
    <li key={variant.id} className="flex items-center gap-4 py-2">
      <DragButton
        onDragStart={(e) => onVariantDragStart(e, productIndex, variantIndex)}
        onDragOver={(e) => onVariantDragOver(e, productIndex, variantIndex)}
        onDragEnd={onVariantDragEnd}
      />
      <div className="bg-white flex items-center rounded-2xl gap-2 justify-between h-[32px] px-2 flex-1">
        <h4>{variant.title}</h4>
      </div>
      <DiscountSection rounded={true} />
      {product.selectedVariants.length > 1 && (
        <CrossButton
          onClick={() => onRemoveVariant(productIndex, variantIndex)}
        />
      )}
    </li>
  );
};

export default ProductListVaraintItem;
