import React from 'react';
import { Button } from '@mui/material';

const PrintJob = ({ selectedData }) => {

  const handleOpen = async () => {
    const response = await fetch('/oe/api/invoice/generate/getpdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedData }),
    });

    const pdfBuffer = await response.arrayBuffer();
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    const objectURL = URL.createObjectURL(blob);

    // Create an iframe and append it to document
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';  // Invisible iframe
    document.body.appendChild(iframe);

    iframe.onload = function() {
      setTimeout(function() {
        iframe.focus();
        iframe.contentWindow.print();
      }, 1);
    };

    iframe.contentWindow.onafterprint = function() {
      // Remove iframe
      console.log('removal')
      document.body.removeChild(iframe);
    };

    iframe.src = objectURL;
  };

  return (
    <Button variant="contained" color="primary" onClick={handleOpen}>
      Print PDF
    </Button>
  );
};

export default PrintJob;
