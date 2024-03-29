import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  colors,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import AddIcon from "@mui/icons-material/Add";
import SelectionForm from "./selectionForm";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import Header from "../../components/Header";
import Importing from "./Import";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  bgcolor: '#141b2d',
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const EditShowBox = ({ changeIcon, showName, shipDate, orderNumber, address ,updateInventoryData }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [laptopData, setLaptopData] = React.useState([]);
    const [kioskData, setKioskData] = React.useState([]);
    const [printerData, setPrinterData] = React.useState([]);
    const [tonerData, setTonerData] = React.useState([]);
    const [scannerData, setScannerData] = React.useState([]);
    const [extraData, setExtraData] = React.useState([]);

    const [data, setData] = React.useState({});
    const [page, setPage] = React.useState(false);
  
    const [id, setId] = React.useState([]);
    const [kioskId, setKioskId] = React.useState([]);
    const [printerId, setPrinterId] = React.useState({
      epsonId: [],
      bbw: [],
      hpcl: [],
      bcl: []

    }); 
    const [scannerId, setScannerId] = React.useState([]);

    var updateInventoryData ;
    var show; 

    

  React.useEffect(() => {

    //if data is already prefilled then set the data 
    if(shipDate){



    setData({
      ...data,
      ['showname']: showName,
      ['ship']: shipDate,
      ['order']: orderNumber,
      ['address']: address
    });




  }




    fetch("/oe/api/laptop/id")
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => {
        let result = data.map((a) => a.id);
        console.log(result);
        setId(result);
      });

      fetch("/oe/api/kiosk/id")
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => {
        let result = data.map((a) => a.id);
        console.log(result);
        setKioskId(result);
      });

      fetch("/oe/api/scanner/id")
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => {
        let result = data.map((a) => a.id);
        console.log(result);
        setScannerId(result);
      });

      fetch("/oe/api/printer/epson/id")
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => {
        let result = data.map((a) => a.id);
        
        setPrinterId(prevState => ({
          ...prevState,
          epsonId: result
        }))
      });

      fetch("/oe/api/printer/bbw/id")
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => {
        let result = data.map((a) => a.id);
        setPrinterId(prevState => ({
          ...prevState,
          bbw: result
        }));
      });

      fetch("/oe/api/printer/bcl/id")
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => {
        let result = data.map((a) => a.id);

        setPrinterId(prevState => ({
          ...prevState,
          bcl: result
        }));
      });

      fetch("/oe/api/printer/hpcl/id")
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => {
        let result = data.map((a) => a.id);
        
        
        setPrinterId(prevState => ({
          ...prevState,
          hpcl: result
        }));

      });




  }, []);



    const updateLaptop = (newData) => {
      // const updatedInventoryData = [...inventoryData, newData];
      // setInventoryData(updateInventoryData);
      setLaptopData(newData);
      console.log("Laptop: " + newData);
    };
  
    const updateKiosk = (newData) => {
      // const updatedInventoryData = [...inventoryData, newData];
      // setInventoryData(updateInventoryData);
      setKioskData(newData);
      console.log("Kiosk: " + newData);
    };
  
    const updatePrinter = (newData) => {
      // const updatedInventoryData = [...inventoryData, newData];
      // setInventoryData(updateInventoryData);
      setPrinterData(newData);
      console.log(newData);
    };
  
    const updateToner = (newData) => {
      // const updatedInventoryData = [...inventoryData, newData];
      // setInventoryData(updateInventoryData);
      setTonerData(newData);
      console.log(newData);
    };
  
    const updateExtra = (newData) => {
      // const updatedInventoryData = [...inventoryData, newData];
      // setInventoryData(updateInventoryData);
      setExtraData(newData);
      console.log(newData);
    };
  
    const updateScanner = (newData) => {
      // const updatedInventoryData = [...inventoryData, newData];
      // setInventoryData(updateInventoryData);
      setScannerData(newData);
      console.log(newData);
    };
  
    const nextPage = () => {
      setPage(true);
    };
  
    const updateData = (e) => {
      console.log(e.target.value);
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    };
  
    const submit = (e) => {
      e.preventDefault();
      handleClose();
      setPage(false);
  
      // console.log(laptopData);
      // console.log(printerData)
      // console.log(scannerData)
      // console.log(extraData)
      // console.log(kioskData)
      // console.log(tonerData)
  
      data.laptop = laptopData?.map((name) => ({name}));
      data.printer = printerData?.map((name) => ({name}));
      data.scanner = scannerData?.map((name) => ({name}));
      data.extra = extraData?.map((name) => ({name}));
      data.kiosk = kioskData?.map((name) => ({name}));
      data.toner = tonerData?.map((name) => ({name}));
      data.showname = showName


  
        const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
      fetch("oe/api/shows/add", requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));
  
      updateInventoryData(data);
    
  
      console.log(data);
    };
  




    return (
      <>

{changeIcon ? 
      <Box>
        <Button
          onClick={handleOpen}
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <AddIcon sx={{ mr: "10px" }} />
          ADD EQUIPMENT
        </Button>
      </Box>
 :   <IconButton onClick={handleOpen}>
 <EditOutlinedIcon
   sx={{ fontSize: "24px", color: colors.greenAccent[500] }}
 />
</IconButton> }
            <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {page ? (
          <Box sx={style}>
            <Header
              title="ADD EQUIPMENT"
              subtitle="Enter any required details"
            />


            <form onSubmit={submit}>

              <Grid container>
                <Grid item xs={6}>
                  <SelectionForm
                    id={printerId}
                    onChange={updatePrinter}
                    name={"Printers"}

                  />
                  <SelectionForm
                    id={id}
                    onChange={updateLaptop}
                    name={"Laptops"}
                  />
                  <SelectionForm
                    id={kioskId}
                    onChange={updateKiosk}
                    name={"Kiosk"}

                  />
                  <SelectionForm
                    id={scannerId}
                    onChange={updateScanner}
                    name={"Scanners"}

                  />
                  <SelectionForm
                    id={id}
                    onChange={updateToner}
                    name={"Toner"}

                  />
                  <SelectionForm
                    id={id}
                    onChange={updateExtra}
                    name={"Extra"}

                    
                  />

                  <Box>
                    <Button
                      type="submit"
                      sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "5px 10px",
                        marginTop: "15px",
                        width: "505px",
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>

            {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography> */}
          </Box>
        ) : (
          <Box sx={style}>

            <Header title="PACK SHOW" subtitle="Enter any required details" />

            <form onSubmit={submit}>
              <Grid container>
                <Grid item xs={6}>
                  <div
                    style={{
                      margin: "5px",
                      marginBottom: "10px",
                      width: "504px",
                    }}
                  >

                    <TextField
                      fullWidth="true"
                      name="showname"
                      value={showName}
                      id="standard-basic"
                      label="Show Name"
                      variant="outlined"
                      onChange={updateData}
                    />
                  </div>

                  <div
                    style={{
                      margin: "5px",
                      marginBottom: "10px",
                      width: "504px",
                    }}
                  >
                    <TextField
                      fullWidth="true"
                      name="ship"
                      id="standard-basic"
                      label="Ship Date"
                      value={shipDate}
                      variant="outlined"
                      onChange={updateData}
                    />
                  </div>


                  <div
                    style={{
                      margin: "5px",
                      marginBottom: "10px",
                      width: "504px",
                    }}
                  >
                    <TextField
                      fullWidth="true"
                      name="order"
                      id="standard-basic"
                      label="Order Number"
                      variant="outlined"
                      value={orderNumber}
                      onChange={updateData}
                    />
                  </div>

                 

                  <div
                    style={{
                      margin: "5px",
                      marginBottom: "10px",
                      width: "504px",
                    }}
                  >
                    <TextField
                      fullWidth="true"
                      name="address"
                      id="standard-basic"
                      label="Shipping Address"
                      variant="outlined"
                      value={address}
                      onChange={updateData}
                    />
                  </div>



                  <Box>
                    <Button
                      onClick={nextPage}
                      sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "5px 10px",
                        marginTop: "15px",
                        width: "505px",
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>

            {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography> */}
          </Box>
        )}

        
      </Modal>
      </>
      );
}


export default EditShowBox