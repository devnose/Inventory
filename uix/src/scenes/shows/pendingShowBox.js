import { Box, IconButton, Typography, colors, useTheme } from "@mui/material";
import React from "react";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PdfDownloader from "./pdfDownloader";
import EditShowBox from "./EditShowBox";
import BasicModal from "./createShow";


const PendingShowBox = ({
  customerName,
  showName,
  ship,
  customerOrder,
  address,
  items,
  file,
  updateData
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = Math.ceil(items.length / 8);







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
            {customerName}
          </Typography>

          <Typography
            variant="h3"
            fontWeight="bold"
            color={colors.greenAccent[500]}
          >
             {ship}
          </Typography>
        </Box>

        <Box padding={'3px'}>
         <PdfDownloader show={false} pendingBuffer={file} name={customerOrder+'CO'}/>
         
          {/* <IconButton>
            <EditOutlinedIcon
              sx={{ fontSize: "24px", color: colors.greenAccent[500] }}
            />
          </IconButton> */}
          {/* <BasicModal changeIcon={false} show={show}/> */}
          <EditShowBox changeIcon={false} showName={customerName} shipDate={ship} orderNumber={customerOrder} address={address} updateInventoryData={updateData}/>

         
        </Box>
      </Box>

      <Typography
        variant="p"
        fontWeight="600"
        color={colors.grey[100]}
        padding={"10px"}
      >
       <div style={{ display: "flex" }}>
  {[...Array(columns)].map((_, columnIndex) => (
    <div key={columnIndex} style={{ flex: 1 }}>
      <ul>
        {items
          .slice(columnIndex * 8, (columnIndex + 1) * 8)
          .map((item, index) => (
            <li key={index}>
              {item.description} - Quantity: {item.qtyOrdered}
            </li>
          ))}
      </ul>
    </div>
  ))}
</div>
      </Typography>


      
    </Box>
  );
};

export default PendingShowBox;
