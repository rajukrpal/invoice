// import React, { useState } from 'react';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import './App.css';

// function Testing() {
//   const [billno, setBillno] = useState('');
//   const [discount, setDiscount] = useState('');
//   const [product, setProduct] = useState('');
//   const [price, setPrice] = useState('');
//   const [image, setImage] = useState(null);
  
//   const handleDownloadPdf = () => {
//     // Create a container div for the bill content
//     const container = document.createElement('div');
//     container.className = "bg-white p-4 rounded shadow-md";
//     container.style.position = "absolute";
//     container.style.left = "-9999px"; // Move the container off-screen
//     container.style.width = "210mm"; // Set the container width to A4 width in mm
//     container.style.padding = "20mm"; // Add padding for margins in mm
  
//     // Create the bill receipt content
//     const billContent = document.createElement('div');
//     billContent.id = "bill";
//     billContent.innerHTML = `
//       <h2 class="text-xl font-semibold mb-4">Bill Receipt</h2>
//       ${image ? `<div class="mb-4"><img src="${image}" alt="Uploaded" class="w-32 h-32 object-cover mb-4" /></div>` : ''}
//       <table class="min-w-full border-collapse mb-4">
//         <thead>
//           <tr class="border border-gray-300">
//             <th class="bg-gray-200 p-2 text-left border border-gray-300">Product</th>
//             <th class="bg-gray-200 p-2 text-left border border-gray-300">Discount</th>
//             <th class="bg-gray-200 p-2 text-left border border-gray-300">Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr class="border border-gray-300">
//             <td class="p-2 border border-gray-300">${product}</td>
//             <td class="p-2 border border-gray-300">${discount}</td>
//             <td class="p-2 border border-gray-300">$${price}</td>
//           </tr>
//         </tbody>
//       </table>
//     `;
    
//     // Append the bill content to the container
//     container.appendChild(billContent);
    
//     // Append the container to the document body
//     document.body.appendChild(container);
    
//     // Create PDF from the container
//     html2canvas(container)
//       .then((canvas) => {
//         const imgData = canvas.toDataURL('image/png');
//         const pdf = new jsPDF('p', 'mm', 'a4');
//         pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
        
//         // Open PDF in new tab or window
//         pdf.output('dataurlnewwindow');
//         // pdf.output('dataurl')
        
//         // Remove the container from the document body
//         document.body.removeChild(container);
//       });
//   };
  

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImage(e.target.result);
//       };
//       reader.readAsDataURL(e.target.files[0]);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Billing Form</h1>
//       <form onSubmit={(e) => e.preventDefault()} className="space-y-4 mb-4">
//         <div className="flex flex-col">
//           <label className="mb-1">Bill No:</label>
//           <input
//             type="text"
//             value={billno}
//             onChange={(e) => setBillno(e.target.value)}
//             className="p-2 border border-gray-300 rounded"
//             required
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="mb-1">Discount:</label>
//           <input
//             type="text"
//             value={discount}
//             onChange={(e) => setDiscount(e.target.value)}
//             className="p-2 border border-gray-300 rounded"
//             required
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="mb-1">Product:</label>
//           <input
//             type="text"
//             value={product}
//             onChange={(e) => setProduct(e.target.value)}
//             className="p-2 border border-gray-300 rounded"
//             required
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="mb-1">Price:</label>
//           <input
//             type="number"
//             step="0.01"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             className="p-2 border border-gray-300 rounded"
//             required
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="mb-1">Upload Image:</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="p-2 border border-gray-300 rounded"
//           />
//         </div>
//         <button onClick={handleDownloadPdf} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Download PDF</button>
//       </form>
//     </div>
//   );
// }

// export default Testing;









import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

// Custom styled components for different switch styles
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));



export default function Testing() {
  return (
    <FormGroup>
      <FormControlLabel
        control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
        label="MUI switch"
      />
    </FormGroup>
  );
}







