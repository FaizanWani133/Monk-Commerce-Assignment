import React from "react";
import VariantList from "./VariantList";
import CrossButton from "./AtomicComponents/CrossButton";

const ProductPicker = ({
  onClose,
  products,
  selectedProducts,
  onToggleProductSelection,
  onToggleVariantSelection,
  onApply,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <div className="bg-white rounded-lg w-3/4 max-w-4xl h-3/4 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Select Products</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <CrossButton/>
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4" >
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
             "No products match your search"
            </p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`p-3 border rounded ${
                    selectedProducts.some((p) => p.id === product.id)
                      ? "border-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.some((p) => p.id === product.id)}
                        onChange={() => onToggleProductSelection(product)}
                      />
                      <h3 className="font-medium">{product.title}</h3>
                    </div>
                    <div className="text-sm text-gray-600">
                      {product.variants.length} variants
                    </div>
                  </div>
                  <VariantList
                    product={product}
                    selectedVariants={
                      selectedProducts.find((p) => p.id === product.id)?.selectedVariants || []
                    }
                    onToggleVariantSelection={(variantId) =>
                      onToggleVariantSelection(product.id, variantId)
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end gap-4">
          <button
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            disabled={selectedProducts.length === 0}
            onClick={onApply}
          >
            Add ({selectedProducts.length} selected)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;