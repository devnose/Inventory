// CustomFooter.js
import { GridFooterContainer } from '@mui/x-data-grid';
import React from 'react';

export const CustomFooter = ({ inventoryData }) => {
  return (
    <GridFooterContainer
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <div style={{ margin: "0 10px" }}>
        <h3>Total: {inventoryData.length}</h3>
      </div>
      <div style={{ margin: "0 10px" }}>
        <h3>
          Processed:{" "}
          {inventoryData.filter((item) => item.Status === 1).length}
        </h3>
      </div>
    </GridFooterContainer>
  );
};
