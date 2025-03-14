import React, { useState } from "react";
import ProductListItem from "./ProductListItem";

const ProductList = () => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedVariant, setDraggedVariant] = useState(null);
  const [draggedProductIndex, setDraggedProductIndex] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([
    {
      id: Date.now(),
      title: "Select Product",
      variants: [],
      image: {
        id: Date.now() + 2,
        product_id: Date.now(),
        src: "",
      },
    },
  ]);

  const addEmptyProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      {
        id: Date.now(),
        title: "Select Product",
        variants: [],
        image: {
          id: Date.now() + 2,
          product_id: Date.now(),
          src: "",
        },
      },
    ]);
  };

  const handleSubmit = (newProducts, currentProductIndex) => {
    let updatedProducts = [
      ...selectedProducts.map((p) => JSON.parse(JSON.stringify(p))),
    ];

    const productsToKeep = updatedProducts.filter(
      (product, idx) =>
        product.variants.length > 0 || idx === currentProductIndex
    );

    const existingProductMap = {};
    productsToKeep.forEach((product, index) => {
      existingProductMap[product.id] = index;
    });

    const productsToAdd = [];

    newProducts.forEach((newProduct) => {
      if (existingProductMap[newProduct.id] !== undefined) {
        const existingIndex = existingProductMap[newProduct.id];
        if (currentProductIndex !== existingIndex) {
          productsToKeep[existingIndex] = newProduct;
        } else {
          delete existingProductMap[newProduct.id];
        }
      } else {
        productsToAdd.push(newProduct);
      }
    });
    if (productsToAdd.length > 0) {
      if (currentProductIndex < productsToKeep.length) {
        productsToKeep[currentProductIndex] = productsToAdd[0];
        for (let i = 1; i < productsToAdd.length; i++) {
          productsToKeep.push(productsToAdd[i]);
        }
      } else {
        productsToKeep.push(...productsToAdd);
      }
    } else if (
      productsToKeep[currentProductIndex] &&
      productsToKeep[currentProductIndex].variants.length === 0
    ) {
      productsToKeep.splice(currentProductIndex, 1);
    }
    setSelectedProducts(productsToKeep);
  };

  const removeProduct = (productIndex) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(productIndex, 1);
    setSelectedProducts(updatedProducts);
  };

  const removeVariant = (productIndex, variantIndex) => {
    setSelectedProducts(
      selectedProducts.map((el, index) => {
        if (index === productIndex) {
          const updatedVariants = el.variants.filter(
            (v, i) => i !== variantIndex
          );
          return { ...el, variants: updatedVariants };
        }
        return el;
      })
    );
  };
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== index) {
      const updatedProducts = [...selectedProducts];
      const draggedProduct = updatedProducts[draggedItem];
      updatedProducts.splice(draggedItem, 1);
      updatedProducts.splice(index, 0, draggedProduct);

      setSelectedProducts(updatedProducts);
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
      const updatedProducts = [...selectedProducts];
      const draggedVariantItem =
        updatedProducts[productIndex].variants[draggedVariant];
      updatedProducts[productIndex].variants.splice(draggedVariant, 1);
      updatedProducts[productIndex].variants.splice(
        variantIndex,
        0,
        draggedVariantItem
      );

      setSelectedProducts(updatedProducts);
      setDraggedVariant(variantIndex);
    }
  };

  const handleVariantDragEnd = () => {
    setDraggedVariant(null);
    setDraggedProductIndex(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-4 text-left">Product</h2>
        <h2 className="text-xl font-semibold mb-4 text-right">Discount</h2>
      </div>

      <ul className="space-y-4">
        {selectedProducts.map((product, index) => (
          <ProductListItem
            key={`${product.id}-${index}`}
            product={product}
            index={index}
            onRemoveProduct={removeProduct}
            onRemoveVariant={removeVariant}
            handleSubmit={handleSubmit}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onVariantDragStart={handleVariantDragStart}
            onVariantDragOver={handleVariantDragOver}
            onVariantDragEnd={handleVariantDragEnd}
            showRemoveButton={selectedProducts.length > 1}
          />
        ))}
      </ul>

      <div className="flex mt-6 justify-end">
        <button
          className="text-green-700 px-10 py-2 rounded border-2 font-semibold"
          onClick={addEmptyProduct}
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default ProductList;
