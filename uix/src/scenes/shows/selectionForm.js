import * as React from "react";
import Box from "@mui/material/Box";
import { Chip, FormControl, Grid, InputLabel, ListSubheader, MenuItem, OutlinedInput, Select, TextField, useTheme } from "@mui/material";


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


function getStyles(name, selectionItem, theme) {
  return {
    fontWeight:
      selectionItem.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}


const SelectionForm = ({ name, id, onChange }) => {

  console.log(id)

  const [personName, setPersonName] = React.useState([]);
  const [selectedItems, setSelectionItem] = React.useState([])
  const theme = useTheme();

  const handleChange = (event) => {
    const selectedValues = event.target.value;
    setSelectionItem(selectedValues);
    if (onChange) {
      onChange(selectedValues);
    }
  };




  



  return (
    <FormControl sx={{ m: 1, width: 500 }}>
    <InputLabel id="demo-multiple-chip-label">{name}</InputLabel>
   

      {name === "Printers" ? (
 <Select
 labelId="demo-multiple-chip-label"
 id="demo-multiple-chip"
 value={selectedItems}
 multiple
 onChange={handleChange}
 input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
 renderValue={(selected) => (
   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
     {selected.map((value) => (
       <Chip key={value} label={value} />
     ))}
   </Box>
 )}
 MenuProps={MenuProps}
>

    <ListSubheader>Epson IDs</ListSubheader>
      {id.epsonId.map((id) => (
        <MenuItem key={id} value={id} style={getStyles(id, selectedItems, theme)}>
          {id}
        </MenuItem>
      ))}

      <ListSubheader>BBW IDs</ListSubheader>
      {id.bbw.map((id) => (
        <MenuItem key={id} value={id} style={getStyles(id, selectedItems, theme)}>
          {id}
        </MenuItem>
      ))}

      <ListSubheader>HPCL IDs</ListSubheader>
      {id.hpcl.map((id) => (
        <MenuItem key={id} value={id} style={getStyles(id, selectedItems, theme)}>
          {id}
        </MenuItem>
      ))}

      <ListSubheader>BCL IDs</ListSubheader>
      {id.bcl.map((id) => (
        <MenuItem key={id} value={id} style={getStyles(id, selectedItems, theme)}>
          {id}
        </MenuItem>
      ))}

</Select>


      ) : (


        <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        value={selectedItems}
        multiple
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
       >
{id.map((name) => (
          <MenuItem
            key={name}
            value={name}
            style={getStyles(name, selectedItems, theme)}
          >
            {name}
          </MenuItem>
        ))}

        </Select>

       )}
      
  </FormControl>
  )
}

export default SelectionForm