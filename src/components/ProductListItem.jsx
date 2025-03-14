import React, { useState } from "react";
import DiscountSection from "./DiscountSection";
import DragButton from "./AtomicComponents/DragButton";
import EditButton from "./AtomicComponents/EditButton";
import CrossButton from "./AtomicComponents/CrossButton";
import ProductListVaraintItem from "./ProductListVaraintItem";
import ChevronIcon from "../assets/blue-chevron.svg";
import ProductPicker from "./ProductPicker";

const ProductListItem = ({
  product: pro,
  index,
  onRemoveProduct,
  onRemoveVariant,
  handleSubmit,
  onDragStart,
  onDragOver,
  onDragEnd,
  onVariantDragStart,
  onVariantDragOver,
  onVariantDragEnd,
  showRemoveButton,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(pro);

  const toggleVariants = () => {
    setShowVariants(!showVariants);
  };

  const closeProductPicker = () => {
    setIsPickerOpen(false);
  };
  
  const openProductPicker = () => {
    setIsPickerOpen(true);
  };
  
  function handleApply(products) {
    if (products.length > 0) {
      handleSubmit(products);
      if (products[0].id !== selectedProduct.id) {
        setSelectedProduct(products[0]);
      }
    }
    closeProductPicker();
  }
  React.useEffect(() => {
    setSelectedProduct(pro);
  }, [pro]);

  return (
    <li className="pb-4 border-b">
      <div className="flex items-center gap-4">
        <DragButton
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={(e) => onDragOver(e, index)}
          onDragEnd={onDragEnd}
        />
        <h3 className="font-medium">{index + 1}</h3>
        <div className="bg-white flex items-center gap-2 justify-between h-[32px] flex-1 px-2">
          <h3 className="font-medium">{selectedProduct.title}</h3>
          <EditButton onClick={openProductPicker} />
        </div>

        <DiscountSection />

        {showRemoveButton && (
          <CrossButton onClick={() => onRemoveProduct(index)} />
        )}
      </div>

      {selectedProduct.variants.length > 1 && (
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

      {((showVariants && selectedProduct.variants.length > 1) ||
        selectedProduct.variants.length === 1) && (
        <div className="mt-4 pl-10">
          <ul className="space-y-2">
            {selectedProduct.variants.map((variant, variantIndex) => {
              return (
                <ProductListVaraintItem
                  key={variant.id}
                  onRemoveVariant={onRemoveVariant}
                  onVariantDragEnd={onVariantDragEnd}
                  onVariantDragOver={onVariantDragOver}
                  onVariantDragStart={onVariantDragStart}
                  product={selectedProduct}
                  productIndex={index}
                  variant={variant}
                  variantIndex={variantIndex}
                />
              );
            })}
          </ul>
        </div>
      )}
      {isPickerOpen && (
        <ProductPicker
          isOpen={isPickerOpen}
          onClose={closeProductPicker}
          selectedProducts={
            selectedProduct.variants.length > 0 ? [selectedProduct] : []
          }
          onApply={handleApply}
        />
      )}
    </li>
  );
};

export default ProductListItem;