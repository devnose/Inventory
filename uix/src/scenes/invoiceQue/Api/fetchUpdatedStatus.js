// apiCalls.js

export const fetchUpdatedStatus = async (inventoryData, setInventoryData, shouldFetchData) => {
    if (!shouldFetchData.current) return; // Don't fetch if flag is false
  
    try {
      const response = await fetch("/oe/api/invoice/generate/status");
      const data = await response.json();
  
      const updatedInventoryData = inventoryData.map((item) => {
        const updatedItem = data.find((d) => d.InvoiceNo === item.InvoiceNo);
        if (updatedItem) {
          console.log(updatedItem.Status);
          return {
            ...item,
            Status: updatedItem.Status,
          };
        }
        return item;
      });
  
      setInventoryData(updatedInventoryData);
      shouldFetchData.current = false; // Set flag to false after fetching
    } catch (error) {
      console.error("Error while fetching updated status:", error);
    }
  };
  