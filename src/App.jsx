import React, { useEffect, useState } from "react";
import ProductList from "./components/ProductList";
import ProductPicker from "./components/ProductPicker";
import { fetchProducts } from "./api";
const App = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([
    {
      id: Date.now(),
      title: "Select Product",
      variants: [],
      image: {
        id: Date.now() + 2,
        product_id: Date.now(),
        src: "",
      },
      showVariants: false,
      discount: { type: null, value: 0 },
    },
  ]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedVariant, setDraggedVariant] = useState(null);
  const [draggedProductIndex, setDraggedProductIndex] = useState(null);
  const [searchtext, setSearchtext] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, sethasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const openProductPicker = (index) => {
    setEditingIndex(index);
    setIsPickerOpen(true);
  };

  const closeProductPicker = () => {
    setIsPickerOpen(false);
  };

  const toggleProductSelection = (product) => {
    if (selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else {
      const productWithVariants = JSON.parse(JSON.stringify({
        ...product,
        selectedVariants: product.variants.map((variant) => variant.id),
      }));
      setSelectedProducts([...selectedProducts, productWithVariants]);
    }
  };

  const toggleVariantSelection = (productId, variantId) => {
    setSelectedProducts((prevSelectedProducts) => {
      const isProductSelected = prevSelectedProducts.some((p) => p.id === productId);
  
      if (!isProductSelected) {
        const productToAdd = allProducts.find((p) => p.id === productId);
        if (productToAdd) {
          return [
            ...prevSelectedProducts,
            {
              ...productToAdd,
              selectedVariants: [variantId],
            },
          ];
        }
      }
  
      return prevSelectedProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              selectedVariants: product.selectedVariants.includes(variantId)
                ? product.selectedVariants.filter((id) => id !== variantId) 
                : [...product.selectedVariants, variantId], 
            }
          : product
      );
    });
  };

  const applySelectedProducts = () => {
    if (selectedProducts.length > 0 && editingIndex !== null) {
      const updatedProducts = [...products];
      const selectedProductsCopy = JSON.parse(JSON.stringify(selectedProducts));
      updatedProducts.splice(editingIndex, 1, ...selectedProductsCopy);
      setProducts(updatedProducts);
    }
    closeProductPicker();
  };

  const removeProduct = (index) => {
    if (products.length === 1) {
      return;
    }
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const removeVariant = (productIndex, variantIndex) => {
    const updatedProducts = JSON.parse(JSON.stringify(products)); 
  
    const newProduct = updatedProducts[productIndex];
    const varaintId = newProduct.variants[variantIndex].id
    newProduct.variants.splice(variantIndex, 1);
  
    if (newProduct.variants.length === 0) {
      updatedProducts.splice(productIndex, 1);
    }
  
    setProducts(updatedProducts);
    toggleVariantSelection(newProduct.id,varaintId)
  };
  const addEmptyProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now(),
        title: "Select Product",
        variants: [],
        image: {
          id: Date.now() + 2,
          product_id: Date.now(),
          src: "",
        },
        showVariants: false,
        discount: { type: null, value: 0 },
      },
    ]);
  };

  const updateProductDiscount = (index, type, value) => {
    const updatedProducts = [...products];
    updatedProducts[index].discount = { type, value: parseFloat(value) || 0 };
    setProducts(updatedProducts);
  };

  const updateVariantDiscount = (productIndex, variantIndex, type, value) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].variants[variantIndex].discount = {
      type,
      value: parseFloat(value) || 0,
    };
    setProducts(updatedProducts);
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== index) {
      const updatedProducts = [...products];
      const draggedProduct = updatedProducts[draggedItem];
      updatedProducts.splice(draggedItem, 1);
      updatedProducts.splice(index, 0, draggedProduct);

      setProducts(updatedProducts);
      setDraggedItem(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleVariantDragStart = (e, productIndex, variantIndex) => {
    setDraggedVariant(variantIndex);
    setDraggedProductIndex(productIndex);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleVariantDragOver = (e, productIndex, variantIndex) => {
    e.preventDefault();
    if (
      draggedVariant !== null &&
      draggedProductIndex === productIndex &&
      draggedVariant !== variantIndex
    ) {
      const updatedProducts = [...products];
      const draggedVariantItem =
        updatedProducts[productIndex].variants[draggedVariant];
      updatedProducts[productIndex].variants.splice(draggedVariant, 1);
      updatedProducts[productIndex].variants.splice(
        variantIndex,
        0,
        draggedVariantItem
      );

      setProducts(updatedProducts);
      setDraggedVariant(variantIndex);
    }
  };

  const handleVariantDragEnd = () => {
    setDraggedVariant(null);
    setDraggedProductIndex(null);
  };

  const handleInputChange = (event) => {
    setSearchtext(event.target.value);
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setLoading(true);
      fetchProducts({
        page: pageNumber,
        limit: 10,
        search: searchtext,
      })
        .then((response) => {
          if (response.length > 0) {
            setAllProducts((prevProducts) => [...prevProducts, ...response]);
            setPageNumber((prevPage) => prevPage + 1);
          } else {
            sethasMore(false);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProducts({ search: searchtext, page: pageNumber, limit: 10 })
      .then((response) => {
        if (response.length === 0) {
          sethasMore(false);
          setLoading(false);
        }
        setAllProducts(response);
      })
      .catch(() => {
        sethasMore(false);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchtext]);
  return (
    <div className="p-10 max-w-3/6 min-w-[422px]">
      <h2 className="text-xl font-semibold mb-4 text-left">Add products</h2>
      <ProductList
        products={products}
        onAddProduct={addEmptyProduct}
        onRemoveProduct={removeProduct}
        onRemoveVariant={removeVariant}
        onEditProduct={openProductPicker}
        onUpdateProductDiscount={updateProductDiscount}
        onUpdateVariantDiscount={updateVariantDiscount}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onVariantDragStart={handleVariantDragStart}
        onVariantDragOver={handleVariantDragOver}
        onVariantDragEnd={handleVariantDragEnd}
      />

      {isPickerOpen && (
        <ProductPicker
          isOpen={isPickerOpen}
          onClose={closeProductPicker}
          products={allProducts}
          selectedProducts={selectedProducts}
          onToggleProductSelection={toggleProductSelection}
          onToggleVariantSelection={toggleVariantSelection}
          onApply={applySelectedProducts}
          onInputChange={handleInputChange}
          hasMore={true}
          onLoadMore={handleLoadMore}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default App;
