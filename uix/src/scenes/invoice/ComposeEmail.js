import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import EmailIcon from "@mui/icons-material/Email";
import Modal from "@mui/material/Modal";
import {
  Chip,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSnackbar } from "notistack";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


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
const ComposeEmail = ({ openModal, invoiceEmails, updateEmailSent }) => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [data, setData] = React.useState({});
  const [page, setPage] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [selectedEmails, setSelectedEmails] = React.useState([]);
  const [disabledEmail, setDisabledEmail] = React.useState(false); 


  const fromEmail = "accounting@kleertech.com";
  React.useEffect(() => {
    if (open) {
      console.log(invoiceEmails);
  
      fetch(`oe/api/invoice/generate/grab/${invoiceEmails.file}`)
        .then((response) => response.blob())
        .then((blob) => blob.arrayBuffer())
        .then((arrayBuffer) => {
          console.log(arrayBuffer)
          setData({
            fromid: 'accounting@kleertech.com',
            selectedEmails: selectedEmails,
            subject: 'Invoice from Kleertech',
            attachment: { name: invoiceEmails.id, attachData: invoiceEmails.file},
          });
   
        })
   
  
     

    }
  }, [open, invoiceEmails]);
  

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    bgcolor: 'background.paper',
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };


  React.useEffect(() => {
    // setDisabledEmail(invoiceEmails.sent)
  })

  function getStyles(name, selectionEmail, theme) {
    return {
      fontWeight:
        selectionEmail.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const handleEmailChange = (event) => {
    const selectedValues = event.target.value;
    setSelectedEmails(selectedValues);
    setData({
      ...data,
      ["selectedEmails"]: selectedValues,
    });
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const nextPage = () => {
    setPage(true);
  };

  const updateData = (e) => {

    console.log(e);
    setData({
      ...data,
      ['body']: e,
    });
  };

  const onsubmit = async(e) => {
    e.preventDefault();
    console.log(value.toString())

    if (selectedEmails.length === 0) {
      alert("Select Email");
    } else if (!data.body) {
      alert("Empty Mail Body");
    } else {
      
      handleClose();
      setPage(false);

      //send email backend 
      console.log(data);
      enqueueSnackbar('Sending Email '+invoiceEmails.id, { variant: 'warning' });

      try {
        const response = await fetch('/oe/api/invoice/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
      //close Modal 
  

    
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log('Email sent:', jsonResponse);
          enqueueSnackbar('Email sent successfully!', { variant: 'success' });
          updateEmailSent(invoiceEmails.name);  // Update parent component
          setDisabledEmail(true)
        } else {
          console.log('Failed to send email:', response);
        }
      } catch (error) {
        console.log('An error occurred:', error);
      }
    


    }
  };

  return (
    <>
      {openModal ? (
        <Box >
          <Button
            onClick={handleOpen}
            variant="contained"
            size="small"
            style={{ marginRight: 10, color: colors.greenAccent[500] }}
          >
            <EmailIcon />
          </Button>
        </Box>
      ) : (
        <IconButton disabled={disabledEmail} onClick={handleOpen}>
          <EmailIcon
            sx={{ fontSize: "24px", color: colors.greenAccent[500], opacity: disabledEmail ? '0.4' : '1'}}
          />
        </IconButton>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        color={"blue"}
      >
        {page ? (
          <Box sx={style}>
            <Header
              title="ADD EQUIPMENT"
              subtitle="Enter any required details"
            />
          </Box>
        ) : (
          <Box sx={style}>
            <Header title="EMAIL" subtitle="Send invoice to customer" />
            <Grid container>
              <Grid item xs={6}>
                <div
                  style={{
                    width: "300px",
                    padding: "3px",
                  }}
                >
                  <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                    From
                  </span>

                  <TextField
                    fullWidth="false"
                    name="fromid"
                    id="standard-basic"
                    label=""
                    variant="outlined"
                    size="small"
                    value={data.fromid} // use value from state
                    disabled
                  />
                </div>

                <div
                  style={{
                    width: "504px",
                    padding: "3px",
                  }}
                >
                  <div style={{ fontSize: "20px", fontWeight: "bold" }}>To</div>

                  {/* <TextField
                      fullWidth="false"
                      name="ship"
                      id="standard-basic"
                      label="Ship Date"
                      variant="outlined"
                      size='small'

                    /> */}
                  <FormControl sx={{ minWidth: 300 }} size="small">
                    <Select
                      labelId="email-selection"
                      id="email-selection"
                      value={selectedEmails}
                      multiple
                      onChange={handleEmailChange}
                      input={
                        <OutlinedInput id="select-email-chip" label="email" />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {invoiceEmails.email.map((email) => (
                        <MenuItem
                          key={email}
                          value={email}
                          style={getStyles(email, selectedEmails, theme)}
                        >
                          {email}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div
                  style={{
                    padding: "3px",

                    width: "504px",
                  }}
                >
                  <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                    Subject
                  </span>

                  <TextField
                    fullWidth="false"
                    name="subject"
                    id="standard-basic"
                    variant="outlined"
                    value={data.subject}
                    size="small"
                    onChange={updateData}
                  />
                </div>

                <div
                  style={{
                    padding: "3px",

                    width: "504px",
                  }}
                >
                  <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                    Attachments
                  </span>

                  <TextField
                    sx={{ fontStyle: colors.blueAccent[500] }}
                    fullWidth="true"
                    value={invoiceEmails.id}
                    name="attachment"
                    id="standard-basic"
                    variant="outlined"
                    size="small"
                    disabled
                  />

                  <div
                    style={{
                      marginTop: "5px",
                      width: "504px",
                    }}
                  >
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                      Mial Body
                    </span>
                    <ReactQuill
                      theme="snow"
                      name="body"
                      value={data.body}
                      onChange={updateData}
                      style={{ height: "200px" }}
                      required
                    />
                    <Button onClick={onsubmit} style={{ marginTop: "60px" }}>
                      Send Email
                    </Button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Box>
        )}
      </Modal>
    </>
  );
};

export default ComposeEmail;
