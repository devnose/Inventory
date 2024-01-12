import React from "react";
import { GridToolbarContainer } from "@mui/x-data-grid";
import DateHandler from "./DateHandler";
import SendRows from "./SendRows";
import { format, isValid, parse } from "date-fns";
import PrintJob from "./PrintJob";

const CustomGridToolbar = ({
  selected,
  inputValue,
  setSelected,
  setInputValue,
  setIsPopperOpen,
  isPopperOpen,
  selectedData,
  inventoryData,
  setInventoryData,
  setStatusLoading,
  setIsLoading,
  emailSelections,
}) => {
  const closePopper = () => {
    setIsPopperOpen(false);
  };

  const handleDaySelect = (date) => {
    setSelected(date);
    if (date) {
      setInputValue(format(date, "y-MM-dd"));
      console.log(date);
      closePopper();
    } else {
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    const date = parse(e.target.value, "y-MM-dd", new Date());
    if (isValid(date)) {
      setSelected(date);
    } else {
      setSelected(undefined);
    }
  };

  return (
    <GridToolbarContainer
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <DateHandler
          selected={selected}
          inputValue={inputValue}
          isPopperOpen={isPopperOpen}
          setIsPopperOpen={setIsPopperOpen}
          handleDaySelect={handleDaySelect}
          handleInputChange={handleInputChange}
        />
      </div>
      <div>
        Last Posted date: <b>10/20/2023</b>
      </div>
      <div>
        <SendRows
          selectedData={selectedData}
          inventoryData={inventoryData}
          setInventoryData={setInventoryData}
          setStatusLoading={setStatusLoading}
          setIsLoading={setIsLoading}
          emailSelections={emailSelections}
        />

        <PrintJob selectedData={selectedData} />
      </div>
    </GridToolbarContainer>
  );
};

export default CustomGridToolbar;
