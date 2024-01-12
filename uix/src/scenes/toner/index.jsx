import { Box, Button, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme,Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import BasicModal from "./addEquip";

const Toner = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [inventoryData, setInventoryData] = useState([]); 

  const updateInventoryData = (newData) => {

    // const updatedInventoryData = [...inventoryData, newData]; 
    // setInventoryData(updateInventoryData);
    setInventoryData((prevUserData) => [...prevUserData, newData]);
    console.log(newData)
  }

  useEffect(() => {
    fetch("/api/Laptop/retrive")
    .then(response => response.json())
        // 4. Setting *dogImage* to the image url that we received from the response above
    .then(data => setInventoryData(data))

    console.log(inventoryData)

  },[])

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "manufacture", headerName: "Manufacture", flex: 0.7},
 
    {
      field: "model",
      headerName: "Model",
      flex: 0.7,
    },
    {
      field: "processor",
      headerName: "Processor",
      flex: 0.7,
    },
    {
      field: "ram",
      headerName: "Ram",
      flex: 0.7,
    },
    {
      field: "hd",
      headerName: "HD",
      flex: 0.7,
    },
    {
      field: "os",
      headerName: "OS",
      flex: 0.7,
    },
    {
      field: "serial",
      headerName: "Serial Number",
      flex: 0.7,

    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      renderCell: ({ row: { status } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              status === "IN"
                ? colors.greenAccent[600]
                : status === "OUT"
                ? colors.redAccent[700]
                : colors.redAccent[700]
            }
            borderRadius="4px"
          >
            {status === "IN" && <AdminPanelSettingsOutlinedIcon />}
            {status === "OUT" && <SecurityOutlinedIcon />}
            {status === "user" && <LockOpenOutlinedIcon />}
            <Tooltip title={status+status+status} >
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {status}
            </Typography>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="TONER/INK" subtitle="Inventory" />
        <BasicModal updateInventoryData={updateInventoryData}/>


        {/* <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <AddIcon sx={{ mr: "10px" }} />
            Add Equipment
          </Button>
        </Box> */}
      </Box>
      <Box
        m="-10px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
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
        />
      </Box>
    </Box>
  );
};

export default Toner;
