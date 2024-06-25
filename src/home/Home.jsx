import React, { useEffect, useRef, useState } from "react";
import NavBar from "../navBar/NavBar";
import { GrDownload } from "react-icons/gr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Button, ButtonGroup, Divider, Menu, MenuItem } from "@mui/material";
import { FaRegFilePdf } from "react-icons/fa";
import { AiFillPrinter } from "react-icons/ai";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const Home = () => {
  const fileInputRef = useRef(null);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [invoice, setInvoice] = useState("Invoice No: ");
  const [idNumber, setIdNumber] = useState(
    Math.floor(100000 + Math.random() * 900000)
  );
  const [mode, setMode] = useState("light");
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const formattedInvoiceDate = `${invoiceDate
    .getDate()
    .toString()
    .padStart(2, "0")}-${(invoiceDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${invoiceDate.getFullYear()}`;
  const [dueDat, setDueDat] = useState("");
  const formattedDueDat =
    dueDat instanceof Date
      ? `${dueDat.getDate().toString().padStart(2, "0")}-${(
          dueDat.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${dueDat.getFullYear()}`
      : "";
  const [invoiceFrom, setInvoicefrom] = useState("");
  const [invoiceTo, setInvoiceTo] = useState("");
  const [itemValue, setItemValue] = useState(0);
  const [discounts, setDiscounts] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [footNote, setFootNote] = useState("");
  const [image, setImage] = useState(null);
  const [rows, setRows] = useState([
    {
      id: 1,
      item: "",
      quantity: "0",
      rate: "0",
      gst: "0",
      amount: "0",
    },
  ]);

  const [invoices, setInvoices] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState(rows);

  const handleSaveInvoice = () => {
    // Assuming you generate a new ID for each new invoice
    const newInvoice = {
      id: idNumber,  // 4 digit number
      invoice: invoice, 
      invoiceDate: formattedInvoiceDate, 
      dueDat: formattedDueDat,
      invoiceFrom: invoiceFrom, 
      invoiceTo: invoiceTo, 
      termsAndConditions: termsAndConditions, 
      footNote: footNote,
      image: image, 
      rows: rows, 
      itemValue: itemValue, 
      discounts: discounts, 
      shipping: shipping,
    };
  
    setCurrentInvoice(newInvoice); 
    setInvoices([...invoices, newInvoice]); 
  };

  useEffect(()=>{
    console.log("raju",currentInvoice)

  },[currentInvoice])


  const resetForm = () => {
    setIdNumber(Math.floor(100000 + Math.random() * 900000));
    setInvoice("Invoice No: ");
    setInvoiceDate(new Date());
    setDueDat("");
    setInvoicefrom("");
    setInvoiceTo("");
    setTermsAndConditions("");
    setFootNote("");
    setImage(null);
    setRows(
      [
        {
          id: 1,
          item: "",
          quantity: "0",
          rate: "0",
          gst: "0",
          amount: "0",
        },
      ]
    );
    setItemValue(0);
    setDiscounts(0);
    setShipping(0);
  };
  

  const toggleMode = () => {
    if (mode === "light") {
      setMode("dark");
      document.body.style.backgroundColor = "rgb(17,24,39)";
    } else {
      setMode("light");
      document.body.style.backgroundColor = "white";
    }
  };

  // add row function
  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      item: "",
      quantity: "",
      rate: "",
      gst: "",
      amount: "",
    };
    setRows([...rows, newRow]);
  };

  // item
  const handleItemChange = (e, rowIndex) => {
    const { value } = e.target;
    const updatedRows = [...rows];
    updatedRows[rowIndex].item = value;
    setRows(updatedRows);
    updateAmount(rowIndex);
  };

  // Rate
  const handleRateChange = (e, rowIndex) => {
    const { value } = e.target;
    const updatedRows = [...rows];
    updatedRows[rowIndex].rate = value;
    setRows(updatedRows);
    updateAmount(rowIndex);
  };

  // Gst
  const handleGstChange = (e, rowIndex) => {
    const { value } = e.target;
    const updatedRows = [...rows];
    updatedRows[rowIndex].gst = value;
    setRows(updatedRows);
    updateAmount(rowIndex);
  };

  // Quantity
  const handleQuantityChange = (e, rowIndex) => {
    const { value } = e.target;
    const updatedRows = [...rows];
    updatedRows[rowIndex].quantity = value;
    setRows(updatedRows);
    updateAmount(rowIndex);
  };


  const updateAmount = (rowIndex) => {
    const updatedRows = [...rows];
    const row = updatedRows[rowIndex];
    const quantity = parseFloat(row.quantity) || 0;
    const rate = parseFloat(row.rate) || 0;
    const gst = parseFloat(row.gst) || 0;

    const amount = quantity * rate * (1 + gst / 100);
    updatedRows[rowIndex].amount = amount.toFixed(2); // Round to 2 decimal places
    setRows(updatedRows);

    // Calculate total amount
    const newTotalAmount = updatedRows.reduce((total, row) => {
      return total + parseFloat(row.amount);
    }, 0);

    setItemValue(newTotalAmount.toFixed(2)); // Update total amount state
  };


  const handleRemoveRow = (id) => {
    // Filter out the row with the given id
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);

    // Calculate new subtotal
    const newTotalAmount = updatedRows.reduce((total, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const rate = parseFloat(row.rate) || 0;
      const gst = parseFloat(row.gst) || 0;
      const amount = quantity * rate * (1 + gst / 100);
      return total + amount;
    }, 0);

    setItemValue(newTotalAmount.toFixed(2)); // Update itemValue with new subtotal
  };


  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // remove image
  const handleRemoveImage = () => {
    // setSelectedImage(null);
    setImage(null);
    setIsImageSelected(false);
    // Clear file input (optional, if needed)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInvoiceChange = (e) => {
    setInvoice(e.target.value);
    // console.log("invoice text", invoice);
  };

  const handleidNumberChange = (e) => {
    setIdNumber(e.target.value);
    // console.log("Invoice No: number ", idNumber);
  };

  const handleDateChange = (date) => {
    setInvoiceDate(date);
    // console.log("Selected invoice date:", date);
  };

  const handleDueDateChange = (date) => {
    if (date) {
      setDueDat(date); // Update dueDat state with date object
    } else {
      setDueDat(""); // Handle case when date is cleared
    }
  };

  

  const calculateSubtotal = () => {
    return rows.reduce((total, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const rate = parseFloat(row.rate) || 0;
      const gst = parseFloat(row.gst) || 0;
      const amount = quantity * rate * (1 + gst / 100);
      return total + amount;
    }, 0);
  };

  useEffect(() => {
    const subtotal = calculateSubtotal();
    setItemValue(subtotal.toFixed(2));
  }, [rows]);

  const handleDiscountChange = (e) => {
    const { value } = e.target;
    setDiscounts(parseFloat(value));
  };

  const handleshippingCharg = (e) => {
    const { value } = e.target;
    setShipping(parseFloat(value));
  };

  const handleDownloadPdf = () => {
    // Create a container div for the bill content
    const container = document.createElement("div");
    container.className = "bg-white p-4";
    container.style.position = "absolute";
    container.style.left = "-9999px"; // Move the container off-screen
    container.style.width = "250mm"; // Set the container width to A4 width in mm
    container.style.padding = "10mm"; // Add padding for margins in mm

    // Create the bill receipt content
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
      <h2 class="text-xl font-semibold ">${invoice} #${idNumber}</h2>
      <h2 class="">Invoice Date: ${formattedInvoiceDate}</h2>
      <h2 class="">Due Date: ${formattedDueDat}</h2>  
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

  const handleOpenPdf = () => {
    // Create a container div for the bill content
    const container = document.createElement("div");
    container.className = "bg-white p-4";
    container.style.position = "absolute";
    container.style.left = "-9999px"; // Move the container off-screen
    container.style.width = "250mm"; // Set the container width to A4 width in mm
    container.style.padding = "10mm"; // Add padding for margins in mm

    // Create the bill receipt content
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
                <h2 class="text-xl font-semibold ">${invoice} #${idNumber}</h2>
                <h2 class="">Invoice Date: ${formattedInvoiceDate}</h2>
                <h2 class="">Due Date: ${formattedDueDat}</h2>
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

  const handlePrintPdf = () => {
    // Create a container div for the bill content
    const container = document.createElement("div");
    container.className = "bg-white p-4";
    container.style.position = "absolute";
    container.style.left = "-9999px"; // Move the container off-screen
    container.style.width = "250mm"; // Set the container width to A4 width in mm
    container.style.padding = "10mm"; // Add padding for margins in mm

    // Create the bill receipt content
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
                <h2 class="text-xl font-semibold ">${invoice} #${idNumber}</h2>
                <h2 class="">Invoice Date: ${formattedInvoiceDate}</h2>
                <h2 class="">Due Date: ${formattedDueDat}</h2>
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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        // setSelectedImage(reader.result);
        setIsImageSelected(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <>
      <NavBar />
      {/* <button onClick={toggleMode}>Mode</button> */}
      <div className="pt-5">
        <div className="lg:grid grid-cols-12  ">
          <div className="col-span-10 ">
            <div className="lg:grid grid-cols-12 gap-2 px-2">
              <div className="col-span-4">
                <div className="grid grid-cols-6  my-6">
                  <div className="col-span-6 ">
                    <div className="p-2">
                      {isImageSelected && image ? (
                        <div>
                          <img
                            className="w-20 h-20"
                            src={image}
                            alt="Selected"
                          />
                          <button
                            onClick={handleRemoveImage}
                            className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="lg:w-60 lg:h-60 w-full p-2 border-2 border-dashed border-[#92b0b3] relative flex flex-col justify-center items-center">
                          <div className="flex flex-col items-center">
                            <GrDownload className="text-blue-500" />
                            <h2 className="py-4 text-center text-2xl font-medium text-[#64a591]">
                              Or Drag It Here.
                            </h2>
                          </div>
                          <input
                            className="border border-blue-500 absolute bottom-0 left-0 w-full h-full opacity-0 cursor-pointer"
                            type="file"
                            onChange={handleImageChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-8 ">
                <div className="">
                  <div className="w-full pt-5">
                    <div className="flex mb-3">
                      <input
                        type="text"
                        className="border border-gray-300 p-2  w-[50%] rounded-l-lg "
                        placeholder="Invoice"
                        value={invoice}
                        onChange={handleInvoiceChange}
                        aria-label="Username"
                      />
                      <span className="bg-gray-200 text-gray-700 p-3">#</span>
                      <input
                        value={idNumber}
                        onChange={handleidNumberChange}
                        type="number"
                        className="border border-gray-300 p-2 w-[50%] rounded-r-lg"
                        placeholder="Id No"
                        aria-label="Server"
                      />
                    </div>
                  </div>
                </div>
                <div className=" gap-2 pt-4 md:grid grid-cols-12 md:space-y-0 space-y-5">
                  <div className=" items-center col-span-6 flex ">
                    <label
                      htmlFor="invoiceDate"
                      className=" text-gray-700 w-40 text-sm "
                    >
                      Invoice Date:
                    </label>
                    <div className="relative w-full ">
                      <FaRegCalendarAlt
                        className="absolute top-1 right-14 m-2 text-gray-500 cursor-pointer z-10"
                        onClick={() =>
                          document.getElementById("invoiceDate").click()
                        }
                      />
                      <DatePicker
                        id="invoiceDate"
                        selected={invoiceDate}
                        onChange={handleDateChange}
                        className="border border-gray-300 p-2 pl-10 w-full rounded-lg"
                        placeholderText="Select date"
                        aria-label="Invoice Date"
                      />
                    </div>
                  </div>
                  {/*  */}
                  <div className=" items-center col-span-6 flex ">
                    <label
                      htmlFor="dueDat"
                      className=" text-gray-700 w-40 text-sm"
                    >
                      Due Date:
                    </label>
                    <div className="relative w-full ">
                      <FaRegCalendarAlt
                        className="absolute top-1 right-14 m-2 text-gray-500 cursor-pointer z-10 "
                        onClick={() =>
                          document.getElementById("dueDat").click()
                        }
                      />
                      <DatePicker
                        id="dueDat"
                        selected={dueDat}
                        onChange={handleDueDateChange}
                        className="border border-gray-300 p-2 pl-10 w-full rounded-lg"
                        aria-label="Invoice Date"
                        placeholderText="MM-DD-YYYY"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-2 md:grid grid-cols-12 gap-5 pb-3 ">
              <div className="col-span-6 lg:pt-0 pt-3">
                <p>Invoice from</p>
                <div>
                  <textarea
                    value={invoiceFrom}
                    onChange={(e) => setInvoicefrom(e.target.value)}
                    placeholder="Who is this invoice from? (reQuired)"
                    className="w-full border outline-none h-24 p-2 rounded-lg"
                    name=""
                    id=""
                  ></textarea>
                </div>
              </div>
              <div className="col-span-6  lg:pt-0 pt-3">
                <p>Invoice to</p>
                <div>
                  <textarea
                    value={invoiceTo}
                    onChange={(e) => setInvoiceTo(e.target.value)}
                    placeholder="Who is this invoice to? (reQuired)"
                    className="w-full border outline-none h-24 p-2 rounded-lg"
                    name=""
                    id=""
                  ></textarea>
                </div>
              </div>
            </div>
            {/* Add Item */}
            <div className="py-2">
              <div className=" grid grid-cols-12 ">
                <table className="w-full col-span-12">
                  <thead className="hidden md:table-header-group ">
                    <tr className="w-full">
                      <th className="w-full md:w-1/12 p-1"> # </th>
                      <th className="md:w-2/12 p-1"> Item </th>
                      <th className="md:w-1/12 p-1"> Quantity </th>
                      <th className="md:w-1/12 p-1"> Rate (INR) </th>
                      <th className="md:w-1/12 p-1"> GST </th>
                      <th className="md:w-2/12 p-1"> Amount (INR) </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, index) => (
                      <tr
                        key={row.id}
                        className="w-full py-3 border border-y-1"
                      >
                        <td className="p-2 relative">
                          <span className="pl-2">{row.id}</span>
                          <span
                            onClick={() => handleRemoveRow(row.id)}
                            className="absolute inset-y-2 right-1 flex items-center p-4 text-white bg-red-600 cursor-pointer"
                          >
                            X
                          </span>
                        </td>
                        <td className="p-2 ">
                          <input
                            value={row.item}
                            onChange={(e) => handleItemChange(e, index)}
                            type="text"
                            placeholder="Description of service or product..."
                            className="w-full border border-gray-300 rounded-md p-1 outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            value={row.quantity}
                            onChange={(e) => handleQuantityChange(e, index)}
                            type="number"
                            placeholder="0.00"
                            className="w-full border border-gray-300 rounded-md p-1 outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            value={row.rate}
                            onChange={(e) => handleRateChange(e, index)}
                            type="number"
                            placeholder="0.00"
                            className="w-full border border-gray-300 rounded-md p-1 outline-none"
                          />
                        </td>
                        <td className="p-2 relative">
                          <input
                            value={row.gst}
                            onChange={(e) => handleGstChange(e, index)}
                            type="number"
                            className="w-full border border-gray-300 rounded-md p-1 pl-4 pr-8 outline-none"
                            placeholder="0.00"
                          />
                          <span className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-400">
                            %
                          </span>
                        </td>
                        <td className="p-2">
                          <input
                            value={row.amount}
                            readOnly
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-1 outline-none"
                            placeholder="0.00"
                          />
                        </td>
                      </tr>
                     
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pl-2 py-2">
                <button
                  onClick={handleAddRow}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                >
                  + Add Item
                </button>
              </div>
            </div>
            {/*  */}
            <div className="md:grid grid-cols-12 gap-5 px-2">
              <div className="col-span-7 ">
                <div className="pb-2">
                  <span>Terms & Conditions</span>
                  <textarea
                    value={termsAndConditions}
                    onChange={(e) => setTermsAndConditions(e.target.value)}
                    placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                    className="w-full h-16 p-2 border outline-none rounded-lg"
                    name=""
                    id=""
                  ></textarea>
                </div>
                <div className="pb-2">
                  <span>Foot Note</span>
                  <textarea
                    value={footNote}
                    onChange={(e) => setFootNote(e.target.value)}
                    placeholder="Thank you for your business"
                    className="w-full h-16 p-2 border outline-none"
                    name=""
                    id=""
                  ></textarea>
                </div>
              </div>
              <div className="col-span-5 px-">
                <div className="grid grid-cols-12 items-center gap-3">
                  <div className="col-span-3">
                    <p className="font-medium  sm:text-[14px] text-[12px]">Subtotal</p>
                  </div>
                  <div className="col-span-9">
                    <input
                      value={itemValue}
                      readOnly
                      className="w-full p-1 px-2 rounded-lg border outline-none bg-slate-200"
                      type="text"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-3">
                    <p className=" sm:text-[14px] text-[12px]">Discounts</p>
                  </div>
                  <div className="col-span-9">
                    <input
                      value={discounts}
                      onChange={handleDiscountChange}
                      className="w-full p-1 px-2 rounded border outline-none"
                      type="number"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-3">
                    <p className=" sm:text-[14px] text-[12px]">Shipping</p>
                  </div>
                  <div className="col-span-9">
                    <input
                      value={shipping}
                      onChange={handleshippingCharg}
                      className="w-full p-1 px-2 rounded border outline-none"
                      type="number"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-3">
                    <p className="font-bold sm:text-[14px] text-[12px]">Total (INR)</p>
                  </div>
                  <div className="col-span-9">
                    <input
                      readOnly
                      value={(
                        parseFloat(itemValue) -
                        parseFloat(discounts) +
                        parseFloat(shipping)
                      ).toFixed(2)}
                      className="w-full p-1 px-2 rounded bg-slate-200 border outline-none"
                      type="text"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2 bg-[#eee]">
            <div className="p-2 pb-4">
              <Button  onClick={handleSaveInvoice} className="w-full" variant="contained">
                save invoice
              </Button>
            </div>

            <div className="p-2 pb-4 w-full flex justify-center">
              <ButtonGroup
                variant="outlined"
                aria-label="Basic button group"
                className="w-full"
              >
                <Button
                  onClick={handleDownloadPdf}
                  sx={{ padding: "10px" }}
                  className="w-full "
                >
                  {" "}
                  <GrDownload className="" />
                </Button>
                <Button
                  onClick={handleOpenPdf}
                  sx={{ padding: "10px" }}
                  className="w-full"
                >
                  {" "}
                  <FaRegFilePdf />
                </Button>
                <Button
                  onClick={handlePrintPdf}
                  sx={{ padding: "10px" }}
                  className="w-full"
                >
                  <AiFillPrinter />
                </Button>
              </ButtonGroup>
            </div>

            <div className="flex items-center justify-between py-5 ">
              <div className="p-2  flex items-center gap-2">
                <h6 className="font-semibold">My Invoice</h6>
                <p className="h-5 w-5 bg-blue-400 rounded-md text-[12px] font-semibold text-white flex items-center justify-center">
                  0
                </p>
              </div>
              <div className="pr-2 border relative">
                <Button
               onClick={resetForm}
                  className=""
                  sx={{ padding: "1px" }}
                  size="small"
                  variant="outlined"
                >
                  New
                </Button>
              </div>
            </div>
            <hr
              style={{
                backgroundColor: "#bbbcbd",
                height: "1px",
                border: "none",
                padding: "0px 2px",
              }}
            />

            <div className="px-2 py-3 ">
              <div className="flex px-4 justify-between py-3 border border-gray-500 bg-[#1976d2] rounded-md text-white items-center">
                <h4>{idNumber}</h4>
                <div>
                  <button
                    className="border rounded p-1 hover:bg-white hover:text-black transition-all duration-500"
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                  >
                    <MoreVertIcon className="p-1" />
                  </button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={handleDownloadPdf}>Download</MenuItem>
                    <MenuItem onClick={handleOpenPdf}>Open PDF</MenuItem>
                    <MenuItem onClick={handlePrintPdf}>Print</MenuItem>
                    <Divider />
                    <MenuItem
                      sx={{
                        background: "red",
                        color: "white",
                        "&:hover": {
                          background: "red",
                          color: "white",
                        },
                      }}
                      onClick={handleClose}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
