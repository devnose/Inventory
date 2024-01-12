import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid, TextField, useTheme } from '@mui/material';
import { tokens } from "../../theme";
import AddIcon from '@mui/icons-material/Add';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const BasicModal = ({ updateInventoryData }) => {
    const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [data, setData] = React.useState({})

  


  const updateData = e => {
    console.log(e.target.value)
    setData({
        ...data,
        [e.target.name]: e.target.value
    })
}

  const submit = e => {
    e.preventDefault(); 
    handleClose()

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data)
    };
    fetch('/api/Laptop/add', requestOptions)
        .then(response => response.json())
        .then(data => console.log(data));

          updateInventoryData(data);

  }; 


  return (
    <div>
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
            Add Equipment
          </Button>
        </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>


          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Equipment
          </Typography>
<form onSubmit={submit}>
          <Grid container>
     <Grid item xs={6}> 
     <TextField name='id' id="standard-basic" label="ID" variant="standard" onChange={updateData} />
          <TextField name='manufacture' id="standard-basic" label="Manufacture" variant="standard" onChange={updateData} />
          <TextField name='model' id="standard-basic" label="Model" variant="standard" onChange={updateData} />
          <TextField name='processor' id="standard-basic" label="Processor" variant="standard" onChange={updateData} />
          <TextField name='ram' id="standard-basic" label="Ram" variant="standard" onChange={updateData}/>

     </Grid>
     <Grid item xs={6}>
          <TextField name='hd' id="standard-basic" label="HD" variant="standard" onChange={updateData}/>
          <TextField name='os' id="standard-basic" label="OS" variant="standard" onChange={updateData}/>
          <TextField name='serial' id="standard-basic" label="Serial Number" variant="standard" onChange={updateData}/>
          <TextField name='status' id="standard-basic" label="Status" variant="standard" onChange={updateData}/>
          <Box>
          <Button type='submit'
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "5px 10px",
              marginTop: "15px",
              width: "170px"
              
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
      </Modal>
    </div>
  );
}

export default BasicModal; 