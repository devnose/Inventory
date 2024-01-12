import React, { useEffect, useState, useCallback } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import axios from "axios";
import { Button } from "@mui/material";
import { Box, ButtonGroup, IconButton, Modal, colors } from "@mui/material";
import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const maxWidth = 700;


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  width: '70%',
  height: '98%',
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

function ViewPdf({ id }) {
  const [file, setFile] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const handleOpen = (event) => {
    event.stopPropagation();
    setOpen(true);
  };

  const [zoomLevel, setZoomLevel] = useState(1);

  const zoomIn = () => {
    setZoomLevel(prevZoomLevel => prevZoomLevel + 0.1);
  };

  const zoomOut = () => {
    setZoomLevel(prevZoomLevel => Math.max(prevZoomLevel - 0.1, 0.1));
  };

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  
  useEffect(() => {


    async function fetchData() {
        fetch(`oe/api/invoice/generate/grab/${id}`)
      .then(response => response.blob())  // Get the response and return it as a blob
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
              const arrayBuffer = reader.result;
              const base64String = arrayBufferToBase64(arrayBuffer);
              const dataUrl = `data:application/pdf;base64,${base64String}`;
              setFile(dataUrl);  // set dataUrl instead of uint8Array
            }
          };
        reader.readAsArrayBuffer(blob);
        
      });
    }
    if(open){
        console.log('opened')
    fetchData();
    }
  }, [id, open],);

  const onFileChange = (event) => {
    const { files } = event.target;

    if (files && files[0]) {
      setFile(files[0] || null);
    }
  };

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages);
  };


  return (
    <div>
      {/* ... rest of your code */}
      <Box>
        <IconButton
          variant="contained"
          color="primary"
          size="small"
          style={{ marginRight: 10 }}
          onClick={(event) => {
            // handleDownload();
            handleOpen(event)
          }}
        >
          <VisibilityIcon />
        </IconButton>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          {/* Close button */}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {/* Centered Button Group */}
          <ButtonGroup variant="contained" aria-label="contained button group" sx={{ mb: 2 }}>
            <Button onClick={zoomIn}>
              <ZoomInIcon />
            </Button>
            <Button onClick={zoomOut}>
              <ZoomOutIcon />
            </Button>
          </ButtonGroup>
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={maxWidth * zoomLevel}  // Adjust page width according to zoom level
              />
            ))}
          </Document>
        </Box>
      </Modal>
    </div>
  );
}

export default ViewPdf

{
  /* <div className="Example__container__load">
<label htmlFor="file">Load from file:</label>{' '}
<input onChange={onFileChange} type="file" />
<button onClick={() => setShowModal(true)}>Show PDF in Modal</button>
</div> */
}

{
  /* <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={maxWidth}
                />
              ))}
            </Document> */
}
