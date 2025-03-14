import React from "react";
import ProductList from "./components/ProductList";
const App = () => {
  return (
    <div className="p-10  min-w-[422px  max-w-[800px]">
      <h2 className="text-xl font-semibold mb-4 text-left">Add products</h2>
      <ProductList />
    </div>
  );
};

export default App;
