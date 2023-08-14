import React from "react";

const AppWrapper = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
};

export default AppWrapper;