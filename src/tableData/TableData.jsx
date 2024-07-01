// import React from 'react'
// import CustomTable from'../customTable/CustomTable'

// const TableData = () => {
//     const rowData = [
//         { make: 'Tesla', model: 'Model Y', price: 64950, electric: true, month: 'June' },
//         // Add more data as needed
//       ];

//       const columnDefs = [
//         { field: 'make', checkboxSelection: true, editable: true },
//         { field: 'model' },
//         { field: 'price', filter: 'agNumberColumnFilter' },
//         { field: 'electric' },
//         { field: 'month' },
//       ];

//       const defaultColDef = {
//         filter: 'agTextColumnFilter',
//         floatingFilter: true,
//       };
    
//   return (
//     <div>
//        <div style={{ height: '100vh', width: '100%' }}>
//       <CustomTable rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} />
//     </div>
//     </div>
//   )
// }

// export default TableData

// import React from 'react';
// import CustomTable from '../customTable/CustomTable';

// const TableData = () => {
//   const rowData = [
//     { make: 'Tesla', model: 'Model Y', price: 64950, electric: true, month: 'June', action: <button onClick={() => handleButtonClick('Tesla')}>Action</button> },
//     { make: 'Toyota', model: 'Camry', price: 27925, electric: false, month: 'July', action: <button onClick={() => handleButtonClick('Toyota')}>Action</button> },
//     { make: 'Honda', model: 'Accord', price: 24970, electric: false, month: 'August', action: <button onClick={() => handleButtonClick('Honda')}>Action</button> },
//     // Add more data as needed
//   ];

//   const columnDefs = [
//     { field: 'make', checkboxSelection: true, editable: true },
//     { field: 'model' },
//     { field: 'price', filter: 'agNumberColumnFilter' },
//     { field: 'electric' },
//     { field: 'month' },
//     { headerName: 'Action', field: 'action', cellRenderer: 'actionCellRenderer', cellRendererParams: { onClick: handleButtonClick } }
//     // { headerName: 'Action', field: 'action', cellRenderer: 'actionCellRenderer', cellRendererParams: { onClick: handleButtonClick } }
//   ];

//   const defaultColDef = {
//     filter: 'agTextColumnFilter',
//     floatingFilter: true,
//   };

//   const handleButtonClick = (make) => {
//     alert(`Button clicked for ${make}`);
//     // Add your logic here for handling button click
//   };

//   return (
//     <div style={{ height: '100vh', width: '100%' }}>
//       <CustomTable rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} />
//     </div>
//   );
// };

// export default TableData;


import React from 'react';
import CustomTable from '../customTable/CustomTable';
import { Button } from 'antd'; // Import Button from Ant Design

const TableData = () => {
  const rowData = [
    { make: 'Tesla', model: 'Model Y', price: 64950, electric: true, month: 'June' },
    { make: 'Toyota', model: 'Camry', price: 27925, electric: false, month: 'July' },
    { make: 'Honda', model: 'Accord', price: 24970, electric: false, month: 'August' },
    // Add more data as needed
  ];

  const columnDefs = [
    { field: 'make', checkboxSelection: true, editable: true },
    { field: 'model' },
    { field: 'price', filter: 'agNumberColumnFilter' },
    { field: 'electric' },
    { field: 'month' },
    {
      headerName: 'Action',
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: { onClick: handleButtonClick }
    }
  ];

  const defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };

  const actionCellRenderer = (params) => {
    return (
      <Button onClick={() => handleButtonClick(params.data.make)}>
        Action
      </Button>
    );
  };

  const handleButtonClick = (make) => {
    alert(`Button clicked for ${make}`);
    // Add your logic here for handling button click
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <CustomTable rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} />
    </div>
  );
};

export default TableData;
