import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {Box, Pagination, Stack} from '@mui/material'

const fetchData = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  console.info(data?.length)
  return data;
};

const heavyComputation = (item) => {
  const startTime = performance.now();
  // Simulating heavy computation
  for (let i = 0; i < 100000000; i++) {
    Math.sqrt(i);
  }
  const endTime = performance.now();
  console.log(`Heavy computation for item ${item.id} took ${endTime - startTime} milliseconds`);
  return `Computed details for ${item.title}`;
};

const ItemDetails = ({ item, onClick }) => {

  useEffect(() => {
    console.log('ItemDetails re-rendered');
  }, [item]);

  return (
    <div>
      <h2>{item.title}</h2>
      <p>{item.body}</p>
      <button onClick={() => onClick(item.id)}>Close</button>
    </div>
  );
};

const ItemList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const totalItems = 100; 
  const [data, setData] = useState([]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const fetchDataAndSetData = async () => {
      const newData = await fetchData();
      setData(newData);
    };
    fetchDataAndSetData();
  }, []);

  const computeDetails = useCallback(
    (item) => {
      return heavyComputation(item);
    },
    []
  );

  const handleItemClick = useCallback((itemId) => {
    setSelectedItem(data.find((item) => item.id === itemId));
  }, [data]);

  const handleClose = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <h1>Items List</h1>
      <Box>
      {
        data.slice(startIndex, endIndex).map((item) => (
          <div key={item.id} onClick={() => {
            handleItemClick(item.id)
            computeDetails(item)
          }}
          style={{
            cursor:'pointer'
          }}
          >
            {item.id} - {item.title}
          </div>
        ))
      }
      </Box>
      {selectedItem && (
        <ItemDetails item={selectedItem} onClick={handleClose} />
      )}
       <Stack spacing={2} mt={2}>
        <Pagination
          count={Math.ceil(totalItems / itemsPerPage)}
          page={currentPage}
          onChange={handleChange}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
    </Box>
  );
};

export default ItemList;
