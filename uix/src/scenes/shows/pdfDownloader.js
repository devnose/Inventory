import { IconButton, useTheme } from '@mui/material';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { tokens } from "../../theme"

import React from 'react';

const PdfDownloader = ({show, pendingBuffer, name}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


  const handleDownload = () => {

    if(show){
    fetch('/oe/api/shows/packinglist:'+show)
      .then(response => response.blob())
      .then(data => {
        const downloadUrl = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `packinglist.pdf`; // Specify the desired filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Error downloading binary data:', error);
      })
    } else{



      
  // Extract the data array and create a Uint8Array from it
  const pdfBuffer = new Uint8Array(pendingBuffer.data);
        // Create a Blob from the PDF buffer
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });

    // Create an anchor element and programmatically click it to trigger download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${name}.pdf`  // You can name your file here
    link.click();

    URL.revokeObjectURL(link.href);

      




    }
  };

  return (
    <IconButton onClick={handleDownload} >
    <DownloadOutlinedIcon 
      sx={{ fontSize: "24px", color: colors.greenAccent[500] }}
    />
  </IconButton>
  );
};

export default PdfDownloader;