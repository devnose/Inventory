import React, { useState } from 'react';
import { Button, IconButton, TextField, InputAdornment } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const Importing = () => {
  const [inputValue, setInputValue] = useState('');
  const [importData, setImportData] = useState({}); 

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.get('/oe/api/invoice/generate/find', {
        params: { orderNumber: inputValue }
      });

     response.status === 200 ? setImportData(response.data) : alert('Show not found'); 

    } catch (error) {
      console.error('Error sending data', error);
      // Handle error response
    }
  };

  return (
    <div style={{ marginLeft: '10px' }}>
      <TextField
        type="text"
        value={inputValue}
        placeholder='Order Import (20245123)'
        onChange={handleChange}
        className="form-control"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSubmit}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default Importing;
