import React from "react";
import ProductListItem from "./ProductListItem";

const ProductList = ({
  products,
  onAddProduct,
  onRemoveProduct,
  onRemoveVariant,
  onEditProduct,
  onUpdateProductDiscount,
  onUpdateVariantDiscount,
  onDragStart,
  onDragOver,
  onDragEnd,
  onVariantDragStart,
  onVariantDragOver,
  onVariantDragEnd,
}) => {
  return (
    <div className="rounded-lg p-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-4 text-left">Product</h2>
        <h2 className="text-xl font-semibold mb-4 text-right">Discount</h2>
      </div>

      <ul className="space-y-4">
        {products.map((product, index) => (
          <ProductListItem
            key={`${product.id}-${index}`}
            product={product}
            index={index}
            onRemoveProduct={onRemoveProduct}
            onRemoveVariant={onRemoveVariant}
            onEditProduct={onEditProduct}
            onUpdateProductDiscount={onUpdateProductDiscount}
            onUpdateVariantDiscount={onUpdateVariantDiscount}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onVariantDragStart={onVariantDragStart}
            onVariantDragOver={onVariantDragOver}
            onVariantDragEnd={onVariantDragEnd}
            showRemoveButton={products.length > 1}
          />
        ))}
      </ul>

      <div className="flex mt-6 justify-end">
        <button
          className="text-green px-10 py-2 rounded border-2 font-semibold"
          onClick={onAddProduct}
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default ProductList;
