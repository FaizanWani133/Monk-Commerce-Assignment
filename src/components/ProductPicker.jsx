import React, { useEffect, useRef } from "react";
import VariantList from "./VariantList";
import CrossButton from "./AtomicComponents/CrossButton";
import SearchIcon from "./../assets/search.svg";
import CustomCheckbox from "./AtomicComponents/CustomCheckbox";

const ProductPicker = ({
  onClose,
  products,
  selectedProducts,
  onToggleProductSelection,
  onToggleVariantSelection,
  onApply,
  onInputChange,
  onLoadMore,
  hasMore,
  isLoading,
}) => {
  const listContainerRef = useRef(null);

  const handleScroll = () => {
    if (listContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        listContainerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
        onLoadMore();
      }
    }
  };

  useEffect(() => {
    const listContainer = listContainerRef.current;
    if (listContainer) {
      listContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (listContainer) {
        listContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore]);

  function getCheckboxState(id) {
    const product = selectedProducts.find((el) => el.id === id);
    if (
      product &&
      product.selectedVariants &&
      product.selectedVariants.length < product.variants.length
    ) {
      return "intermediate";
    } else if (
      product &&
      product.selectedVariants &&
      product.selectedVariants.length === product.variants.length
    ) {
      return "checked";
    } else if (!product) {
      return "unchecked";
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white rounded-md w-3/4 max-w-2xl h-3/4 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Select Products</h2>
          <CrossButton onClick={onClose} />
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <img
              src={SearchIcon}
              alt="search icon"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search product"
              className="w-full pl-10 pr-4 py-2 border border-gray-200"
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto" ref={listContainerRef}>
          {products.length === 0 && !isLoading ? (
            <p className="text-gray-500 text-center py-8">
              No products match your search
            </p>
          ) : isLoading ? (
            <div className="flex justify-center items-center h-full">
              <svg
                className="animate-spin h-8 w-8 text-green-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id}>
                  <div className="flex-1 items-center justify-between">
                    <div className="flex items-center gap-4 border-b p-4 border-gray-200">
                      <CustomCheckbox
                        state={getCheckboxState(product.id)}
                        onClick={() => onToggleProductSelection(product)}
                      />
                      <img
                        src={product.image.src}
                        className="w-[36px] h-[36px]"
                        alt={product.title}
                      />
                      <h3 className="font-medium">{product.title}</h3>
                    </div>
                  </div>
                  <VariantList
                    product={product}
                    selectedVariants={
                      selectedProducts.find((p) => p.id === product.id)
                        ?.selectedVariants || []
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

        <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-4">
          {selectedProducts.length > 0 && (
            <h4 className="mr-auto">
              {selectedProducts.length} product selected
            </h4>
          )}
          <button
            className="px-6 py-2 border border-gray-200 rounded text-green-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-8 py-2 bg-green-700 text-white rounded hover:bg-green-800 disabled:bg-gray-300"
            disabled={selectedProducts.length === 0}
            onClick={onApply}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;
