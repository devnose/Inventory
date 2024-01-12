import React from 'react';
import DatePickerDialog from '../datePicker';

const DateHandler = ({ selected, inputValue, isPopperOpen, setIsPopperOpen, handleDaySelect, handleInputChange }) => {
  return (
    <DatePickerDialog
      selected={selected}
      inputValue={inputValue}
      isPopperOpen={isPopperOpen}
      setIsPopperOpen={setIsPopperOpen}
      handleDaySelect={handleDaySelect}
      handleInputChange={handleInputChange}
    />
  );
};

export default DateHandler;
