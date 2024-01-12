export const initializeSelections = (rows) => {
    const initialState = {};
    rows.forEach((row) => {
      initialState[row.id] = row.CustomerEmail || [];
    });
    return initialState;
  };
  