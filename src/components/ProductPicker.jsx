import React, { useEffect, useRef, useState, useCallback } from "react";
import VariantList from "./VariantList";
import CrossButton from "./AtomicComponents/CrossButton";
import SearchIcon from "./../assets/search.svg";
import CustomCheckbox from "./AtomicComponents/CustomCheckbox";
import { fetchProducts } from "../api";

const ProductPicker = ({ onClose, selectedProducts: sp, onApply }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [searchtext, setSearchtext] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, sethasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([
    ...sp.filter((el) => el.variants.length > 0),
  ]);
  const listContainerRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const currentPageRef = useRef(1);

  const handleScroll = () => {
    if (listContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        listContainerRef.current;

      if (
        scrollTop + clientHeight >= scrollHeight - 10 &&
        hasMore &&
        !loading
      ) {
        handleLoadMore();
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
  }, [hasMore, loading]);

  function getCheckboxState(id) {
    const product = selectedProducts.find((el) => el.id === id);
    const originalProduct = allProducts.find((el) => el.id === id);
    if (
      product &&
      product.variants &&
      originalProduct &&
      product.variants.length < originalProduct.variants.length
    ) {
      return "intermediate";
    } else if (
      product &&
      product.variants &&
      originalProduct &&
      product.variants.length === originalProduct.variants.length
    ) {
      return "checked";
    } else if (!product) {
      return "unchecked";
    }
  }

  function handleProductSelection(product) {
    if (selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else {
      const productWithVariants = JSON.parse(
        JSON.stringify({
          ...product,
        })
      );
      setSelectedProducts([...selectedProducts, productWithVariants]);
    }
  }

  function handleVaraintSelection(product, variant) {
    const selectedproduct = selectedProducts.find((p) => p.id === product.id);
    if (selectedproduct) {
      if (selectedproduct.variants.find((v) => v.id === variant.id)) {
        const newVaraints = selectedproduct.variants.filter(
          (el) => el.id !== variant.id
        );
        if (newVaraints.length === 0) {
          setSelectedProducts(
            selectedProducts.filter((el) => el.id !== product.id)
          );
        } else {
          setSelectedProducts(
            selectedProducts.map((el) =>
              el.id === product.id
                ? { ...el, variants: newVaraints }
                : { ...el }
            )
          );
        }
      } else {
        const newProduct = {
          ...selectedproduct,
          variants: [...selectedproduct.variants, variant],
        };
        setSelectedProducts(
          selectedProducts.map((el) =>
            el.id === product.id ? { ...newProduct } : { ...el }
          )
        );
      }
    } else {
      const newProduct = { ...product, variants: [variant] };
      handleProductSelection(newProduct);
    }
  }

  const fetchProductsWithState = useCallback((page, search, reset = false) => {
    setLoading(true);

    return fetchProducts({ search, page, limit: 10 })
      .then((response) => {
        if (response.length > 0) {
          if (reset) {
            setAllProducts(response);
          } else {
            setAllProducts((prevProducts) => [...prevProducts, ...response]);
          }

          if (response.length === 0) {
            sethasMore(false);
          } else if (reset) {
            sethasMore(true);
          }

          return response;
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        sethasMore(false);
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const debouncedSearch = useCallback(
    (searchValue) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        currentPageRef.current = 1;
        setPageNumber(1);

        fetchProductsWithState(1, searchValue, true);
      }, 500); 
    },
    [fetchProductsWithState]
  );

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchtext(value);
    debouncedSearch(value);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = pageNumber + 1;
      currentPageRef.current = nextPage;
      setPageNumber(nextPage);

      fetchProductsWithState(nextPage, searchtext);
    }
  };

  useEffect(() => {
    fetchProductsWithState(1, "", true);
  }, [fetchProductsWithState]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
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
              onChange={handleInputChange}
              value={searchtext}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto" ref={listContainerRef}>
          {allProducts.length === 0 && !loading ? (
            <p className="text-gray-500 text-center py-8">
              No products match your search
            </p>
          ) : loading && pageNumber === 1 ? (
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
              {allProducts.map((product) => (
                <div key={product.id}>
                  <div className="flex-1 items-center justify-between">
                    <div className="flex items-center gap-4 border-b p-4 border-gray-200">
                      <CustomCheckbox
                        state={getCheckboxState(product.id)}
                        onClick={() => handleProductSelection(product)}
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
                        ?.variants || []
                    }
                    onToggleVariantSelection={(variant) =>
                      handleVaraintSelection(product, variant)
                    }
                  />
                </div>
              ))}

              {loading && pageNumber > 1 && (
                <div className="py-4 flex justify-center">
                  <svg
                    className="animate-spin h-6 w-6 text-green-700"
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
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-4">
          {selectedProducts.length > 0 && (
            <h4 className="mr-auto">
              {selectedProducts.length} product
              {selectedProducts.length !== 1 ? "s" : ""} selected
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
            onClick={() => onApply(selectedProducts)}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;
