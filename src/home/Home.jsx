import React, { useEffect, useRef, useState } from "react";
import NavBar from "../navBar/NavBar";
import { GrDownload } from "react-icons/gr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import {
  Button,
  ButtonGroup,
  Divider,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { FaRegFilePdf } from "react-icons/fa";
import { AiFillPrinter } from "react-icons/ai";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Home = ({ darkMode, toggleDarkMode }) => {

  const location = useLocation()
  const {
    invoice: initialInvoice,
    idNum: initialIdNumber,
    invoiceFrom:initialInvoiceFrom,
    invoiceTo : initialInvoiceTo, 
    termsAndConditions: initialTermsAndConditions,
    image:initialImage,
    footNote:initialFootNote,
    itemValue: initialItemValue,
    discounts:initialDiscounts,
    shipping:initialShipping,
    rows:initialRows,         
    dueDate:initialDueDate,
    invoiceDate:initialInvoiceDate,
  }  = location.state || {};
  console.log("location.state",location.state)

//---------------------------------------------------

// const getDefaltSettingValue = localStorage.getItem("defaultSettings");
// console.log("getDefaltSettingValue",getDefaltSettingValue)

// const parsedSettings = JSON.parse(getDefaltSettingValue);
// console.log("testing", parsedSettings.taxation);






const [image,setImage] = useState(initialImage || null)
const [taxation, setTaxation] = useState("GST");
const [currency,setCurrency] = useState("INR");
const [invoiceNo,setinvoiceNo] = useState("Invoice No ");
const [invoiceFrom,setInvoiceFrom] = useState(initialInvoiceFrom || "")
const [termsAndConditions,setTermsAndConditions] = useState(initialTermsAndConditions || "")
const [footNote,setFootNote] = useState(initialFootNote || "")
const [discounts,setDiscounts] = useState(initialDiscounts || 0)
const [shipping,setShipping] = useState(initialShipping || 0)
const [autoDueDays,setAutoDueDays] = useState(0)
const [autoDueDate,setAutoDueDate] = useState("")
const [taxationPer,setTaxationPer] = useState(0)
console.log("taxationPer",taxationPer)



useEffect(() => {
  const getDefaltSettingValue = localStorage.getItem("defaultSettings");
  console.log("getDefaltSettingValue", getDefaltSettingValue);

  if (getDefaltSettingValue) {
    const parsedSettings = JSON.parse(getDefaltSettingValue);
    console.log("parsedSettings", parsedSettings);

    // Update taxation state with the parsed value
    // setImage(parsedSettings.image)
    setTaxation(parsedSettings.taxation);
    setCurrency(parsedSettings.currency);
    setinvoiceNo(parsedSettings.invoiceNo);
    // setInvoiceFrom(parsedSettings.invoiceFrom)
    // setTermsAndConditions(parsedSettings.termsAndConditions)
    // setFootNote(parsedSettings.footNote)
    // setDiscounts(parsedSettings.discounts)
    // setShipping(parsedSettings.shipping)
    setAutoDueDays(parsedSettings.autoDueDays)
    setAutoDueDate(parsedSettings.autoDueDate)
    setTaxationPer(parsedSettings.taxationPer)

    if (!initialInvoiceFrom) {
      setInvoiceFrom(parsedSettings.invoiceFrom);
    }

    if (!initialTermsAndConditions) {
      setTermsAndConditions(parsedSettings.termsAndConditions);
    }

    if (!initialFootNote) {
      setFootNote(parsedSettings.footNote);
    }

    if (!initialDiscounts) {
      setDiscounts(parsedSettings.discounts);
    }

    if (!initialShipping) {
      setShipping(parsedSettings.shipping);
    }

    if (!initialImage) {
      setImage(parsedSettings.image);
    }

  }
}, []);


//---------------------------------------------------            





 
  const fileInputRef = useRef(null);
  const [isImageSelected, setIsImageSelected] = useState(true);
  const [invoice, setInvoice] = useState( initialInvoice || "Invoice No: ");
  const [idNumber, setIdNumber] = useState(
    initialIdNumber ||  Math.floor(100000 + Math.random() * 900000)
  );
  const [invoiceDate, setInvoiceDate] = useState(
    initialInvoiceDate ? new Date(initialInvoiceDate.split('-').reverse().join('-')) : new Date()
  );  
  
  const formattedInvoiceDate = `${invoiceDate
    .getDate()
    .toString()
    .padStart(2, "0")}-${(invoiceDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${invoiceDate.getFullYear()}`;
  const [dueDat, setDueDat] = useState(initialDueDate ? new Date(initialDueDate.split('-').reverse().join('-')) : null);
      const formattedDueDat = dueDat instanceof Date
  ? `${dueDat.getDate().toString().padStart(2, '0')}-${(dueDat.getMonth() + 1).toString().padStart(2, '0')}-${dueDat.getFullYear()}`
  : '';



  useEffect(() => {
    if (autoDueDate) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + autoDueDays);
      setDueDat(currentDate);
    }
  }, [autoDueDate, autoDueDays]);






  // const [invoiceFrom, setInvoicefrom] = useState( initialInvoiceFrom || "");
  const [invoiceTo, setInvoiceTo] = useState( initialInvoiceTo || "");
  const [itemValue, setItemValue] = useState(initialItemValue || 0);
  // const [discounts, setDiscounts] = useState(initialDiscounts || 0);
  // const [shipping, setShipping] = useState(initialShipping || 0);
  // const [termsAndConditions, setTermsAndConditions] = useState( initialTermsAndConditions|| "");
  // const [footNote, setFootNote] = useState(initialFootNote || "");
  // const [image, setImage] = useState(initialImage || null);
  const [rows, setRows] = useState( initialRows || [
     {
      id: 1,
      item: "",
      quantity: "0",
      rate: "0",
      gst: "0",
      amount: "0",
    },
  ]);
const [saveInvoiceGetFirebase ,setSaveInvoiceGetFirebase] = useState([])
  const [currentInvoice, setCurrentInvoice] = useState(rows);
  const [saveInvoice, setSaveInvoice] = useState([]);
  let pcId = localStorage.getItem('pcId');

  const handleSaveInvoice = async () => {
    let { uid: initialUid } = location.state || {};
  
    // Generate or retrieve pcId
    let pcId = localStorage.getItem('pcId');
    if (!pcId) {
      pcId = generateUniqueId();
      localStorage.setItem('pcId', pcId);
    }
  
    // Prepare new invoice object
    const newInvoice = {
      idNum: idNumber,
      invoice: invoice,
      invoiceDate: formattedInvoiceDate,
      dueDate: formattedDueDat,
      invoiceFrom: invoiceFrom,
      invoiceTo: invoiceTo,
      termsAndConditions: termsAndConditions,
      footNote: footNote,
      image: image,
      rows: rows,
      itemValue: itemValue,
      discounts: discounts,
      shipping: shipping,
      pcId: pcId, // Include pcId in newInvoice
    };
  
    try {
      if (initialUid) {
        // Update existing invoice in Firestore
        const invoiceRef = doc(db, "invoices", initialUid);
        await updateDoc(invoiceRef, newInvoice);
  
        // Update local state with current invoice
        setCurrentInvoice(newInvoice);
        toast.success("Update Invoice  successfully");
  
  
        // Update list of saved invoices (if necessary)
        setSaveInvoiceGetFirebase((prevInvoices) => {
          const updatedInvoices = prevInvoices.map((inv) =>
            inv.uid === initialUid ? newInvoice : inv
          );
          return updatedInvoices;
        });
      } else {
        // Add new invoice to Firestore
        const docRef = await addDoc(collection(db, "invoices"), {
          ...newInvoice,
          
        });
        toast.success("New Invoice Generated successfully");
  
        // Update local state with current invoice and ID
        const invoiceWithId = {
          ...newInvoice,
          uid: docRef.id, // Store docRef.id as uid
        };
  
        setCurrentInvoice(invoiceWithId);
  
        // Update list of saved invoices
        setSaveInvoiceGetFirebase((prevInvoices) => [...prevInvoices, invoiceWithId]);
      }
    } catch (error) {
      console.error("Error adding/updating invoice: ", error);
    }
  };


  useEffect(() => {
    const fetchInvoices = async () => {
      if (pcId) {
        try {
          // Fetch invoices from Firebase that match the pcId
          const querySnapshot = await getDocs(collection(db, 'invoices'));
          const fetchedInvoices = [];
          
          querySnapshot.forEach(doc => {
            const invoiceData = doc.data();
            if (invoiceData.pcId === pcId) {
              fetchedInvoices.push({ ...invoiceData, uid: doc.id });
            }
          });

          // Update local state with matching invoices
          setSaveInvoiceGetFirebase(fetchedInvoices);

          // Store matching invoices in localStorage
          localStorage.setItem('saveInvoice', JSON.stringify(fetchedInvoices));
        } catch (error) {
          console.error('Error fetching invoices:', error);
        }
      }
    };

    fetchInvoices();
  }, [pcId]);
  



  useEffect(() => {
    // Fetch data from localStorage when component mounts
    const savedInvoices = JSON.parse(localStorage.getItem('saveInvoice')) || [];
    setSaveInvoice(savedInvoices);
  }, []);



  useEffect(() => {
    // Store saveInvoice to localStorage whenever it changes
    localStorage.setItem('saveInvoice', JSON.stringify(saveInvoice));
  }, [saveInvoice]);

  useEffect(() => {
    let pcId = localStorage.getItem('pcId');
    if (!pcId) {
      pcId = generateUniqueId(); 
      localStorage.setItem('pcId', pcId);
    }
    // console.log('PC ID:', pcId);
  }, []);
  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 8); //  2.82 trillion
  };


  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "invoices"));
        const invoices = [];
        querySnapshot.forEach((doc) => {
          invoices.push({
            idNum: doc.data().idNum,
            invoice: doc.data().invoice,
            invoiceDate: doc.data().invoiceDate,
            dueDate: doc.data().dueDate,
            invoiceFrom: doc.data().invoiceFrom,
            invoiceTo: doc.data().invoiceTo,
            termsAndConditions: doc.data().termsAndConditions,
            footNote: doc.data().footNote,
            image: doc.data().image,
            rows: doc.data().rows,
            itemValue: doc.data().itemValue,
            discounts: doc.data().discounts,
            shipping: doc.data().shipping,
            uid: doc.id, // Ensure you capture the document ID as uid
          });
        });
        setSaveInvoice(invoices);
      } catch (error) {
        console.error("Error fetching invoices: ", error);
      }
    };

    fetchInvoices();
  }, []);

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
      toast.success("Delete Invoice SuccessFully!")
    } catch (error) {
      console.error("Error deleting invoice: ", error);
    }
  };

  useEffect(() => {
    // console.log("useEffect-saveInvoice: ", saveInvoice);
  }, [saveInvoice]);

  useEffect(() => {}, [currentInvoice]);

  const resetForm = () => {
    setIdNumber(Math.floor(100000 + Math.random() * 900000));
    setInvoice("Invoice No: ");
    setInvoiceDate(new Date());
    setDueDat("");
    setInvoiceFrom("");
    setInvoiceTo("");
    setTermsAndConditions("");
    setFootNote("");
    setImage(null);
    setRows([
      {
        id: 1,
        item: "",
        quantity: "0",
        rate: "0",
        gst: "0",
        amount: "0",
      },
    ]);
    setItemValue(0);
    setDiscounts(0);
    setShipping(0);
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

  // const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElArray, setAnchorElArray] = useState(
    Array(saveInvoice.length).fill(null)
  );

  const handleClick = (event, index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = event.currentTarget;
    setAnchorElArray(newAnchorElArray);
  };

  const handleClose = (index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = null;
    setAnchorElArray(newAnchorElArray);
  };

  // remove image
  const handleRemoveImage = () => {
    setImage(null); // Sets image state to null, effectively removing the selected image
    setIsImageSelected(true); // Updates isImageSelected state to true
    // Optional: Clear file input if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  

  const handleInvoiceChange = (e) => {
    // setInvoice(e.target.value);
    setinvoiceNo(e.target.value);
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
    setDueDat(date); // Update dueDat state with date object
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

  const handleDownloadPdfFirst = () => {
    // Create a container div for the bill content
    toast.success("Download Invoice SuccessFully!")
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

  const handleDownloadPdf = (item) => {
    toast.success("Download Invoice SuccessFully!")
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

  const handleOpenPdfFirst = () => {
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

  const handlePrintPdfFirst = () => {
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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result); // Sets the image state to the uploaded image data URL
        setIsImageSelected(true); // Updates isImageSelected state to true
      };
      reader.readAsDataURL(e.target.files[0]); // Reads the uploaded file as a data URL
    }
  };
  

  const handalAllItemValue = (item) =>{
    setInvoice(item.invoice || '');
    setIdNumber(item.idNum || '');
    if (item.invoiceDate) {
      const [day, month, year] = item.invoiceDate.split('-');
      const formattedDate = new Date(`${year}-${month}-${day}`);
      setInvoiceDate(formattedDate);
    } else {
      setInvoiceDate(new Date());
    }
    if (item.dueDate) {
      const [day, month, year] = item.dueDate.split('-');
      const formattedDate = new Date(`${year}-${month}-${day}`);
      setDueDat(formattedDate);
    } else {
      setDueDat("");
    }
    setIsImageSelected(true)
    setImage(item.image || '');
    setInvoiceFrom(item.invoiceFrom || '')
    setInvoiceTo(item.invoiceTo || '')
    setDiscounts(item.discounts)
    setFootNote(item.footNote || '')
    setRows(item.rows || '')
    setShipping(item.shipping )
    setTermsAndConditions(item.termsAndConditions || '')
  }

  const isSmallScreen = useMediaQuery("(max-width:767px)");
  return (
    <>
     <ToastContainer position="top-center" />
      <NavBar  darkMode={darkMode} toggleDarkMode={toggleDarkMode}  />
      <div className="px-2 costom-dark-mod">
        <div className="lg:grid grid-cols-12  ">
          <div className="col-span-10 ">
            <div className="lg:grid grid-cols-12 gap-2 px-2">
              <div className="col-span-4">
                <div className="grid grid-cols-6">
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
                            className="border border-blue-500 absolute bottom-0 left-0 w-full h-full opacity-0 cursor-pointer "
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
                        className="border border-gray-300 p-2  w-[50%] rounded-l-lg costom-dark-mod-input"
                        placeholder="Invoice"
                        value={invoiceNo}
                        onChange={handleInvoiceChange}
                        aria-label="Username"
                      />
                      <span className="bg-gray-200 text-gray-700 p-3 hash costom-dark-mod-input">#</span>
                      <input
                        value={idNumber}
                        onChange={handleidNumberChange}
                        type="number"
                        className="border border-gray-300 p-2 w-[50%] rounded-r-lg costom-dark-mod-input"
                        placeholder="Id No"
                        aria-label="Server"
                      />
                    </div>
                  </div>
                </div>
                <div className=" gap-2 pt-4 md:grid grid-cols-12 md:space-y-0 space-y-5">
               
                  <div className=" items-center col-span-6 flex pl-8">
                    <label
                      htmlFor="invoiceDate"
                      className=" text-gray-700 w-40 text-sm costom-dark-mod p-2"
                    >
                      Invoice Date:
                    </label>
                    <div className="relative w-full  ">

                      <DatePicker
                        id="invoiceDate"
                        selected={invoiceDate}
                        // selected={new Date(invoiceDate)}
                        onChange={handleDateChange}
                        // onChange={date => setInvoiceDate(date)}
                        customInput={
                          <div className="relative">
                            <input
                              type="text"
                              value={formattedInvoiceDate} // Ensure to format the date correctly if needed
                              // value={invoiceDate}
                              onChange={handleDateChange} // Handle date changes if needed
                              className="border border-gray-300 p-2 pl-10 w-full rounded-lg costom-dark-mod-input"
                              placeholder="Select date"
                              aria-label="Invoice Date"
                            />
                            <div className="absolute top-1   m-2 text-gray-500 cursor-pointer z-10">
                              <FaRegCalendarAlt
                                onClick={() =>
                                  document.getElementById("invoiceDate").click()
                                }
                              />
                            </div>
                          </div>
                        }
                      />
                    </div>
                  </div>
                  {/*  */}
                  <div className=" items-center col-span-6 flex pl-8">
                    <label
                      htmlFor="dueDat"
                      className=" text-gray-700 w-40 text-sm costom-dark-mod"
                    >
                      Due Date:
                    </label>
                    <div className="relative w-full ">
                      <DatePicker
                        id="dueDat"
                        selected={dueDat}
                        onChange={handleDueDateChange}
                        customInput={
                          <div className="relative">
                            <input
                              type="text"
                              value={formattedDueDat} // Ensure to format the date correctly if needed
                              onChange={(e) =>
                                handleDueDateChange(e.target.value)
                              } // Handle date changes if needed
                              className="border border-gray-300 p-2 pl-10 w-full rounded-lg costom-dark-mod-input"
                              placeholder="DD-MM-YYYY"
                              aria-label="Due Date"
                            />
                            <div className="absolute top-1   m-2 text-gray-500 cursor-pointer z-10">
                              <FaRegCalendarAlt
                                onClick={() =>
                                  document.getElementById("dueDat").click()
                                }
                              />
                            </div>
                          </div>
                        }
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
                    // value={invoiceFrom}
                    value={invoiceFrom}

                    onChange={(e) => setInvoiceFrom(e.target.value)}
                    placeholder="Who is this invoice from? (reQuired)"
                    className="w-full border outline-none h-24 p-2 rounded-lg costom-dark-mod-input"
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
                    className="w-full border outline-none h-24 p-2 rounded-lg costom-dark-mod-input"
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
                      <th className="md:w-1/12 p-1"> Rate ({currency}) </th>
                      <th className="md:w-1/12 p-1"> {taxation} </th>
                      <th className="md:w-2/12 p-1"> Amount ({currency}) </th>
                    </tr>
                  </thead>

                  <tbody className="">
                    {rows.map((row, index) => (
                      <>
                     
                        <tr
                          key={row.id}
                          className={
                            isSmallScreen
                              ? "w-full py-3 border rounded-lg grid "
                              : "w-full py-3  border-y-2  "
                          }
                        >
                          <td className="p-2 relative ">
                            <span className="pl-2">{row.id}</span>
                            <span
                              onClick={() => handleRemoveRow(row.id)}
                              className={
                                isSmallScreen
                                  ? "absolute inset-y-2 right-3 flex items-center p-3 text-white bg-red-600 cursor-pointer"
                                  : "absolute inset-y-2 right-1 flex items-center p-3 text-white bg-red-600 cursor-pointer"
                              }
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
                              className="w-full border border-gray-300 rounded-md p-1 py-2 outline-none costom-dark-mod"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={row.quantity}
                              onChange={(e) => handleQuantityChange(e, index)}
                              type="number"
                              placeholder={isSmallScreen ? "quantity" : "0"}
                              className="w-full border border-gray-300 rounded-md p-1 py-2 outline-none costom-dark-mod"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={row.rate}
                              onChange={(e) => handleRateChange(e, index)}
                              type="number"
                              placeholder={isSmallScreen ? "Rate" : "0.00"}
                              className="w-full border border-gray-300 rounded-md p-1 py-2 outline-none costom-dark-mod"
                            />
                          </td>
                          <td className="p-2 relative">
                            <input
                              value={row.gst}
                              onChange={(e) => handleGstChange(e, index)}
                              type="number"
                              className="w-full border border-gray-300 rounded-md p-1 py-2  pr-8 outline-none costom-dark-mod"
                              placeholder={isSmallScreen ? "GST" : "0"}
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
                              className="w-full border border-gray-300 rounded-md p-1 py-2 outline-none costom-dark-mod"
                              placeholder="0.00"
                            />
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pl-2 py-2">
                <button
                  onClick={handleAddRow}
                  className="px-4 py-2 bg-blue-500 text-white md:text-[15px] text-[12px] rounded-md hover:bg-blue-600 focus:outline-none"
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
                    className="w-full h-20  p-2 border outline-none rounded-lg costom-dark-mod-input"
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
                    className="w-full h-20 p-2 border outline-none rounded-lg costom-dark-mod-input"
                    name=""
                    id=""
                  ></textarea>
                </div>
              </div>
              <div className="col-span-5 px-">
                <div className="grid grid-cols-12 items-center gap-3 pb-4">
                  <div className="col-span-3">
                    <p className="font-medium  sm:text-[14px] text-[12px]">
                      Subtotal
                    </p>
                  </div>
                  <div className="col-span-9">
                    <input
                      value={itemValue}
                      readOnly
                      className="w-full p-1 px-2 rounded border outline-none bg-slate-200 costom-dark-mod-input"
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
                      className="w-full p-1 px-2 rounded border outline-none costom-dark-mod-input "
                      type="number"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-3">
                    <p className=" sm:text-[14px] text-[12px]">Shipping</p>
                  </div>
                  <div className="col-span-9">
                    <input
                      value={ shipping}
                      onChange={handleshippingCharg}
                      className="w-full p-1 px-2 rounded border outline-none costom-dark-mod-input"
                      type="number"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-3">
                    <p className="font-bold sm:text-[14px] text-[12px]">
                      Total (INR)
                    </p>
                  </div>
                  <div className="col-span-9">
                    <input
                      readOnly
                      value={(
                        parseFloat(itemValue) -
                        parseFloat(discounts) +
                        parseFloat(shipping)
                      ).toFixed(2)}
                      className="w-full p-1 px-2 rounded bg-slate-200 border outline-none costom-dark-mod-input"
                      type="text"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2 bg-[#eee] costom-dark-mod-input">
            <div className="p-2 pb-4">
              <Button
                onClick={handleSaveInvoice}
                className="w-full"
                variant="contained"
              >
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
                  onClick={handleDownloadPdfFirst}
                  sx={{ padding: "10px" }}
                  className="w-full "
                >
                  {" "}
                  <GrDownload className="" />
                </Button>
                <Button
                  onClick={handleOpenPdfFirst}
                  sx={{ padding: "10px" }}
                  className="w-full"
                >
                  {" "}
                  <FaRegFilePdf />
                </Button>
                <Button
                  onClick={handlePrintPdfFirst}
                  sx={{ padding: "10px" }}
                  className="w-full"
                >
                  <AiFillPrinter />
                </Button>
              </ButtonGroup>
            </div>

            <div className="flex items-center justify-between py-3 ">
              <div className="p-2 flex items-center lg:gap-2 gap-3">
                <h6 className="font-semibold lg:text-[15px] text-[20px] flex items-center">
                  My Invoice
                </h6>
                <p className="h-6 w-5 bg-[#1976d2] rounded-md text-[12px] font-semibold text-white flex items-center justify-center ">
                  {saveInvoiceGetFirebase.length}
                </p>
              </div>
              <div className="pr-2  relative text-sm">
                <Button
                  onClick={resetForm}
                  className=""
                  sx={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    minHeight: "unset",
                  }}
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
                padding: "0px 1px",
              }}
            />
            <div className={isSmallScreen ? "pb-4 pt-2 h-[40vh]  overflow-auto" : "pb-4 pt-2 h-[72vh]  overflow-auto"} style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
              {saveInvoiceGetFirebase.map((item, index) => (
                <div key={index} className="px-2 py-1 ">
                  <div onClick={()=>handalAllItemValue(item)} className="cursor-pointer flex px-2 justify-between py-2 border border-gray-500 bg-[#1976d2] hover:bg-blue-500 rounded-md text-white items-center">
                    <h4>{item.idNum}</h4>
                    <div className="">
                      <button
                        className="border rounded p-1 hover:bg-white hover:text-black transition-all duration-500"
                        id={`basic-button-${index}`}
                        aria-controls={open ? `basic-menu-${index}` : undefined}
                        aria-haspopup="true"
                        // aria-expanded={Boolean(anchorElArray[index]) ? "true" : "false"}
                        onClick={(event) => handleClick(event, index)}
                      >
                        <MoreVertIcon className="p-1" />
                      </button>
                      <Menu
                        id={`basic-menu-${index}`}
                        anchorEl={anchorElArray[index]}
                        open={Boolean(anchorElArray[index])}
                        onClose={() => handleClose(index)}
                        MenuListProps={{
                          "aria-labelledby": `basic-button-${index}`,
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            handleDownloadPdf(item);
                            handleClose(index);
                          }}
                        >
                          Download
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleOpenPdf(item);
                            handleClose(index);
                          }}
                        >
                          Open PDF
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handlePrintPdf(item);
                            handleClose(index);
                          }}
                        >
                          Print
                        </MenuItem>
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
                          onClick={() => {
                            handleDeleteInvoice(item.uid);
                            handleClose(index); // Close the menu
                          }}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;


