// CustomTable.jsx

// import React, { useMemo } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import NavBar from '../navBar/NavBar';

// const CustomTable = ({ rowData, columnDefs, defaultColDef }) => {
//   // Memoize the defaultColDef to prevent unnecessary re-renders
//   const memoizedDefaultColDef = useMemo(() => defaultColDef, [defaultColDef]);

//   return (
//     <>
//     <NavBar />
//     <div className='bg-black text-white'>raju</div>

//     <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
//       <AgGridReact
//         rowData={rowData}
//         columnDefs={columnDefs}
//         defaultColDef={memoizedDefaultColDef}
//         rowSelection="multiple"
//         suppressRowClickSelection={true}
//         pagination={true}
//         paginationPageSize={10}
//         paginationPageSizeSelector={[10, 25, 50]}
//       />
//     </div>
//     </>
//   );
// };

// export default CustomTable;


import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import NavBar from '../navBar/NavBar';
import { useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const MyCellComponent = p =>{
    return(
        <>
        <div className='space-x-2'>
        <button className='bg-gray-400 p-1' onClick={()=>window.alert("open")}> + open </button>
        {p.value}
        <button className='bg-gray-400 p-1' onClick={()=>window.alert("close")}> + close </button>
        {p.value}
        <button className='bg-gray-400 p-1' onClick={()=>window.alert("edit")}> + edit </button>
        {p.value}
        </div>
        </>
    )
}

const CustomTable = () => {
    const navigate = useNavigate();
  const [saveInvoiceGetFirebase, setSaveInvoiceGetFirebase] = useState([]);

  let pcId = localStorage.getItem("pcId");
  if (!pcId) {
    pcId = generateUniqueId();
    localStorage.setItem("pcId", pcId);
  }

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 8); //  2.82 trillion
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      if (pcId) {
        try {
          // Fetch invoices from Firebase that match the pcId
          const querySnapshot = await getDocs(collection(db, "invoices"));
          const fetchedInvoices = [];

          querySnapshot.forEach((doc) => {
            const invoiceData = doc.data();
            if (invoiceData.pcId === pcId) {
              fetchedInvoices.push({ ...invoiceData, uid: doc.id });
            }
          });

          // Update local state with matching invoices
          setSaveInvoiceGetFirebase(fetchedInvoices);

          // Store matching invoices in localStorage
          localStorage.setItem("saveInvoice", JSON.stringify(fetchedInvoices));
        } catch (error) {
          console.error("Error fetching invoices:", error);
        }
      }
    };

    fetchInvoices();
  }, [pcId]);


  const handleOpenAndEdit =(item) =>{
    console.log("handleOpenAndEdit",item)
    navigate("/",{state: {
      discounts : item.discounts,
      dueDate:item.dueDate,
      footNote:item.footNote,
      idNum:item.idNum,
      image:item.image,
      invoice:item.invoice,
      invoiceDate:item.invoiceDate,
      invoiceFrom:item.invoiceFrom,
      invoiceTo:item.invoiceTo,
      itemValue:item.itemValue,
      pcId:item.pcId,
      rows:item.rows,
      shipping:item.shipping,
      termsAndConditions:item.termsAndConditions,
      uid:item.uid,
    }})
  }


  const handleDownloadPdf = (item) => {
    // Create a container div for the bill content
    const container = document.createElement("div");
    container.className = "bg-white p-4";
    container.style.position = "absolute";
    container.style.left = "-9999px"; // Move the container off-screen
    container.style.width = "250mm"; // Set the container width to A4 width in mm
    container.style.padding = "10mm"; // Add padding for margins in mm

    // Create the bill receipt content dynamically based on `item`
    const {
      idNum,
      image,
      invoice,
      invoiceDate,
      dueDate,
      invoiceFrom,
      invoiceTo,
      rows,
      termsAndConditions,
      itemValue,
      discounts,
      shipping,
    } = item;

    const billContent = document.createElement("div");
    billContent.id = "bill";
    billContent.innerHTML = `
         <div class="">
         <div class="grid grid-cols-12 justify-between">
           <div class="col-span-6">
             ${
               image
                 ? `<div class="mb-4"><img src="${image}" alt="Uploaded" class="w-32 h-32 object-cover mb-4" /></div>`
                 : ""
             }
           </div>
           <div class="col-span-6 mb-20">
             <div class=" flex justify-end ">
               <div>
                 <h2 class="text-xl font-semibold ">${invoice} #${idNum}</h2>
                <h2 class="">Invoice Date: ${invoiceDate}</h2>
                <h2 class="">Due Date: ${dueDate}</h2>
              </div>
            </div>
          </div>
         </div>
  
        <table class="mb-10 w-full">
          <thead>
            <tr>
              <th class="border border-gray-300 p-1 pb-5">Bill From</th>
              <th class="border border-gray-300 p-1 pb-5">Bill To</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 p-1 pb-5">${invoiceFrom}</td>
              <td class="border border-gray-300 p-1 pb-5">${invoiceTo}</td>
            </tr>
          </tbody>
        </table>
  
        <table class="min-w-full border-collapse mb-10">
          <thead>
            <tr class="border border-gray-300">
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">#</th>
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Item</th>
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Quantity</th>
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Rate (INR)</th>
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">GST</th>
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
                  <tr class="border border-gray-300">
                    <td class="p-1 pb-5 border border-gray-300">${row.id}</td>
                    <td class="p-1 pb-5 border border-gray-300">${row.item}</td>
                    <td class="p-1 pb-5 border border-gray-300">${row.quantity}</td>
                    <td class="p-1 pb-5 border border-gray-300">${row.rate}</td>
                    <td class="p-1 pb-5 border border-gray-300">${row.gst}<span class="pl-1"> % </span></td>
                    <td class="p-1 pb-5 border border-gray-300">${row.amount}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
  
        <div class="grid grid-cols-12 justify-between">
          <div class="col-span-8">
            <p>${termsAndConditions}</p>
          </div>
          <div class="col-span-4">
            <div class=" p-4 ">
              <div class="flex justify-between mb-4">
                <div class="flex flex-col">
                  <h1 class="p-1">Subtotal</h1>
                  <h1 class="p-1">Discounts</h1>
                  <h1 class="p-1">Shipping</h1>
                  <h1 class="font-bold p-1">Total (INR)</h1>
                </div>
                <div class="flex flex-col text-right">
                  <span class="p-1">${itemValue}</span>
                  <span class="p-1">${discounts}</span>
                  <span class="p-1">${shipping}</span>
                  <span class="p-1">${(
                    parseFloat(itemValue) -
                    parseFloat(discounts) +
                    parseFloat(shipping)
                  ).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
      </div>
    `;

    // Append the bill content to the container
    container.appendChild(billContent);

    // Append the container to the document body
    document.body.appendChild(container);

    // Create PDF from the container
    html2canvas(container).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("invoice.pdf");

      // Remove the container from the document body
      document.body.removeChild(container);
    });
  };

  const handleOpenPdf = (item) => {
    console.log("item", item);
    // Create a container div for the bill content
    const container = document.createElement("div");
    container.className = "bg-white p-4";
    container.style.position = "absolute";
    container.style.left = "-9999px"; // Move the container off-screen
    container.style.width = "250mm"; // Set the container width to A4 width in mm
    container.style.padding = "10mm"; // Add padding for margins in mm

    // Create the bill receipt content dynamically based on `item`
    const {
      idNum,
      image,
      invoice,
      invoiceDate,
      dueDate,
      invoiceFrom,
      invoiceTo,
      rows,
      termsAndConditions,
      itemValue,
      discounts,
      shipping,
    } = item;

    const billContent = document.createElement("div");
    billContent.id = "bill";
    billContent.innerHTML = `
         <div class="">
         <div class="grid grid-cols-12 justify-between">
           <div class="col-span-6">
             ${
               image
                 ? `<div class="mb-4"><img src="${image}" alt="Uploaded" class="w-32 h-32 object-cover mb-4" /></div>`
                 : ""
             }
           </div>
           <div class="col-span-6 mb-20">
             <div class=" flex justify-end ">
               <div>
                 <h2 class="text-xl font-semibold ">${invoice} #${idNum}</h2>
                <h2 class="">Invoice Date: ${invoiceDate}</h2>
                <h2 class="">Due Date: ${dueDate}</h2>
              </div>
            </div>
          </div>
         </div>
  
        <table class="mb-10 w-full">
          <thead>
            <tr>
              <th class="border border-gray-300 p-1 pb-5">Bill From</th>
              <th class="border border-gray-300 p-1 pb-5">Bill To</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 p-1 pb-5">${invoiceFrom}</td>
              <td class="border border-gray-300 p-1 pb-5">${invoiceTo}</td>
            </tr>
          </tbody>
        </table>
  
        <table class="min-w-full border-collapse mb-10">
          <thead>
            <tr class="border border-gray-300">
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">#</th>
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Item</th>
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Quantity</th>
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Rate (INR)</th>
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">GST</th>
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
                  <tr class="border border-gray-300">
                    <td class="p-1 pb-5 border border-gray-300">${row.id}</td>
                    <td class="p-1 pb-5 border border-gray-300">${row.item}</td>
                    <td class="p-1 pb-5 border border-gray-300">${row.quantity}</td>
                    <td class="p-1 pb-5 border border-gray-300">${row.rate}</td>
                    <td class="p-1 pb-5 border border-gray-300">${row.gst}<span class="pl-1"> % </span></td>
                    <td class="p-1 pb-5 border border-gray-300">${row.amount}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
  
        <div class="grid grid-cols-12 justify-between">
          <div class="col-span-8">
            <p>${termsAndConditions}</p>
          </div>
          <div class="col-span-4">
            <div class=" p-4 ">
              <div class="flex justify-between mb-4">
                <div class="flex flex-col">
                  <h1 class="p-1">Subtotal</h1>
                  <h1 class="p-1">Discounts</h1>
                  <h1 class="p-1">Shipping</h1>
                  <h1 class="font-bold p-1">Total (INR)</h1>
                </div>
                <div class="flex flex-col text-right">
                  <span class="p-1">${itemValue}</span>
                  <span class="p-1">${discounts}</span>
                  <span class="p-1">${shipping}</span>
                  <span class="p-1">${(
                    parseFloat(itemValue) -
                    parseFloat(discounts) +
                    parseFloat(shipping)
                  ).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
      </div>
    `;

    // Append the bill content to the container
    container.appendChild(billContent);

    // Append the container to the document body
    document.body.appendChild(container);

    // Create PDF from the container
    html2canvas(container).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);

      // Save PDF
      const blob = pdf.output("blob");

      // Convert blob to URL
      const blobUrl = URL.createObjectURL(blob);

      // Open PDF in a new tab
      window.open(blobUrl, "_blank");

      // Remove the container from the document body
      document.body.removeChild(container);
    });
  };

  const handlePrintPdf = (item) => {
    console.log("item", item);
    // Create a container div for the bill content
    const container = document.createElement("div");
    container.className = "bg-white p-4";
    container.style.position = "absolute";
    container.style.left = "-9999px"; // Move the container off-screen
    container.style.width = "250mm"; // Set the container width to A4 width in mm
    container.style.padding = "10mm"; // Add padding for margins in mm

    // Create the bill receipt content dynamically based on `item`
    const {
      idNum,
      image,
      invoice,
      invoiceDate,
      dueDate,
      invoiceFrom,
      invoiceTo,
      rows,
      termsAndConditions,
      itemValue,
      discounts,
      shipping,
    } = item;

    const billContent = document.createElement("div");
    billContent.id = "bill";
    billContent.innerHTML = `
         <div class="">
         <div class="grid grid-cols-12 justify-between">
           <div class="col-span-6">
             ${
               image
                 ? `<div class="mb-4"><img src="${image}" alt="Uploaded" class="w-32 h-32 object-cover mb-4" /></div>`
                 : ""
             }
           </div>
           <div class="col-span-6 mb-20">
             <div class=" flex justify-end ">
               <div>
                 <h2 class="text-xl font-semibold ">${invoice} #${idNum}</h2>
                <h2 class="">Invoice Date: ${invoiceDate}</h2>
                <h2 class="">Due Date: ${dueDate}</h2>
              </div>
            </div>
          </div>
         </div>
  
        <table class="mb-10 w-full">
          <thead>
            <tr>
              <th class="border border-gray-300 p-1 pb-5">Bill From</th>
              <th class="border border-gray-300 p-1 pb-5">Bill To</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 p-1 pb-5">${invoiceFrom}</td>
              <td class="border border-gray-300 p-1 pb-5">${invoiceTo}</td>
            </tr>
          </tbody>
        </table>
  
        <table class="min-w-full border-collapse mb-10">
          <thead>
            <tr class="border border-gray-300">
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">#</th>
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Item</th>
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Quantity</th>
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Rate (INR)</th>
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">GST</th>
              <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
                  <tr class="border border-gray-300">
                    <td class="p-1 pb-5 border border-gray-300">${row.id}</td>
                    <td class="p-1 pb-5 border border-gray-300">${row.item}</td>
                    <td class="p-1 pb-5 border border-gray-300">${row.quantity}</td>
                    <td class="p-1 pb-5 border border-gray-300">${row.rate}</td>
                    <td class="p-1 pb-5 border border-gray-300">${row.gst}<span class="pl-1"> % </span></td>
                    <td class="p-1 pb-5 border border-gray-300">${row.amount}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
  
        <div class="grid grid-cols-12 justify-between">
          <div class="col-span-8">
            <p>${termsAndConditions}</p>
          </div>
          <div class="col-span-4">
            <div class=" p-4 ">
              <div class="flex justify-between mb-4">
                <div class="flex flex-col">
                  <h1 class="p-1">Subtotal</h1>
                  <h1 class="p-1">Discounts</h1>
                  <h1 class="p-1">Shipping</h1>
                  <h1 class="font-bold p-1">Total (INR)</h1>
                </div>
                <div class="flex flex-col text-right">
                  <span class="p-1">${itemValue}</span>
                  <span class="p-1">${discounts}</span>
                  <span class="p-1">${shipping}</span>
                  <span class="p-1">${(
                    parseFloat(itemValue) -
                    parseFloat(discounts) +
                    parseFloat(shipping)
                  ).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
      </div>
    `;

    // Append the bill content to the container
    container.appendChild(billContent);

    // Append the container to the document body
    document.body.appendChild(container);

    // Create PDF from the container
    html2canvas(container).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);

      // Open PDF in a new tab and print it
      const pdfUrl = pdf.output("bloburl");
      const printWindow = window.open(pdfUrl, "_blank");

      // Print PDF when window is loaded
      printWindow.onload = function () {
        printWindow.print();
      };

      // Remove the container from the document body
      document.body.removeChild(container);
    });
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      // console.log("Deleting invoice with ID: ", invoiceId);

      // Delete invoice from Firestore
      await deleteDoc(doc(db, "invoices", invoiceId));
      // console.log("Invoice deleted successfully");

      // Update saveInvoice state to remove the deleted invoice
      setSaveInvoiceGetFirebase((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice.uid !== invoiceId)
      );
    } catch (error) {
      console.error("Error deleting invoice: ", error);
    }
  };









const [rowData,setRowData] = useState([
    {InvoiceNo:saveInvoiceGetFirebase.map((item)=>(
        <>
        {item.idNum}
        {/* <td>{console.log("item",item)}</td> */}
        </>
    )),InvoiceDate:"01-07-2024" ,DueDate:"01-07-2024",Currency:"INR" ,InvoiceTo:"InvoiceTo",Action:""},
   
])

const [colDefs,setColDefs] = useState([
    {field:"InvoiceNo",
        // headerName:"campany"
    },
    {field:"InvoiceDate"},
    {field:"DueDate"},
    {field:"Currency"},
    {field:"InvoiceTo"},
   
    {field:"Action",
        cellRenderer:MyCellComponent
    },

])
  return (
    <>
    <NavBar />
    {/* <div className='bg-black text-white'>raju</div> */}

    <div className="ag-theme-alpine" style={{ height: '500px'}}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        // defaultColDef={memoizedDefaultColDef}
        rowSelection="multiple"
        suppressRowClickSelection={true}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
      />
    </div>
    </>
  );
};

export default CustomTable;






