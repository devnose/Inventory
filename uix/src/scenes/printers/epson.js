import { Box, Button, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import BasicModal from "./addEquip";
import { columns, getPrinterGridColumns } from "./globalColumns";

const EpSon = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [inventoryData, setInventoryData] = useState([]);

  const updateInventoryData = (newData) => {
    setInventoryData((prevUserData) => [...prevUserData, newData]);
    console.log(newData);
  };

  // getting black and white printers from backend
  useEffect(() => {
    fetch("/oe/api/printer/epson/retrive")
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setInventoryData(data));

    console.log(inventoryData);
  }, []);

  const columns = getPrinterGridColumns(colors);

  function CustomToolbar() {
    return (
      <GridToolbarContainer style={{ fontSize: 15 }}>
        <GridToolbarExport />
        <BasicModal updateInventoryData={updateInventoryData} api={'epson'} />
      </GridToolbarContainer>
    );
  }

  return (
    <Box
    m="-10px 0 0 0"
    height="75vh"
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
        components={{ Toolbar: CustomToolbar }}
        sx={{
          width: "150vh",
          marginRight: "auto",
          marginLeft: "auto",
          marginTop: "40px",
        }}
      />
    </Box>
  );
};

export default EpSon;
