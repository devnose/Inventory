import { useState, useEffect, useRef } from "react";
import{ DataGrid,useGridApiRef, } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import "react-day-picker/dist/style.css";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import CustomNoRowsOverlay from "./empty";
import { useSnackbar } from "notistack";
import { fetchInvoiceData } from './Api/queInvoiceData'; // Adjust the path to where you place apiCalls.js
import { fetchUpdatedStatus } from "./Api/fetchUpdatedStatus";
import RenderStatusCell from "./GridComponents/RenderStatusCell";
import RenderEmailCell from "./GridComponents/RenderEmailCell";
import RenderViewCell from "./GridComponents/RenderViewCell";
import { CustomFooter } from "./GridComponents/CustomFooter";
import CustomGridToolbar from "./GridComponents/CustomGridToolbar";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = { PaperProps: { style: {  maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 250,},},};


const Que = () => {

    const [selectedRow, setSelectedRow] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [inventoryData, setInventoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const apiRef = useGridApiRef();
    const [emailSelections, setEmailSelections] = useState({});
    const [selected, setSelected] = useState(null);
    const [selectedData, setSelectedData] = useState([]);
    const [inputValue, setInputValue] = useState("2023-10-18");
    const [isPopperOpen, setIsPopperOpen] = useState(false);
    const [isDataLoaded, setDataLoaded] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [formattedEmailSelections, setFormattedEmailSelections] = useState({});
    const shouldFetchData = useRef(false); // Ref to track whether we should fetch data

    const columns = [
        { field: "id", headerName: "Invoice#", flex: 0.11, center: true },
        { field: "InvoiceDate", headerName: "Invoice Date", flex: 0.15, center: true },
        { field: "CustomerNo", headerName: "Customer Number", flex: 0.18, center: true },
        { field: "SoldTo", headerName: "Sold To", flex: 0.4, center: true },
        { field: "CustomerEmail", headerName: "Email", flex: 1, center: true, renderCell: (params) => <RenderEmailCell params={params}  emailSelections={emailSelections} setEmailSelections={setEmailSelections} formattedEmailSelections={formattedEmailSelections} inventoryData={inventoryData} selectedData={selectedData} customStyles={customStyles}/> },
        { field: "Status", headerName: "Status", flex: 0.26, center: true,  renderCell: (params) => <RenderStatusCell row={params.row} selectedData={selectedData} statusLoading={statusLoading} colors={colors}/>, },
        { field: "View", headerName: "View", flex: 0.1, disableClickEventBubbling: true, renderCell: (params) => <RenderViewCell params={params}/> },
      ];

      const customStyles = {
        control: (base) => ({
          ...base,
          background: "transparent",
          border: "none",
          boxShadow: "none",
          width: "100%",
        }),
        multiValue: (styles) => ({
          ...styles,
          backgroundColor: 'lightblue',  // Define a static color for the background of selected values
        }),
        multiValueLabel: (styles) => ({
          ...styles,
          color: 'blue',  // Define a static color for the text of selected values
        }),
        multiValueRemove: (styles) => ({
          ...styles,
          color: 'blue',  // Define a static color for the remove icon of selected values
          ':hover': {
            backgroundColor: 'blue',
            color: 'white',
          },
        }),
      };
      
      

    useEffect(() => {
        fetchInvoiceData(inputValue, setIsLoading, setEmailSelections, setInventoryData, setDataLoaded, shouldFetchData);
      }, [inputValue]);

      useEffect(() => {
        fetchUpdatedStatus(inventoryData, setInventoryData, shouldFetchData);
      }, [inventoryData]);

      
  useEffect(() => {
    // Update formattedEmailSelections whenever emailSelections changes
    const updatedFormattedEmailSelections = Object.fromEntries(
      Object.entries(emailSelections).map(([id, emails]) => [
        id,
        emails.map(email => ({ label: email, value: email }))
      ])
    );
    setFormattedEmailSelections(updatedFormattedEmailSelections);

    console.log(updatedFormattedEmailSelections)
  }, [emailSelections]);



  const getStyles = (name, selectionEmail, theme) => {
    return {
      fontWeight:
        selectionEmail && selectionEmail.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }


  const handleEmailChange = (rowId) => (event) => {
    setEmailSelections((prev) => ({ ...prev, [rowId]: event.target.value }));
  };



  const handleOpenDialog = () => {
    setOpenDialog(true);
}


  const handleCloseDialog = () => {
    setOpenDialog(false);
}


  const handleAddEmail = () => {
    if (newEmail) {
        setNewEmail("");
        setOpenDialog(false);
    }
}



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
            Toolbar: () => (
              <CustomGridToolbar
                selected={selected}
                inputValue={inputValue}
                setSelected={setSelected}
                setInputValue={setInputValue}
                setIsPopperOpen={setIsPopperOpen}
                isPopperOpen={isPopperOpen}
                selectedData={selectedData}
                inventoryData={inventoryData}
                setInventoryData={setInventoryData}
                setStatusLoading={setStatusLoading}
                setIsLoading={setIsLoading}
                emailSelections={emailSelections}
                setSelectedDat={setSelectedData}
              />
            ),
            NoRowsOverlay: CustomNoRowsOverlay,
            Footer: () => (<CustomFooter inventoryData={inventoryData} />),
            // LoadingOverlay: CustomNoRowsOverlay
          }}
          
          apiRef={apiRef}
          loading={isLoading}
          onSelectionModelChange={(newSelection) => {
            setSelectedData(newSelection);
          }}
          selectionModel={selectedData}
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

export default Que