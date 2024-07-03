// /* eslint-disable react/prop-types */
// import React, { useState, useEffect } from "react";
// import NavBar from "../navBar/NavBar";
// import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
// import { db } from "../firebase/firebase";
// import { Button } from "@mui/material";
// import { BsDownload } from "react-icons/bs";
// import { FaRegFilePdf } from "react-icons/fa";
// import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { AiFillPrinter } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";

// const Invoice = ({ darkMode, toggleDarkMode }) => {
//   const navigate = useNavigate();
//   const [saveInvoiceGetFirebase, setSaveInvoiceGetFirebase] = useState([]);

//   let pcId = localStorage.getItem("pcId");
//   if (!pcId) {
//     pcId = generateUniqueId();
//     localStorage.setItem("pcId", pcId);
//   }

//   const generateUniqueId = () => {
//     return Math.random().toString(36).substr(2, 8); //  2.82 trillion
//   };

//   useEffect(() => {
//     const fetchInvoices = async () => {
//       if (pcId) {
//         try {
//           // Fetch invoices from Firebase that match the pcId
//           const querySnapshot = await getDocs(collection(db, "invoices"));
//           const fetchedInvoices = [];

//           querySnapshot.forEach((doc) => {
//             const invoiceData = doc.data();
//             if (invoiceData.pcId === pcId) {
//               fetchedInvoices.push({ ...invoiceData, uid: doc.id });
//             }
//           });

//           // Update local state with matching invoices
//           setSaveInvoiceGetFirebase(fetchedInvoices);

//           // Store matching invoices in localStorage
//           localStorage.setItem("saveInvoice", JSON.stringify(fetchedInvoices));
//         } catch (error) {
//           console.error("Error fetching invoices:", error);
//         }
//       }
//     };

//     fetchInvoices();
//   }, [pcId]);

//   const handleOpenAndEdit =(item) =>{
//     console.log("handleOpenAndEdit",item)
//     navigate("/",{state: {
//       discounts : item.discounts,
//       dueDate:item.dueDate,
//       footNote:item.footNote,
//       idNum:item.idNum,
//       image:item.image,
//       invoice:item.invoice,
//       invoiceDate:item.invoiceDate,
//       invoiceFrom:item.invoiceFrom,
//       invoiceTo:item.invoiceTo,
//       itemValue:item.itemValue,
//       pcId:item.pcId,
//       rows:item.rows,
//       shipping:item.shipping,
//       termsAndConditions:item.termsAndConditions,
//       uid:item.uid,
//     }})
//   }

//   const handleDownloadPdf = (item) => {
//     // Create a container div for the bill content
//     const container = document.createElement("div");
//     container.className = "bg-white p-4";
//     container.style.position = "absolute";
//     container.style.left = "-9999px"; // Move the container off-screen
//     container.style.width = "250mm"; // Set the container width to A4 width in mm
//     container.style.padding = "10mm"; // Add padding for margins in mm

//     // Create the bill receipt content dynamically based on `item`
//     const {
//       idNum,
//       image,
//       invoice,
//       invoiceDate,
//       dueDate,
//       invoiceFrom,
//       invoiceTo,
//       rows,
//       termsAndConditions,
//       itemValue,
//       discounts,
//       shipping,
//     } = item;

//     const billContent = document.createElement("div");
//     billContent.id = "bill";
//     billContent.innerHTML = `
//          <div class="">
//          <div class="grid grid-cols-12 justify-between">
//            <div class="col-span-6">
//              ${
//                image
//                  ? `<div class="mb-4"><img src="${image}" alt="Uploaded" class="w-32 h-32 object-cover mb-4" /></div>`
//                  : ""
//              }
//            </div>
//            <div class="col-span-6 mb-20">
//              <div class=" flex justify-end ">
//                <div>
//                  <h2 class="text-xl font-semibold ">${invoice} #${idNum}</h2>
//                 <h2 class="">Invoice Date: ${invoiceDate}</h2>
//                 <h2 class="">Due Date: ${dueDate}</h2>
//               </div>
//             </div>
//           </div>
//          </div>

//         <table class="mb-10 w-full">
//           <thead>
//             <tr>
//               <th class="border border-gray-300 p-1 pb-5">Bill From</th>
//               <th class="border border-gray-300 p-1 pb-5">Bill To</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td class="border border-gray-300 p-1 pb-5">${invoiceFrom}</td>
//               <td class="border border-gray-300 p-1 pb-5">${invoiceTo}</td>
//             </tr>
//           </tbody>
//         </table>

//         <table class="min-w-full border-collapse mb-10">
//           <thead>
//             <tr class="border border-gray-300">
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">#</th>
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Item</th>
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Quantity</th>
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Rate (INR)</th>
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">GST</th>
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Amount (INR)</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${rows
//               .map(
//                 (row) => `
//                   <tr class="border border-gray-300">
//                     <td class="p-1 pb-5 border border-gray-300">${row.id}</td>
//                     <td class="p-1 pb-5 border border-gray-300">${row.item}</td>
//                     <td class="p-1 pb-5 border border-gray-300">${row.quantity}</td>
//                     <td class="p-1 pb-5 border border-gray-300">${row.rate}</td>
//                     <td class="p-1 pb-5 border border-gray-300">${row.gst}<span class="pl-1"> % </span></td>
//                     <td class="p-1 pb-5 border border-gray-300">${row.amount}</td>
//                   </tr>
//                 `
//               )
//               .join("")}
//           </tbody>
//         </table>

//         <div class="grid grid-cols-12 justify-between">
//           <div class="col-span-8">
//             <p>${termsAndConditions}</p>
//           </div>
//           <div class="col-span-4">
//             <div class=" p-4 ">
//               <div class="flex justify-between mb-4">
//                 <div class="flex flex-col">
//                   <h1 class="p-1">Subtotal</h1>
//                   <h1 class="p-1">Discounts</h1>
//                   <h1 class="p-1">Shipping</h1>
//                   <h1 class="font-bold p-1">Total (INR)</h1>
//                 </div>
//                 <div class="flex flex-col text-right">
//                   <span class="p-1">${itemValue}</span>
//                   <span class="p-1">${discounts}</span>
//                   <span class="p-1">${shipping}</span>
//                   <span class="p-1">${(
//                     parseFloat(itemValue) -
//                     parseFloat(discounts) +
//                     parseFloat(shipping)
//                   ).toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     `;

//     // Append the bill content to the container
//     container.appendChild(billContent);

//     // Append the container to the document body
//     document.body.appendChild(container);

//     // Create PDF from the container
//     html2canvas(container).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
//       pdf.save("invoice.pdf");

//       // Remove the container from the document body
//       document.body.removeChild(container);
//     });
//   };

//   const handleOpenPdf = (item) => {
//     console.log("item", item);
//     // Create a container div for the bill content
//     const container = document.createElement("div");
//     container.className = "bg-white p-4";
//     container.style.position = "absolute";
//     container.style.left = "-9999px"; // Move the container off-screen
//     container.style.width = "250mm"; // Set the container width to A4 width in mm
//     container.style.padding = "10mm"; // Add padding for margins in mm

//     // Create the bill receipt content dynamically based on `item`
//     const {
//       idNum,
//       image,
//       invoice,
//       invoiceDate,
//       dueDate,
//       invoiceFrom,
//       invoiceTo,
//       rows,
//       termsAndConditions,
//       itemValue,
//       discounts,
//       shipping,
//     } = item;

//     const billContent = document.createElement("div");
//     billContent.id = "bill";
//     billContent.innerHTML = `
//          <div class="">
//          <div class="grid grid-cols-12 justify-between">
//            <div class="col-span-6">
//              ${
//                image
//                  ? `<div class="mb-4"><img src="${image}" alt="Uploaded" class="w-32 h-32 object-cover mb-4" /></div>`
//                  : ""
//              }
//            </div>
//            <div class="col-span-6 mb-20">
//              <div class=" flex justify-end ">
//                <div>
//                  <h2 class="text-xl font-semibold ">${invoice} #${idNum}</h2>
//                 <h2 class="">Invoice Date: ${invoiceDate}</h2>
//                 <h2 class="">Due Date: ${dueDate}</h2>
//               </div>
//             </div>
//           </div>
//          </div>

//         <table class="mb-10 w-full">
//           <thead>
//             <tr>
//               <th class="border border-gray-300 p-1 pb-5">Bill From</th>
//               <th class="border border-gray-300 p-1 pb-5">Bill To</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td class="border border-gray-300 p-1 pb-5">${invoiceFrom}</td>
//               <td class="border border-gray-300 p-1 pb-5">${invoiceTo}</td>
//             </tr>
//           </tbody>
//         </table>

//         <table class="min-w-full border-collapse mb-10">
//           <thead>
//             <tr class="border border-gray-300">
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">#</th>
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Item</th>
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Quantity</th>
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Rate (INR)</th>
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">GST</th>
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Amount (INR)</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${rows
//               .map(
//                 (row) => `
//                   <tr class="border border-gray-300">
//                     <td class="p-1 pb-5 border border-gray-300">${row.id}</td>
//                     <td class="p-1 pb-5 border border-gray-300">${row.item}</td>
//                     <td class="p-1 pb-5 border border-gray-300">${row.quantity}</td>
//                     <td class="p-1 pb-5 border border-gray-300">${row.rate}</td>
//                     <td class="p-1 pb-5 border border-gray-300">${row.gst}<span class="pl-1"> % </span></td>
//                     <td class="p-1 pb-5 border border-gray-300">${row.amount}</td>
//                   </tr>
//                 `
//               )
//               .join("")}
//           </tbody>
//         </table>

//         <div class="grid grid-cols-12 justify-between">
//           <div class="col-span-8">
//             <p>${termsAndConditions}</p>
//           </div>
//           <div class="col-span-4">
//             <div class=" p-4 ">
//               <div class="flex justify-between mb-4">
//                 <div class="flex flex-col">
//                   <h1 class="p-1">Subtotal</h1>
//                   <h1 class="p-1">Discounts</h1>
//                   <h1 class="p-1">Shipping</h1>
//                   <h1 class="font-bold p-1">Total (INR)</h1>
//                 </div>
//                 <div class="flex flex-col text-right">
//                   <span class="p-1">${itemValue}</span>
//                   <span class="p-1">${discounts}</span>
//                   <span class="p-1">${shipping}</span>
//                   <span class="p-1">${(
//                     parseFloat(itemValue) -
//                     parseFloat(discounts) +
//                     parseFloat(shipping)
//                   ).toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     `;

//     // Append the bill content to the container
//     container.appendChild(billContent);

//     // Append the container to the document body
//     document.body.appendChild(container);

//     // Create PDF from the container
//     html2canvas(container).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       pdf.addImage(imgData, "PNG", 10, 10, 190, 0);

//       // Save PDF
//       const blob = pdf.output("blob");

//       // Convert blob to URL
//       const blobUrl = URL.createObjectURL(blob);

//       // Open PDF in a new tab
//       window.open(blobUrl, "_blank");

//       // Remove the container from the document body
//       document.body.removeChild(container);
//     });
//   };

//   const handlePrintPdf = (item) => {
//     console.log("item", item);
//     // Create a container div for the bill content
//     const container = document.createElement("div");
//     container.className = "bg-white p-4";
//     container.style.position = "absolute";
//     container.style.left = "-9999px"; // Move the container off-screen
//     container.style.width = "250mm"; // Set the container width to A4 width in mm
//     container.style.padding = "10mm"; // Add padding for margins in mm

//     // Create the bill receipt content dynamically based on `item`
//     const {
//       idNum,
//       image,
//       invoice,
//       invoiceDate,
//       dueDate,
//       invoiceFrom,
//       invoiceTo,
//       rows,
//       termsAndConditions,
//       itemValue,
//       discounts,
//       shipping,
//     } = item;

//     const billContent = document.createElement("div");
//     billContent.id = "bill";
//     billContent.innerHTML = `
//          <div class="">
//          <div class="grid grid-cols-12 justify-between">
//            <div class="col-span-6">
//              ${
//                image
//                  ? `<div class="mb-4"><img src="${image}" alt="Uploaded" class="w-32 h-32 object-cover mb-4" /></div>`
//                  : ""
//              }
//            </div>
//            <div class="col-span-6 mb-20">
//              <div class=" flex justify-end ">
//                <div>
//                  <h2 class="text-xl font-semibold ">${invoice} #${idNum}</h2>
//                 <h2 class="">Invoice Date: ${invoiceDate}</h2>
//                 <h2 class="">Due Date: ${dueDate}</h2>
//               </div>
//             </div>
//           </div>
//          </div>

//         <table class="mb-10 w-full">
//           <thead>
//             <tr>
//               <th class="border border-gray-300 p-1 pb-5">Bill From</th>
//               <th class="border border-gray-300 p-1 pb-5">Bill To</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td class="border border-gray-300 p-1 pb-5">${invoiceFrom}</td>
//               <td class="border border-gray-300 p-1 pb-5">${invoiceTo}</td>
//             </tr>
//           </tbody>
//         </table>

//         <table class="min-w-full border-collapse mb-10">
//           <thead>
//             <tr class="border border-gray-300">
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">#</th>
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Item</th>
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Quantity</th>
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Rate (INR)</th>
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">GST</th>
//               <th class="bg-gray-200 p-1 pb-5 text-left border border-gray-300">Amount (INR)</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${rows
//               .map(
//                 (row) => `
//                   <tr class="border border-gray-300">
//                     <td class="p-1 pb-5 border border-gray-300">${row.id}</td>
//                     <td class="p-1 pb-5 border border-gray-300">${row.item}</td>
//                     <td class="p-1 pb-5 border border-gray-300">${row.quantity}</td>
//                     <td class="p-1 pb-5 border border-gray-300">${row.rate}</td>
//                     <td class="p-1 pb-5 border border-gray-300">${row.gst}<span class="pl-1"> % </span></td>
//                     <td class="p-1 pb-5 border border-gray-300">${row.amount}</td>
//                   </tr>
//                 `
//               )
//               .join("")}
//           </tbody>
//         </table>

//         <div class="grid grid-cols-12 justify-between">
//           <div class="col-span-8">
//             <p>${termsAndConditions}</p>
//           </div>
//           <div class="col-span-4">
//             <div class=" p-4 ">
//               <div class="flex justify-between mb-4">
//                 <div class="flex flex-col">
//                   <h1 class="p-1">Subtotal</h1>
//                   <h1 class="p-1">Discounts</h1>
//                   <h1 class="p-1">Shipping</h1>
//                   <h1 class="font-bold p-1">Total (INR)</h1>
//                 </div>
//                 <div class="flex flex-col text-right">
//                   <span class="p-1">${itemValue}</span>
//                   <span class="p-1">${discounts}</span>
//                   <span class="p-1">${shipping}</span>
//                   <span class="p-1">${(
//                     parseFloat(itemValue) -
//                     parseFloat(discounts) +
//                     parseFloat(shipping)
//                   ).toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     `;

//     // Append the bill content to the container
//     container.appendChild(billContent);

//     // Append the container to the document body
//     document.body.appendChild(container);

//     // Create PDF from the container
//     html2canvas(container).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       pdf.addImage(imgData, "PNG", 10, 10, 190, 0);

//       // Open PDF in a new tab and print it
//       const pdfUrl = pdf.output("bloburl");
//       const printWindow = window.open(pdfUrl, "_blank");

//       // Print PDF when window is loaded
//       printWindow.onload = function () {
//         printWindow.print();
//       };

//       // Remove the container from the document body
//       document.body.removeChild(container);
//     });
//   };

//   const handleDeleteInvoice = async (invoiceId) => {
//     try {
//       // console.log("Deleting invoice with ID: ", invoiceId);

//       // Delete invoice from Firestore
//       await deleteDoc(doc(db, "invoices", invoiceId));
//       // console.log("Invoice deleted successfully");

//       // Update saveInvoice state to remove the deleted invoice
//       setSaveInvoiceGetFirebase((prevInvoices) =>
//         prevInvoices.filter((invoice) => invoice.uid !== invoiceId)
//       );
//     } catch (error) {
//       console.error("Error deleting invoice: ", error);
//     }
//   };

//   return (
//     <>
//       <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
//       <div className="px-5 costom-dark-mod h-[100vh] overflow-auto">
//         <table
//           id="invoiceTable"
//           className=" min-w-full bg-white border border-gray-300 costom-dark-mod "
//         >
//           <thead>
//             <tr>
//               <th className="px-4 py-2 border-b-2 text-left">Invoice No</th>
//               <th className="px-4 py-2 border-b-2 text-left">Invoice Date</th>
//               <th className="px-4 py-2 border-b-2 text-left">Due Date</th>
//               <th className="px-4 py-2 border-b-2 text-left">Currency</th>
//               <th className="px-4 py-2 border-b-2 text-left">Invoice To</th>
//               <th className="px-4 py-2 border-b-2 text-left">Action</th>
//             </tr>
//             {/* <tr>
//                     <th className="px-4 py-2 border-b-2 text-left"><input type="text" placeholder="Invoice No" className="w-24  rounded px-2 py-1"/></th>
//                     <th className="px-4 py-2 border-b-2 text-left"><input type="text" placeholder="Invoice Date" className="w-52  rounded px-2 py-1"/></th>
//                     <th className="px-4 py-2 border-b-2 text-left"><input type="text" placeholder="Due Date" className="w-52  rounded px-2 py-1"/></th>
//                     <th className="px-4 py-2 border-b-2 text-left"><input type="text" placeholder="Currency" className="w-24  rounded px-2 py-1"/></th>
//                     <th className="px-4 py-2 border-b-2 text-left"><input type="text" placeholder="Invoice To" className="w-full  rounded px-2 py-1"/></th>
//                     <th className="px-4 py-2 border-b-2 text-left"></th>
//                 </tr> */}
//           </thead>
//           <tbody>
//             {saveInvoiceGetFirebase.map((invoice, index) => (
//               <tr key={index} className="hover:bg-gray-200 hover:text-black">
//                 <td className="px-4 py-2 border-b">{invoice.idNum}</td>
//                 <td className="px-4 py-2 border-b">{invoice.invoiceDate}</td>
//                 <td className="px-4 py-2 border-b">{invoice.dueDate}</td>
//                 <td className="px-4 py-2 border-b">INR</td>
//                 <td className="px-4 py-2 border-b">{invoice.invoiceTo}</td>
//                 <td className="px-4 py-2 border-b">
//                   <Button
//                     sx={{ marginRight: 1 }}
//                     size="small"
//                     variant="outlined"
//                     onClick={() => {
//                       handleOpenAndEdit(invoice);
//                     }}
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     sx={{ marginRight: 1, padding: 1 }}
//                     size="small"
//                     variant="outlined"
//                     onClick={() => {
//                       handleDownloadPdf(invoice);
//                     }}
//                   >
//                     <BsDownload />
//                   </Button>
//                   <Button
//                     sx={{ marginRight: 1, padding: 1 }}
//                     size="small"
//                     variant="outlined"
//                     onClick={() => {
//                       handleOpenPdf(invoice);
//                     }}
//                   >
//                     <FaRegFilePdf />
//                   </Button>
//                   <Button
//                     sx={{ marginRight: 1, padding: 1 }}
//                     size="small"
//                     variant="outlined"
//                     onClick={() => {
//                       handlePrintPdf(invoice);
//                     }}
//                   >
//                     <AiFillPrinter />
//                   </Button>
//                   <Button
//                     sx={{ marginRight: 1 }}
//                     size="small"
//                     variant="outlined"

//                     onClick={() => {
//                       handleDeleteInvoice(invoice.uid);
//                     }}
//                   >
//                     <DeleteForeverIcon />
//                   </Button>

//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default Invoice;



import React, { useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { db } from "../firebase/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { Button } from "@mui/material";
import NavBar from "../navBar/NavBar";
import { BsDownload } from "react-icons/bs";
import { FaRegFilePdf } from "react-icons/fa";
import { AiFillPrinter } from "react-icons/ai";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Invoice = () => {
  // const [rowData, setRowData] = useState([]);
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
    console.log("raju kumar",item)
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

  const columnDefs = useMemo(
    () => [
      {
        field: "idNum",
        headerName: "Invoice No",
        editable: true,
        cellEditor: "agSelectCellEditor",
        minWidth: 200,
        maxWidth: 200,
      },
      {
        field: "invoiceDate",
        headerName: "Invoice Date",
        editable: true,
        minWidth: 200,
        maxWidth: 200,
      },
      {
        field: "dueDate",
        headerName: "Due Date",
        filter: "agNumberColumnFilter",
      },
      {
        field: "currency",
        headerName: "Currency",
        editable: true,
        valueFormatter: currencyFormatter,
        minWidth: 150,
        maxWidth: 150,
      },
      {
        field: "invoiceTo",
        headerName: "Invoice To",
        editable: true,
        minWidth: 750,
        maxWidth: 750,
      },
      {
        headerName: "Actions",
        suppressMenu: false,
        editable: false,
        minWidth: 400,
        maxWidth: 400,
        border:"none",
       
        cellRenderer: (params) => (
          <>
          <div>
            <Button
                    sx={{ marginRight: 1 }}
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      handleOpenAndEdit(params.data);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    sx={{ marginRight: 1, padding: 1 }}
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      handleDownloadPdf(params.data);
                      console.log("raju",params.data)
                    }}
                  >
                    <BsDownload />
                  </Button>
                  <Button
                    sx={{ marginRight: 1, padding: 1 }}
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      handleOpenPdf(params.data);
                    }}
                  >
                    <FaRegFilePdf />
                  </Button>
                  <Button
                    sx={{ marginRight: 1, padding: 1 }}
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      handlePrintPdf(params.data);
                    }}
                  >
                    <AiFillPrinter />
                  </Button>
                  <Button
                    sx={{ marginRight: 1 }}
                    size="small"
                    variant="outlined"
                    color="error"

                    onClick={() => {
                      handleDeleteInvoice(params.data.uid);
                    }}
                  >
                    <DeleteForeverIcon />
                  </Button>
                  </div>
          </>
        ),
      },
    ],
    []
  );


  const defaultColDef = useMemo(
    () => ({
      filter: "agTextColumnFilter",
      floatingFilter: true,
      editable: true,
      
    }),
    []
  );

  function currencyFormatter(params) {
    return "INR";
  }

  return (
    <>
      <NavBar />
      <div className="h-[90vh] costom-dark-mod px-2">
        <p className="text-2xl py-1 font-semibold">Invoices</p>
        <div
          className="ag-theme-quartz"
          style={{ height: "700px", width: "100%" }}
        >
          <AgGridReact
            rowData={saveInvoiceGetFirebase}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50]}
            
          />
        </div>
      </div>
    </>
  );
};

export default Invoice;
