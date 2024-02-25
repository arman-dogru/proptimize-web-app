import React from "react";

const Loader = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "50vh",
      }}
    >
      <div
        class="spinner-border text-secondary align-center "
        style={{ width: "5rem", height: "5rem" }}
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
