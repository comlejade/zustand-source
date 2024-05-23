import React from "react";
import ReactDOM from "react-dom/client";
import createStore from "./zustand";

const store = createStore((set) => {
  return {
    count: 1,
    resetCount: () => set(1),
  };
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div>
      <div>count: {store.count}</div>
    </div>
  </React.StrictMode>
);
