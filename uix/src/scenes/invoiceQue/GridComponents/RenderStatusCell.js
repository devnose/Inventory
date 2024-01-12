import React from 'react';
import ClipLoader from "react-spinners/ClipLoader";
// import your colors object here

const RenderStatusCell = ({ row, selectedData, statusLoading, colors }) => {
  const isRowSelected = selectedData.includes(row.id);

  if (statusLoading && isRowSelected) {
    return (
      <div style={{ position: "relative", height: "50px", width: "120px" }}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
          <ClipLoader color={"#000"} />
        </div>
      </div>
    );
  }

  return (
    <div>
      {row.Status === 1 ? (
        <div style={{
          borderRadius: "12px",
          backgroundColor: colors.blueAccent[700],
          padding: "5px",
          textAlign: "center",
          width: "120px",
          color: "#fff",
        }}>
          Email Sent
        </div>
      ) : (
        <div style={{
          borderRadius: "12px",
          backgroundColor: colors.grey[800],
          padding: "5px",
          textAlign: "center",
          width: "120px",
        }}>
          In Queue
        </div>
      )}
    </div>
  );
};

export default RenderStatusCell;
