import React, { useState } from "react";
import ProductList from './components/ProductList'
import ProductPicker from "./components/ProductPicker";
const allProducts = [
  {
    id: 77,
    title: "Fog Linen Chambray Towel - Beige Stripe",
    variants: [
      {
        id: 1,
        product_id: 77,
        title: "XS / Silver",
        price: "49",
      },
      {
        id: 2,
        product_id: 77,
        title: "S / Silver",
        price: "49",
      },
      {
        id: 3,
        product_id: 77,
        title: "M / Silver",
        price: "49",
      },
    ],
    image: {
      id: 266,
      product_id: 77,
      src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1",
    },
  },
  {
    id: 80,
    title: "Orbit Terrarium - Large",
    variants: [
      {
        id: 64,
        product_id: 80,
        title: "Default Title",
        price: "109",
      },
    ],
    image: {
      id: 272,
      product_id: 80,
      src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1",
    },
  },
];

const App = () => {
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
      const productWithVariants = {
        ...product,
        selectedVariants: product.variants.map((variant) => variant.id),
      };
      setSelectedProducts([...selectedProducts, productWithVariants]);
    }
  };

  const toggleVariantSelection = (productId, variantId) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              selectedVariants: product.selectedVariants.includes(variantId)
                ? product.selectedVariants.filter((id) => id !== variantId)
                : [...product.selectedVariants, variantId],
            }
          : product
      )
    );
  };

  const applySelectedProducts = () => {
    if (selectedProducts.length > 0 && editingIndex !== null) {
      const updatedProducts = [...products];
      updatedProducts.splice(editingIndex, 1, ...selectedProducts);
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
    const updatedProducts = [...products];

    const product = updatedProducts[productIndex];

    product.variants.splice(variantIndex, 1);

    if (product.variants.length === 0) {
      updatedProducts.splice(productIndex, 1);
    }

    setSelectedProducts(updatedProducts);
  };

  const addEmptyProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now(), // Temporary ID
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
  return (
    <div className="p-6 max-w-2/3 min-w-[422px] bg-gray-50">
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

      {/* {isPickerOpen && (
        <ProductPicker
          isOpen={isPickerOpen}
          onClose={closeProductPicker}
          products={allProducts}
          selectedProducts={selectedProducts}
          onToggleProductSelection={toggleProductSelection}
          onToggleVariantSelection={toggleVariantSelection}
          onApply={applySelectedProducts}
        />
      )} */}
    </div>
  );
};

export default App;
