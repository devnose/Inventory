import { Box, Button, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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
import Bbw from "./Bbw";
import Bcl from "./Bcl";
import Hpcl from "./Hpcl";
import EpSon from "./epson";

const Printers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [inventoryData, setInventoryData] = useState([]);
  const [selectedButton, setSelectedButton] = useState(1);

  const updateInventoryData = (newData) => {
    // const updatedInventoryData = [...inventoryData, newData];
    // setInventoryData(updateInventoryData);
    setInventoryData((prevUserData) => [...prevUserData, newData]);
    console.log(newData);
  };

  const handleClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  useEffect(() => {
    fetch("/oe/api/Printer/retrive")
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setInventoryData(data));

    console.log(inventoryData);
  }, []);

  const columns = getPrinterGridColumns(colors);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
   

        <Button
          onClick={() => handleClick(1)}
          mb="30px"
        
          sx={{
            marginLeft: "30px",
            flexDirection: "column", // Stack children vertically
            alignItems: "center", // Align items to the center
            justifyContent: "center", // Center items vertically
          }}
        >
          {" "}
          <Typography
            variant="h2"
            color={colors.grey[200]}
            fontWeight="bold"
            sx={{ m: "0 0 5px 0" }}
            style={{ opacity: selectedButton === 1 ? 1 : 0.4 }}
          >
            BROTHER BLACK AND WHITE
          </Typography>
          <Typography variant="h5" color={colors.greenAccent[400]}>
            HL-L3270DW/L3250DW
          </Typography>
        </Button>

        <Button
          onClick={() => handleClick(2)}
          mb="30px"
          sx={{
            flexDirection: "column", // Stack children vertically
            alignItems: "center", // Align items to the center
            justifyContent: "center", // Center items vertically
          }}
        >
          <Typography
            variant="h2"
            color={colors.grey[200]}
            fontWeight="bold"
            sx={{ m: "0 0 5px 0" }}
            style={{ opacity: selectedButton === 2 ? 1 : 0.4 }}
          >
            BROTHER COLOR LASER
          </Typography>
          <Typography variant="h5" color={colors.greenAccent[400]}>
            HL=L3230CDW/L3270CDW
          </Typography>
        </Button>

        <Button
          onClick={() => handleClick(3)}
          mb="30px"
          sx={{
            flexDirection: "column", // Stack children vertically
            alignItems: "center", // Align items to the center
            justifyContent: "center", // Center items vertically
          }}
        >
          <Typography
            variant="h2"
            color={colors.grey[200]}
            fontWeight="bold"
            sx={{ m: "0 0 5px 0" }}
            style={{ opacity: selectedButton === 3 ? 1 : 0.4 }}
          >
            HP COLOR LASER
          </Typography>
          <Typography variant="h5" color={colors.greenAccent[400]}>
            M255DW
          </Typography>
        </Button>

        <Button
          onClick={() => handleClick(4)}
          mb="30px"
          sx={{
            flexDirection: "column", // Stack children vertically
            alignItems: "center", // Align items to the center
            justifyContent: "center", // Center items vertically
          }}
        >
          <Typography
            variant="h2"
            color={colors.grey[200]}
            fontWeight="bold"
            sx={{ m: "0 0 5px 0" }}
            style={{ opacity: selectedButton === 4 ? 1 : 0.4 }}
          >
            EPSON
          </Typography>
          <Typography variant="h5" color={colors.greenAccent[400]}>
            C-3500TM
          </Typography>
        </Button>

        
        <div />

        {/* <BasicModal updateInventoryData={updateInventoryData}/> */}

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
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.primary[600],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.primary[600],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {selectedButton === 1 && (
          <Bbw/>
        )}

{selectedButton === 2 && (
          <Bcl/>
        )}


{selectedButton === 3 && (
          <Hpcl/>
        )}

{selectedButton === 4 && (
          <EpSon/>

        )}

        {/* <BasicModal updateInventoryData={updateInventoryData} /> */}
      </Box>
    </Box>
  );
};

export default Printers;
