import React from 'react';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import { useTheme } from '@emotion/react';
import { tokens } from '../../../theme';
import SendIcon from '@mui/icons-material/Send';

const SendRows = ({ selectedData, inventoryData, setInventoryData, setStatusLoading, setIsLoading, emailSelections }) => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const getRows = () => {


  
    setStatusLoading(true);
    setIsLoading(true);
    enqueueSnackbar("Processing Invoices", { variant: "info" });
  
    const selectedRows = inventoryData.filter((row) => selectedData.includes(row.id)).map(row => {
    //   const existingEmails = row.CustomerEmail || [];
      const newEmails = emailSelections[row.id] || [];
    //   const mergedEmails = Array.from(new Set([...existingEmails, ...newEmails])); // Merge and de-duplicate
  
      return {
        ...row,
        CustomerEmail: newEmails
      };
    });

    console.log(selectedRows)
  
    
    fetch("/oe/api/invoice/generate/sendemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedRows),
      })
        .then((response) => response.text())
        .then((textData) => {
          const jsonStrings = textData.trim().split("\n"); // Split by newline
          let updatedInventoryData = [...inventoryData]; // Clone current state
          setStatusLoading(false);
          jsonStrings.forEach((jsonStr) => {
            // setSelectedData([]);
            setIsLoading(false);
            const jsonData = JSON.parse(jsonStr); // Parse each JSON string
            enqueueSnackbar("Invoice-" + jsonData.id + " Email Sent", {
              variant: "success",
            });

            updatedInventoryData = updatedInventoryData.map((item) => {
              if (item.id === jsonData.id) {
                return {
                  ...item,
                  Status: jsonData.update,
                };
              }
              return item;
            });
          });

          setInventoryData(updatedInventoryData); // Update state once
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    }

  return (
    <Button
      size="large"
      onClick={getRows}
    //   endIcon={<SendIcon/>}
      sx={{
        margin: "10px",
        backgroundColor: 'transparent',
        fontWeight: "800",
      }}
    >
      Send Emails
    </Button>
  );
};

export default SendRows;
