import { Box, IconButton, Typography, colors, useTheme } from "@mui/material";
import React from "react";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

import EditShowBox from "../shows/EditShowBox";
import PdfDownloader from "../shows/pdfDownloader";
const ShowBox = ({
  show,
  shipdate,
  laptop,
  kiosk,
  printer,
  scanner,
  toner,
  extra,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const combinedEquipment = [
    ...laptop,
    ...kiosk,
    ...printer,
    ...toner,
    ...extra,
    ...scanner,
  ];


  const categorizedEquipment = combinedEquipment.reduce((acc, item) => {
    const key = item.name.slice(0, 4); // Assuming the prefix is always 4 characters
    if (!acc[key]) {
      acc[key] = {
        description: "",
        count: 0
      };
    }
    acc[key].count++;
    
    // Add description for each type here
    if (key === "EKMS") acc[key].description = "Epson Color Ink Jet Printer";
    if (key === "HPCL") acc[key].description = "HP Color LaserJet Printer";
    if (key === "WK") acc[key].description = "White Self-Check Computer";
    if (key === "LKMS") acc[key].description = "Help Desk Laptop Check-in";
    if (key.includes("BK")) acc[key].description = "Black Self-Check Computer";
    if (key === "SKMS") acc[key].description = "Zebra Barcode Scan-Self Check";
    if (key === "BL") acc[key].description = "Brother Black&White Laser Printer";
    if (key === "BCL") acc[key].description = "Brother Color Laser Printer";
    // Add more types as needed...
    
    return acc;
  }, {});
  
  
  

  
  const columns = Math.ceil(combinedEquipment.length / 8);

  const [updateLaptops, setUpdateLaptops] = React.useState([]);

  const getShowToCheckIn = (showname) => {
    fetch("oe/api/shows/findshow:" + showname)
      .then((response) => response.json())
      .then((data) => {
        let result = data;
        console.log(result[0]);
        setUpdateLaptops(result);
        checkInData(result[0]);
      });
  };

  const checkInData = (dataArray) => {
    const obj = { name: "John", age: 30, city: "New York" };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataArray),
    };

    fetch("oe/api/shows/update", requestOptions)
      .then((response) => response.json)
      .then((data) => console.log(data));
  };

  const checkInButton = () => {
    getShowToCheckIn(show);
  };

  return (

    
    <Box
      height={"300px"}
      gridColumn="span 4"
      gridRow="span 2"
      sx={{
        borderRadius: '5px', // Rounded corners
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)', // Box shadow for elevation
      }}
      backgroundColor={colors.primary[300]}
    >
      <Box
        mt="25px"
        p="0 30px"
        display="flex "
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
            {show}
          </Typography>

          <Typography
            variant="h3"
            fontWeight="bold"
            color={colors.greenAccent[500]}
          >
            {shipdate}
          </Typography>
        </Box>

        <Box padding={"3px"}>
          <PdfDownloader show={show} />
          <IconButton onClick={checkInButton}>
            <InventoryOutlinedIcon
              sx={{ fontSize: "24px", color: colors.greenAccent[500] }}
            />
          </IconButton>
          {/* <IconButton>
            <EditOutlinedIcon
              sx={{ fontSize: "24px", color: colors.greenAccent[500] }}
            />
          </IconButton> */}
          {/* <BasicModal changeIcon={false} show={show}/> */}
          <EditShowBox changeIcon={false} />

          <IconButton>
            <InsertPhotoIcon
              sx={{ fontSize: "24px", color: colors.greenAccent[500] }}
            />
          </IconButton>
        </Box>
      </Box>


      <Typography
        variant="p"
        fontWeight="600"
        color={colors.grey[100]}
        padding={"10px"}
      >
<div>
  <ul>
    {Object.keys(categorizedEquipment).map((key, index) => (
      <li key={index} style={{ width: '100%' }}>
        {`${categorizedEquipment[key].description} - Quantity: ${categorizedEquipment[key].count}`}
      </li>
    ))}
  </ul>
</div>


      </Typography>
    </Box>
  );
};

export default ShowBox;
