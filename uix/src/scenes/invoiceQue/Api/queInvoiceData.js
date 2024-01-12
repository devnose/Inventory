import { initializeSelections } from '../Utility/initializeSelections';

export const fetchInvoiceData = async (inputValue, setIsLoading, setEmailSelections, setInventoryData, setDataLoaded, shouldFetchData) => {
    setIsLoading(true);
    console.log(inputValue);
    try {
      const response = await fetch(
        `/oe/api/invoice/generate/que?date=${inputValue.replace(/-/g, "")}`
      );
      const data = await response.json();
  
      // I'm assuming `initializeSelections` is a function you have defined in your component
      const defaultEmailSelections = initializeSelections(data);
      setEmailSelections(defaultEmailSelections); // this will preselect all emails by default
      setInventoryData(data);
      console.log(defaultEmailSelections)
  
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      shouldFetchData.current = true;
    }
  };
  