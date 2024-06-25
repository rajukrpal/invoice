import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css';

function Testing() {
  const [billno, setBillno] = useState('');
  const [discount, setDiscount] = useState('');
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  // const handleDownloadPdf = () => {
  //   // Create a container div for the bill content
  //   const container = document.createElement('div');
  //   container.className = "bg-white p-4 rounded shadow-md";
  //   container.style.position = "absolute";
  //   container.style.left = "-9999px"; // Move the container off-screen
  //   container.style.width = "210mm"; // Set the container width to A4 width in mm
  //   container.style.padding = "20mm"; // Add padding for margins in mm

  //   // Create the bill receipt content
  //   const billContent = document.createElement('div');
  //   billContent.id = "bill";
  //   billContent.innerHTML = `
  //     <h2 class="text-xl font-semibold mb-4">Bill Receipt</h2>
  //     ${image ? `<div class="mb-4"><img src="${image}" alt="Uploaded" class="w-32 h-32 object-cover mb-4" /></div>` : ''}
  //     <table class="min-w-full border-collapse mb-4">
  //       <thead>
  //         <tr class="border border-gray-300">
  //           <th class="bg-gray-200 p-2 text-left border border-gray-300">Product</th>
  //           <th class="bg-gray-200 p-2 text-left border border-gray-300">Discount</th>
  //           <th class="bg-gray-200 p-2 text-left border border-gray-300">Price</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         <tr class="border border-gray-300">
  //           <td class="p-2 border border-gray-300">${product}</td>
  //           <td class="p-2 border border-gray-300">${discount}</td>
  //           <td class="p-2 border border-gray-300">$${price}</td>
  //         </tr>
  //       </tbody>
  //     </table>
  //   `;

    
  //   // Append the bill content to the container
  //   container.appendChild(billContent);
    
  //   // Append the container to the document body
  //   document.body.appendChild(container);
    
  //   // Create PDF from the container
  //   html2canvas(container)
  //     .then((canvas) => {
  //       const imgData = canvas.toDataURL('image/png');
  //       const pdf = new jsPDF('p', 'mm', 'a4');
  //       pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
  //       pdf.save('bill.pdf');
        
  //       // Remove the container from the document body
  //       document.body.removeChild(container);
  //     });
  // };

  
  const handleDownloadPdf = () => {
    // Create a container div for the bill content
    const container = document.createElement('div');
    container.className = "bg-white p-4 rounded shadow-md";
    container.style.position = "absolute";
    container.style.left = "-9999px"; // Move the container off-screen
    container.style.width = "210mm"; // Set the container width to A4 width in mm
    container.style.padding = "20mm"; // Add padding for margins in mm
  
    // Create the bill receipt content
    const billContent = document.createElement('div');
    billContent.id = "bill";
    billContent.innerHTML = `
      <h2 class="text-xl font-semibold mb-4">Bill Receipt</h2>
      ${image ? `<div class="mb-4"><img src="${image}" alt="Uploaded" class="w-32 h-32 object-cover mb-4" /></div>` : ''}
      <table class="min-w-full border-collapse mb-4">
        <thead>
          <tr class="border border-gray-300">
            <th class="bg-gray-200 p-2 text-left border border-gray-300">Product</th>
            <th class="bg-gray-200 p-2 text-left border border-gray-300">Discount</th>
            <th class="bg-gray-200 p-2 text-left border border-gray-300">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border border-gray-300">
            <td class="p-2 border border-gray-300">${product}</td>
            <td class="p-2 border border-gray-300">${discount}</td>
            <td class="p-2 border border-gray-300">$${price}</td>
          </tr>
        </tbody>
      </table>
    `;
    
    // Append the bill content to the container
    container.appendChild(billContent);
    
    // Append the container to the document body
    document.body.appendChild(container);
    
    // Create PDF from the container
    html2canvas(container)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
        
        // Open PDF in new tab or window
        pdf.output('dataurlnewwindow');
        // pdf.output('dataurl')
        
        // Remove the container from the document body
        document.body.removeChild(container);
      });
  };
  

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Billing Form</h1>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4 mb-4">
        <div className="flex flex-col">
          <label className="mb-1">Bill No:</label>
          <input
            type="text"
            value={billno}
            onChange={(e) => setBillno(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Discount:</label>
          <input
            type="text"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Product:</label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Price:</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <button onClick={handleDownloadPdf} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Download PDF</button>
      </form>
    </div>
  );
}

export default Testing;












