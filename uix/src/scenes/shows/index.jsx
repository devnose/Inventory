import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import ProgressCircle from "../../components/ProgressCircle";
import ShowBox from "./showBox";
import BasicModal from "./createShow";
import { useEffect, useState } from "react";
import PendingShowBox from "./pendingShowBox";
import Importing from "./Import";

const Shows = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [showDate, setShowData] = useState([]);
  const [pendingShowData, setPendingShowData] = useState([]); 

  const updateShowData = (newData) => {

    // const updatedInventoryData = [...inventoryData, newData]; 
    // setInventoryData(updateInventoryData);
    setShowData((prevUserData) => [...prevUserData, newData]);
    console.log(newData)
  }


  useEffect(() => {
    fetch("/oe/api/shows/retrive")
    .then(response => response.json())
        // 4. Setting *dogImage* to the image url that we received from the response above
    .then(data => setShowData(data))

    console.log(data)

  },[])

  useEffect(() => {
    fetch("/oe/api/pendingshow/retrive")
    .then(response => response.json())
    .then(data => setPendingShowData(data))

    console.log(data)

  },[])

  const data = [
    {
      show: 'Show 1',
      shipdate: '2023-06-01',
      laptop: [
        { name: 'Equipment 1' },
        { name: 'Equipment 2' }
      ]
    },
    
  ];

  return (

    <div>
    
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="SHOW MANAGEMENT" subtitle="Checked out equipment" />
        <BasicModal changeIcon={true} updateInventoryData={updateShowData}/>
      </Box>

      {/* GRID & CHARTS */}
      <div style={{marginTop:'80px'}}/>


      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px">

{showDate.map((item, index) => (
        <ShowBox
          key={index}
          showname={item.showname}
          ship={item.ship}
          address={item.address}
          equipment={item.equipment}
        />
      ))}
      
   

        
      </Box>

      <div style={{marginTop:'80px'}}/>



      {/* <Header title="PENDING PACKING" subtitle="Shows ready for packing" /> */}

      {/* <div style={{display: 'flex', justifyContent: 'flex-end',position: 'absolute'}}>
      <Importing/> 


      </div> */}
      {/* <Header style={{fontSize: '100px'}}>Pending Packing</Header> */}


      {/* <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px">
      
 
{pendingShowData.map((item, index) => (
        <PendingShowBox
          key={index}
          showName={item.showName}
          ship={item.ship}
          customerName={item.customerName}
          customerOrder={item.customerOrder}
          address={item.address}
          file={item.file}
          items={item.items}
          updateData={updateShowData}
      
          
        />
      ))}


        
      </Box> */}


    </Box>

  

    </div>
  );
};

export default Shows;
