import { useState, useEffect } from 'react';

const calculateRange = (tableData, numRows) => {
  const range = [];
  const num = Math.ceil(tableData.length / numRows);
  for (let i = 1; i <= num; i += 1) {
    range.push(i);
  }
  return range;
};

// eslint-disable-next-line max-len
const sliceRows = (tableData, page, numRows) => tableData.slice((page - 1) * numRows, page * numRows);

const useTable = (tableData, page, numRows) => {
  // eslint-disable-next-line no-unused-vars
  const [tableRange, setTableRange] = useState([]);
  const [slice, setSlice] = useState([]);

  useEffect(() => {
    const range = calculateRange(tableData, numRows);
    setTableRange([...range]);

    const singleslice = sliceRows(tableData, page, numRows);
    setSlice([...singleslice]);
  }, [tableData, setTableRange, page, setSlice, numRows]);
  console.log(slice);
  return { slice };
};

export default useTable;
