import { useState, useEffect, useRef } from "react";
import Select from 'react-select/creatable';
import {
  DataGrid,
  GridFooterContainer,
  GridRowId,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  useGridApiRef,
} from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PreviewIcon from "@mui/icons-material/Preview";
import Box from "@mui/material/Box";
import ComposeEmail from "../invoice/ComposeEmail";
import LinearProgress from "@mui/joy/LinearProgress";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  OutlinedInput,
  // Select,
  TextField,
} from "@mui/material";
import DatePickerDialog from "./datePicker";
import { getRowIdFromRowModel } from "@mui/x-data-grid/hooks/features/rows/gridRowsUtils";
import { format, isValid, parse } from "date-fns";
import CustomNoRowsOverlay from "./empty";
import ViewPdf from "./viewPdf";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import { useSnackbar } from "notistack";
import styles from "react-day-picker/dist/style.css";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const InvoiceQue = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [inventoryData, setInventoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const apiRef = useGridApiRef();
  const [emailSelections, setEmailSelections] = useState({});
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState([]); 

  const [selected, setSelected] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [inputValue, setInputValue] = useState("2023-10-18");
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
const [newEmail, setNewEmail] = useState("");

  const shouldFetchData = useRef(false); // Ref to track whether we should fetch data



  const handleOpenDialog = () => {
    setOpenDialog(true);
}

const handleCloseDialog = () => {
    setOpenDialog(false);
}

const handleAddEmail = () => {
    if (newEmail) {
        // Here you should update the state that holds the emails list.
        // For the sake of this example, I'm assuming you have a state called emails and a function setEmails to update it.
        // setEmails(prevEmails => [...prevEmails, newEmail]);
        setNewEmail("");
        setOpenDialog(false);
    }
}

const customStyles = {
  // This will remove the border
  control: (base) => ({
    ...base,    
    background: 'transparent', // Set background to transparent
    border: 'none',
    boxShadow: 'none',
    width: '100%',

  }),

  // This will make it full width

};


const handleCreate = (inputValue) => {
  const newOption = { value: inputValue.toLowerCase(), label: inputValue };
  const selectedRows = inventoryData.filter((row) => {
  selectedData.includes(row.id)
  console.log(selectedRows)
  });
};

  const renderEmailSelection = (params) => {
    const currentRowSelection = emailSelections[params.row.id] || [];
    // console.log(currentRowSelection);

    const uniqueEmails = Array.from(new Set(currentRowSelection));
    const opt = uniqueEmails.map((email) => ({
      value: email,
      label: email
    }));

    return (
      <div style={{ width: '100%' }}>
      <Select isMulti  placeholder={'Add new email'} options={opt} defaultValue={opt} styles={customStyles} onCreateOption={handleCreate} components={{ DropdownIndicator: () => null }} />
      </div>

//        <Select
//         fullWidth={true}
//         sx={{
//           boxShadow: "none",
//           ".MuiOutlinedInput-notchedOutline": { border: 0 },
//           border: "none",
//           "&:hover": {
//             border: "none",
//           },
//           "&.Mui-focused": {
//             border: "none",
//           },
//         }}
//         labelId="email-selection"
//         id="email-selection"
//         value={currentRowSelection}
//         multiple
//         onChange={handleEmailChange(params.row.id)}
//         input={
//           <OutlinedInput
//             id="select-email-chip"
//             label="email"
//             notched={false}
//             style={{
//               border: "none",
//               "&:hover": {
//                 border: "none",
//               },
//               "&.Mui-focused": {
//                 border: "none",
//               },
//             }}
//           />
//         }
//         renderValue={(selected) => (
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.2 }}>
//             {selected.map((value) => (
//               <Chip key={value} label={value} />
//             ))}
//           </Box>
//         )}
//         MenuProps={MenuProps}
//       >

// <MenuItem value="add_new_email" onClick={() => {
//                         handleOpenDialog();
//                         setSelectedRow(params.row);
//                     }}>
//                         Add new email
//                     </MenuItem>


                    
//         {Array.isArray(params.row.CustomerEmail) &&
//           params.row.CustomerEmail.map((email) => (
//             <MenuItem
//               key={email}
//               value={email}
//               style={getStyles(email, currentRowSelection, theme)}
//             >
//               {email}
//             </MenuItem>
//           ))}
//       </Select> 
    );
  };

  const initializeSelections = (rows) => {
    const initialState = {};
    rows.forEach((row) => {
      initialState[row.id] = row.CustomerEmail || [];
    });
    return initialState;
  };

  function getStyles(name, selectionEmail, theme) {
    return {
      fontWeight:
        selectionEmail && selectionEmail.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  // Don't fo
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
  const handleEmailChange = (rowId) => (event) => {
    setEmailSelections((prev) => ({ ...prev, [rowId]: event.target.value }));
  };

  const closePopper = () => {
    setIsPopperOpen(false);
  };

  function CustomToolbar() {
    function getRows() {
      setStatusLoading(true);
      setIsLoading(true);
      enqueueSnackbar("Processing Invoices", { variant: "info" });

      // Filter rows based on whether their id is in selectedData
      const selectedRows = inventoryData.filter((row) =>
        selectedData.includes(row.id)
      );

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
            setSelectedData([]);
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
      <GridToolbarContainer
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <DatePickerDialog
            selected={selected}
            inputValue={inputValue}
            isPopperOpen={isPopperOpen}
            setIsPopperOpen={setIsPopperOpen}
            handleDaySelect={handleDaySelect}
            handleInputChange={handleInputChange}
          />
        </div>

        <div>
          <Button
            size="small"
            onClick={getRows}
            startIcon={<PreviewIcon />}
            sx={{
              margin: "10px",
              backgroundColor: "transparent",
              fontWeight: "800",
            }}
          >
            Send Emails
          </Button>
          <Button

            startIcon={<PreviewIcon />}
            size="small"
            sx={{ backgroundColor: "transparent", fontWeight: "800" }}
          >
            Print Invoices
          </Button>
        </div>
      </GridToolbarContainer>
    );
  }

  function customFooter() {
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
  }

  useEffect(() => {
    // Removed the dash from the date and fetch new data
    const fetchData = async () => {
      setIsLoading(true);
      console.log(inputValue);
      try {
        const response = await fetch(
          `/oe/api/invoice/generate/que?date=${inputValue.replace(/-/g, "")}`
        );
        const data = await response.json();
        // Set the default email selections
        const defaultEmailSelections = initializeSelections(data);
        setEmailSelections(defaultEmailSelections); // this will preselect all emails by default
        setInventoryData(data);

        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        shouldFetchData.current = true;
      }
    };

    fetchData();
  }, [inputValue]);

  useEffect(() => {
    const fetchUpdatedStatus = async () => {
      if (!shouldFetchData.current) return; // Don't fetch if flag is false

      try {
        const response = await fetch("/oe/api/invoice/generate/status");
        const data = await response.json();
        console.log(data);

        // Assume data is an array of objects [{ id: 1, Status: 'Sent' }, { id: 2, Status: 'Failed'}]
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

    fetchUpdatedStatus();

    // If you want to periodically fetch data, you can uncomment the following lines:
    // const intervalId = setInterval(() => {
    //   shouldFetchData.current = true; // Set flag to true before fetching
    //   fetchUpdatedStatus();
    // }, 10000); // Fetch every 10 seconds

    // return () => clearInterval(intervalId); // Cleanup
  }, [inventoryData]); // Dependency array

  const renderStatusIcon = (params) => {
    const isRowSelected = selectedData.includes(params.row.id);

    if (statusLoading && isRowSelected) {
      return (
        <div style={{ position: "relative", height: "50px", width: "120px" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <ClipLoader color={"#000"} />
          </div>
        </div>
      );
    }

    return (
      <div>
        {params.row.Status === 1 ? (
          <div
            style={{
              borderRadius: "12px",
              backgroundColor: colors.blueAccent[700],
              padding: "5px",
              textAlign: "center",
              width: "120px",
              color: "#fff",
            }}
          >
            Email Sent
          </div>
        ) : (
          <div
            style={{
              borderRadius: "12px",
              backgroundColor: colors.grey[800],
              padding: "5px",
              textAlign: "center",
              width: "120px",
            }}
          >
            In Queue
          </div>
        )}
      </div>
    );
  };

  const renderViewButton = (params) => {
    // Download logic here...
    return <ViewPdf id={params.row.id} />;
  };

  const columns = [
    { field: "id", headerName: "Invoice#", flex: 0.11, center: true },

    {
      field: "InvoiceDate",
      headerName: "Invoice Date",
      flex: 0.15,
      center: true,
    },
    {
      field: "CustomerNo",
      headerName: "Customer Number",
      flex: 0.18,
      center: true,
    },

    {
      field: "SoldTo",
      headerName: "Sold To",
      flex: 0.4,
      center: true,
    },

    {
      field: "CustomerEmail",
      headerName: "Email",
      flex: 1,
      center: true,
      //   editable: true,
      renderCell: renderEmailSelection,
    },

    {
      field: "Status",
      headerName: "Status",
      flex: 0.26,
      center: true,
      renderCell: renderStatusIcon,
    },
    {
      field: "View",
      headerName: "View",
      flex: 0.1,
      disableClickEventBubbling: true,

      renderCell: renderViewButton,
      center: true,
    },
  ];

  const handleCellEditCommit = (params) => {
    // Find the index of the row based on id
    const idToUpdate = params.id;
    const newValue = params.value;
    const indexToUpdate = inventoryData.findIndex(
      (row) => row.id === idToUpdate
    );
    console.log(indexToUpdate);

    if (indexToUpdate > -1) {
      // Clone the inventoryData array
      const updatedInventoryData = [...inventoryData];

      // Update the CustomerEmail field of the row
      updatedInventoryData[indexToUpdate][params.field] = newValue;

      // Update the state
      setInventoryData(updatedInventoryData);
    }
  };

  return (
    <Box m="20px">
      <Box
        m="-10px 0 0 0"
        height="90vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
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
            backgroundColor: colors.primary[600],
          },
          "& .MuiDataGrid-cell": {
            fontSize: "15px",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[900]} !important`,
          },
        }}
      >
        {/* <Box display="flex" alignItems="center" justifyContent="space-between" >
                <Header title="KIOSK" subtitle="Inventory" />
                </Box> */}
        <DataGrid
          sx={{
            marginRight: "auto",
            marginLeft: "auto",
          }}
          checkboxSelection
          rows={inventoryData}
          columns={columns}
          components={{
            Toolbar: CustomToolbar,
            NoRowsOverlay: CustomNoRowsOverlay,
            Footer: customFooter,
            // LoadingOverlay: CustomNoRowsOverlay
          }}
          apiRef={apiRef}
          loading={isLoading}
          onSelectionModelChange={(newSelection) => {
            setSelectedData(newSelection);
          }}
          selectionModel={selectedData}
          onCellEditCommit={handleCellEditCommit}
        />
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
    <DialogTitle>Add New Email</DialogTitle>
    <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
        />
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
            Cancel
        </Button>
        <Button onClick={handleAddEmail} color="primary">
            Add
        </Button>
    </DialogActions>
</Dialog>

    </Box>
  );
};

export default InvoiceQue;
