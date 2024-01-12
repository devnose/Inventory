import React, { useEffect, useState } from "react";
import Creatable from "react-select/creatable";



const RenderEmailCell = ({
  params,
  emailSelections,
  setEmailSelections,  // Corrected the typo here
  inventoryData,
  selectedData,
  customStyles
}) => {

  


  const handleChange = (newValue, action) => {
    console.log(action);
    switch (action.type) {
      case 'remove-value':
      case 'pop-value':
      case 'deselect-option':
        setEmailSelections(prevSelections => {
          console.log('prevSelections', prevSelections);  // Log the previous selections
          const updatedSelections = { ...prevSelections };
          updatedSelections[params.row.id] = newValue ? newValue.map(option => option.value) : [];
          console.log('updatedSelections', updatedSelections);  // Log the updated selections
          return updatedSelections;
        });
        break;
      default:
        setEmailSelections(prevSelections => {
          const updatedSelections = { ...prevSelections };
          updatedSelections[params.row.id] = newValue.map(option => option.value);
          return updatedSelections;
        });
        break;
    }
    console.log('newValue', newValue);  // Log the new value
  };
  

  const emailPreSelect = () => {
    const emailsById = emailSelections[params.row.id] || [];
    const uniqueEmails = Array.from(new Set(emailsById));  // Remove duplicates
    const limitedEmails = uniqueEmails.slice(0, 2);
    const emailObjects = limitedEmails.map((email) => ({
      value: email,
      label: email,
    }));
  
    return emailObjects.length === 1 ? emailObjects[0] : emailObjects;
  };
  

  const selection = emailPreSelect();

  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue };
    const selectedRows = inventoryData.filter((row) => params.id === row.id);

    // Update the emailSelections state
    setEmailSelections((prevSelections) => {
      const updatedSelections = { ...prevSelections };
      if (!updatedSelections[params.row.id]) {
        updatedSelections[params.row.id] = [];
      }
      updatedSelections[params.row.id].push(newOption.value);
      return updatedSelections;
    });

    // Update the selectedRows
    selectedRows[0].CustomerEmail = [
      ...selectedRows[0].CustomerEmail,
      newOption.value,
    ];
  };

  

  return (
    <div style={{ width: "100%" }}>
      <Creatable
        isMulti
        placeholder={"Add new email"}
        defaultValue={selection}
        value={selection}
        styles={customStyles}
        onChange={handleChange}  // Added the onChange prop here
        onCreateOption={handleCreate}
        components={{ DropdownIndicator: () => null }}
      />
    </div>
  );
};



export default RenderEmailCell;

// import React, { useEffect, useState } from 'react';
// import Creatable from 'react-select/creatable';

// const RenderEmailCell = ({ params, emailSelections, setEmailSelections, formattedEmailSelections, inventoryData, selectedData }) => {

//   // State variable to force re-render
//   const [forceUpdate, setForceUpdate] = useState(0);

//   const getFormattedEmailsForCurrentRow = () => {
//     return formattedEmailSelections[params.row.id] || [];
//   };

//   const [localSelections, setLocalSelections] = useState(getFormattedEmailsForCurrentRow());

//   useEffect(() => {
//     const newLocalSelections = getFormattedEmailsForCurrentRow();
//     setLocalSelections(newLocalSelections);
//     console.log(newLocalSelections);
//   }, [formattedEmailSelections, forceUpdate]); // Added forceUpdate as a dependency

//   const handleCreate = (inputValue) => {
//     const newOption = { value: inputValue.toLowerCase(), label: inputValue };

//     if (params && params.row && params.row.id != null) {
//       const currentEmails = emailSelections[params.row.id] || [];
//       const updatedEmails = [...currentEmails, inputValue.toLowerCase()];

//       setEmailSelections({
//         ...emailSelections,
//         [params.row.id]: updatedEmails
//       });

//       const updatedLocalSelections = [...localSelections, newOption];
//       setLocalSelections(updatedLocalSelections);

//       // Force a re-render
//       setForceUpdate(prev => prev + 1);
//     }
//   };

//   const customStyles = {
//     control: base => ({
//       ...base,
//       background: 'transparent',
//       border: 'none',
//       boxShadow: 'none',
//       width: '100%'
//     })
//   };

//   return (
//     <div style={{ width: '100%' }}>
//       <Creatable
//         isMulti
//         placeholder={'Add new email'}
//         options={localSelections}
//         defaultValue={localSelections}
//         styles={customStyles}
//         onCreateOption={handleCreate}
//         components={{ DropdownIndicator: () => null }}
//       />
//     </div>
//   );
// };

// export default RenderEmailCell;
