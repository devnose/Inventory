import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LinearProgress from "@mui/material/LinearProgress";
import EmailIcon from "@mui/icons-material/Email";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ComposeEmail from "./ComposeEmail";


const Invoice = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pageSize, setPageSize] = useState(10);
  const [inventoryData, setInventoryData] = useState([]);
  const [page, setPage] = useState(0); // Initialize to 1
  const [limit] = useState(10); // Set limit to 10 or as per your requirement
  const [totalItems, setTotalItems] = useState(0); // To keep track of total records
  const [isLoading, setIsLoading] = useState(false);
  const [disabledEmail, setDisabledEmail] = useState(false);

  const apiRef = useGridApiRef(); // For handling pagination

  //opens modal for emailing invoice
  const renderEmailButton = (params) => {
    //callback when email is sent come disable the button
    

    return (
      <ComposeEmail
        openModal={false}
        invoiceEmails={params.row}
        updateEmailSent={true}
      />
    );
  };

  // renders download button
  const renderDetailsButton = (params) => {
    // if (params.row.file.type !== "Buffer" ||!Array.isArray(params.row.file.data) ) {
    //   throw new Error("Unexpected data format");
    // }

    // const arrayBuffer = new Uint8Array(params.row.file.data);

    // const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });

    // const downloadFile = (blob, fileName) => {
    //   // Create blob URL
    //   const url = window.URL.createObjectURL(blob);

    //   // Create a download link and click it programmatically
    //   const a = document.createElement("a");
    //   a.style.display = "none";
    //   a.href = url;
    //   a.download = fileName;

    //   document.body.appendChild(a);
    //   a.click();

    //   // Cleanup
    //   window.URL.revokeObjectURL(url);
    //   document.body.removeChild(a);
    // };

    //handles the actual download

    const createInvoice = async () => {
      console.log(params.row.file);

      fetch(`oe/api/invoice/generate/grab/${params.row.file}`)
      .then(response => response.blob())  // Get the response and return it as a blob
      .then(blob => {
        // Create a link element
        let link = document.createElement('a');
    
        // Create a URL to the blob
        link.href = window.URL.createObjectURL(blob);
    
        // Set the file name
        link.download = `Invoice-${params.row.file}.pdf`;
    
        // Append the link to the body (this is necessary to make it work in Firefox)
        document.body.appendChild(link);
    
        // Simulate a click on the link
        link.click();
    
        // Remove the link from the body
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('There was an error fetching the PDF:', error);
      });
    };

    const handleDownload = async () => {
      createInvoice()
      // try {
      //   downloadFile(blob, params.row.name + ".pdf");
      // } catch (error) {
      //   console.error("Error downloading file:", error);
      // }
    };

    return (
      <strong>
        <IconButton
          variant="contained"
          color="primary"
          size="small"
          style={{ marginRight: 10 }}
          onClick={() => {
            handleDownload();
          }}
        >
          <DownloadOutlinedIcon />
        </IconButton>
      </strong>
    );
  };

  //render pdf icon
  const renderPdfIcon = (params) => {
    return <PictureAsPdfIcon />;
  };

  useEffect(() => {
    // Updated fetch to include page and limit as query params
    // fetch(`/oe/api/Invoice/retrieve?page=${page}&limit=${limit}`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setInventoryData(data.data); // Assuming the data is in the `data` key
    // setTotalItems(data.totalPages * limit); // Assuming the total pages are in `totalPages` key

    setIsLoading(true); // Start loading
    fetch(`/oe/api/invoice/generate/details?page=${page+1}&pageSize=${pageSize}`)
      .then((response) => response.json())
      .then((data) => {
        setInventoryData(data);
        setIsLoading(false); // Stop loading
      });
  }, [page, limit]);

  const columns = [
    {
      field: "type",
      headerName: "Type",
      flex: 0.1,
      renderCell: renderPdfIcon,
      disableClickEventBubbling: true,
    },
    { field: "id", headerName: "Name", flex: 0.4 },

    {
      field: "invoiceNo",
      headerName: "Invoice No",
      flex: 0.3,
      hide: true,
    },
    {
      field: "customerNo",
      headerName: "Customer No",
      flex: 0.3,
    },
    {
      field: "soldTo",
      headerName: "Sold To",
      flex: 0.6,
    },
    {
      field: "shipTo",
      headerName: "Ship to",
      flex: 0.6,
    },
    {
      field: "invoiceDate",
      headerName: "Invoice Date",
      flex: 0.3,
    },
    {
      field: "orderNo",
      headerName: "Order No",
      flex: 0.3,
    },
    {
      field: "orderDate",
      headerName: "Order Date",
      flex: 0.3,
    },

    {
      field: "file",
      headerName: "Download",
      flex: 0.2,
      center: true,
      renderCell: renderDetailsButton,
      disableClickEventBubbling: true,
    },

    {
      field: "email",
      headerName: "Email",
      flex: 0.2,
      renderCell: renderEmailButton,
      disableClickEventBubbling: true,
    },
  ];

  const updateEmailSent = (invoiceName) => {
    // Update the `sent` status of the invoice with the given name
    const updatedGridData = inventoryData.map((invoice) => {
      if (invoice.name === invoiceName) {
        return { ...invoice, sent: true };
      }
      return invoice;
    });

    setInventoryData(updatedGridData);
  };

  return (
    <Box m="20px">
      {/* <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Invoice" subtitle="Library" />
      </Box> */}

      <Box
        m="-10px 0 0 0"
        height="85vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            zIndex: 1000, // Setting the z-index
            boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "solid thin",
            borderColor: colors.grey[700],

          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.primary[600],
            borderBottom: " solid",
            borderColor: colors.blueAccent[700],
                    },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: " solid",

            borderColor: colors.blueAccent[700],     
                   backgroundColor: colors.primary[600]
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[900]} !important`,
          },
        }}
      >
        <DataGrid
          rows={inventoryData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          apiRef={apiRef}
          loading={isLoading}
        pagination
        pageSize={pageSize}
        rowCount={1000} // you should get this number from your API
        paginationMode="server"
        onPageChange={(params) => {
          setPage(params)
          console.log(params)
        }}
         onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize); 
          console.log(newPageSize)
        }}




        />
      </Box>
    </Box>
  );
};

export default Invoice;
