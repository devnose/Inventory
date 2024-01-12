// DatePickerDialog.js
import { useState, useRef } from 'react';
import { format, isValid, parse } from 'date-fns';
import {  DayPicker } from 'react-day-picker';
import { usePopper } from 'react-popper';
import { IconButton, Input, colors } from '@mui/material';
import Button from "@mui/material/Button";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';

export default function DatePickerDialog({
    selected,
    inputValue,
    isPopperOpen,
    setIsPopperOpen,
    handleDaySelect,
    handleInputChange
}) {
//   const [selected, setSelected] = useState(null);
const popperRef = useRef(null);
const buttonRef = useRef(null);
const [popperElement, setPopperElement] = useState(null);
const theme = useTheme();
const colors = tokens(theme.palette.mode);


  const popper = usePopper(popperRef.current, popperElement, {
    placement: 'bottom-start',
  });

  const closePopper = () => {
    setIsPopperOpen(false);
    buttonRef.current.focus();
  };

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//     const date = parse(e.target.value, 'y-MM-dd', new Date());
//     if (isValid(date)) {
//       setSelected(date);
//     } else {
//       setSelected(undefined);
//     }
//   };

  const handleButtonClick = () => {
    setIsPopperOpen(true);
  };

  function formatDate(inputDate) {
    const [year, month, day] = inputDate.split('-');
    return `${month}-${day}-${year}`;
  }
  

//   const handleDaySelect = (date) => {
//     setSelected(date);
//     if (date) {
//       setInputValue(format(date, 'y-MM-dd'));
//       closePopper();
//     } else {
//       setInputValue('');
//     }
//   };

  return (
    <div style={{ position: 'relative' }}>
      <div ref={popperRef}>
        <div
          onChange={handleInputChange}
          style={{ fontSize: '30px' }}
        >
          <IconButton
          ref={buttonRef}
          size={'large'}
          style={{ fontWeight: 'bold', fontSize: '30px' }}
          onClick={handleButtonClick}
        >
          <CalendarMonthIcon  fontSize='30px'/>
        </IconButton> 

        <b>{formatDate(inputValue)}</b>

        
        </div>
        
      </div>
      {isPopperOpen && (
          <div
          tabIndex={-1}
          style={{
            ...popper.styles.popper,
            zIndex: 2001,
            backgroundColor: colors.primary[300], // Setting the background color to white
            borderRadius: '5px', // Rounded corners
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)', // Box shadow for elevation
          }}
          ref={setPopperElement}
          role="dialog"
          aria-label="DayPicker calendar"
        >
          <DayPicker
            mode="single"
            defaultMonth={selected}
            selected={selected}
            onSelect={handleDaySelect}
          />
          <IconButton onClick={closePopper}>Close</IconButton>
        </div>
      )}
    </div>
  );
}
