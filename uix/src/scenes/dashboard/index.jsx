import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import ImportantDevicesIcon from "@mui/icons-material/ImportantDevices";
import PrintIcon from "@mui/icons-material/Print";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import GeographyChart from "../../components/GeographyChart";
import StatBox from "../../components/StatBox";
import React from "react";
import MonthlyRevenue from "./Monthly";
import ShowBox from "./showBox";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [totalLaptops, setTotalLaptops] = React.useState([]);
  const [totalKiosk, setTotalKiosk] = React.useState([]);
  const [totalScanners, setTotalScanners] = React.useState([]);
  const [totalPrinters, setTotalPrinters] = React.useState([]);
  const [allShows, setAllShows] = React.useState([]);

  React.useEffect(() => {
    fetch("/oe/api/shows/archive")
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setAllShows(data));

    fetch("/oe/api/laptop/retrive")
      .then((response) => response.json())
      .then((data) => {
        let result = data;
        setTotalLaptops(result.length);
      });

    fetch("/oe/api/kiosk/all")
      .then((response) => response.json())
      .then((data) => {
        let result = data;
        setTotalKiosk(result.length);
      });

    fetch("/oe/api/scanner/retrive")
      .then((response) => response.json())
      .then((data) => {
        let result = data;
        setTotalScanners(result.length);
      });

    fetch("/oe/api/printer/retrive")
      .then((response) => response.json())
      .then((data) => {
        let result = data;
        setTotalPrinters(result.length);
      });
  });

  return (
    <div>
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Inventory Overview" />
      </Box>
  
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <MonthlyRevenue
            value={totalLaptops}
            icon={LaptopMacIcon}
            title={"Laptops"}
          />
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <MonthlyRevenue
            value={totalPrinters}
            icon={PrintIcon}
            title={"Printer"}
          />
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <MonthlyRevenue
            value={totalKiosk}
            icon={LaptopMacIcon}
            title={"Kiosks"}
          />
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <MonthlyRevenue
            value={totalScanners}
            icon={QrCodeScannerIcon}
            title={"Scanners"}
          />
        </Box>


   
  
        {/* ROW 2 */}
        <Box
          gridColumn="span 12" // Added this to span the full width of the parent grid
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          {allShows.map((item, index) => (
            <ShowBox
              key={index}
              show={item.showname}
              shipdate={item.ship}
              laptop={item.laptop}
              printer={item.printer}
              kiosk={item.kiosk}
              scanner={item.scanner}
              toner={item.toner}
              extra={item.extra}
            />
          ))}
        </Box>
      </Box>
    </Box>
  </div>
  
  );
};

export default Dashboard;
