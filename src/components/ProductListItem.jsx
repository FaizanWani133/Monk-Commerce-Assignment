import React, { useState } from "react";
import DiscountSection from "./DiscountSection";
import DragButton from "./AtomicComponents/DragButton";
import EditButton from "./AtomicComponents/EditButton";
import CrossButton from "./AtomicComponents/CrossButton";
import ProductListVaraintItem from "./ProductListVaraintItem";
import ChevronIcon from "../assets/blue-chevron.svg";

const ProductListItem = ({
  product,
  index,
  onRemoveProduct,
  onEditProduct,
  onRemoveVariant,
  onDragStart,
  onDragOver,
  onDragEnd,
  onVariantDragStart,
  onVariantDragOver,
  onVariantDragEnd,
  showRemoveButton,
}) => {
  const [showVariants, setShowVariants] = useState(false);

  const toggleVariants = () => {
    setShowVariants(!showVariants);
  };

  return (
    <li className="pb-4 border-b">
      <div className="flex items-center gap-4">
        <DragButton
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={(e) => onDragOver(e, index)}
          onDragEnd={onDragEnd}
        />
        <h3 className="font-medium">{index + 1}</h3>
        <div className="bg-white flex items-center gap-2 justify-between h-[32px] flex-1  px-2">
          <h3 className="font-medium">{product.title}</h3>
          <EditButton onClick={() => onEditProduct(index)} />
        </div>

        <DiscountSection />

        {showRemoveButton && (
          <CrossButton onClick={() => onRemoveProduct(index)} />
        )}
      </div>

      {product.variants.length > 1 && (
        <div className="flex justify-end py-2 items-center">
          <a
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm underline p-1"
            onClick={toggleVariants}
            style={{ cursor: "pointer" }}
          >
            {showVariants ? <>Hide Variants</> : <>Show Variants</>}
          </a>
          <img src={ChevronIcon} alt="chevron icon" className="w-3 h-3 mt-1" />
        </div>
      )}

      {((showVariants && product.variants.length > 1) || (product.variants.length === 1)) && (
        <div className="mt-4 pl-10">
          <ul className="space-y-2">
            {product.variants.map((variant, variantIndex) => {
              if (product.selectedVariants.includes(variant.id)) {
                return (
                  <ProductListVaraintItem
                    key={variant.id}
                    onRemoveVariant={onRemoveVariant}
                    onVariantDragEnd={onVariantDragEnd}
                    onVariantDragOver={onVariantDragOver}
                    onVariantDragStart={onVariantDragStart}
                    product={product}
                    productIndex={index}
                    variant={variant}
                    variantIndex={variantIndex}
                  />
                );
              }
            })}
          </ul>
        </div>
      )}
    </li>
  );
};

export default ProductListItem;
