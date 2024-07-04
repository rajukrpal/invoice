import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import NavBar from "../navBar/NavBar";
import { GrDownload } from "react-icons/gr";
import { BsFillCaretDownFill } from "react-icons/bs";
import { SketchPicker } from "react-color";
import Switch from "@mui/material/Switch";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Button, CardActionArea, CardActions } from "@mui/material";
import DateComponent from "../dateComponent/DateComponent";

const currencies = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "INR", label: "INR" },
  { value: "GBP", label: "GBP" },
  { value: "JPY", label: "JPY" },
  { value: "CAD", label: "CAD" },
];

const Taxations = [
  { value: "VAT", label: "VAT" },
  { value: "GST", label: "GST" },
  { value: "SST", label: "SST" },
  { value: "TAX", label: "TAX" },
  { value: "PPN", label: "PPN" },
  { value: "HST", label: "HST" },
];

const pageOrientationVal = [
  { value: "portrait", label: "portrait" },
  { value: "landscape", label: "landscape" },
];

const pageSizeVal = [
  { value: "A4", label: "A4" },
  { value: "2A0", label: "2A0" },
  { value: "A0", label: "A0" },
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "A3", label: "A3" },
  { value: "A4", label: "A4" },
  { value: "A5", label: "A5" },
  { value: "A6", label: "A6" },
  { value: "A7", label: "A7" },
  { value: "A8", label: "A8" },
  { value: "A9", label: "A9" },
  { value: "A10", label: "A10" },
];

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Setting = () => {
  const fileInputRef = useRef(null);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [color, setColor] = useState("#000");
  const [color2, setColor2] = useState("#FFFFFF");
  const [taxationPercentageGst, setTaxationPercentageGst] = useState("");
  const [taxationPercentageDescount, setTaxationPercentageDescount] =
    useState("");
  const [taxationPercentageShipping, setTaxationPercentageShipping] =
    useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [showPicker2, setShowPicker2] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("Template 1"); // State to keep track of selected template
  // const [autoSetDueDate, setAutoSetDueDate] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [invoiceNo, setInvoiceNo] = useState("");

  // const handleCheckboxChange = (event) => {
  //   setAutoSetDueDate(event.target.checked);
  //   if (!event.target.checked) {
  //     setNumberOfDays(0); // Reset number of days when checkbox is unchecked
  //   }
  // };

  // const handleCheckboxChange = (e) => {
  //   const isChecked = e.target.checked;
  //   setAutoSetDueDate(isChecked); // Update the checkbox state

  //   // Update localDefaultSetting with the new autoDueDate value
  //   setLocalDefaultSetting(prevState => ({
  //     ...prevState,
  //     autoDueDate: isChecked,
  //   }));
  // };

  const handleNumberOfDaysChange = (event) => {
    setNumberOfDays(event.target.value);
  };

  const handleTemplateSelect = (templateName) => {
    setSelectedTemplate(templateName); // Update the selected template state
  };

  const handleInputChangeGst = (event) => {
    setTaxationPercentageGst(event.target.value);
  };
  const handleInputChangeDescount = (event) => {
    setTaxationPercentageDescount(event.target.value);
  };
  const handleInputChangeShipping = (event) => {
    setTaxationPercentageShipping(event.target.value);
  };

  const handleColorChangeinput = (newColor) => {
    setColor(newColor.hex);
    // setShowPicker(false)
  };

  const handleColorChangeinput2 = (newColor) => {
    setColor2(newColor.hex);
    // setShowPicker(false)
  };

  // Toggle color picker visibility
  const togglePickerinput = () => {
    setShowPicker(!showPicker);
  };

  const togglePickerinput2 = () => {
    setShowPicker2(!showPicker2);
  };

  // 1111111111
  const [localDefaultSetting, setLocalDefaultSetting] = useState({
    image: null,
    currency: "INR",
    taxation: "GST",
    taxationPer: 0,
    discounts: 0,
    shipping: 0,
    invoiceNo: "Invoice No ",
    autoDueDays: 0,
    invoiceFrom: "",
    termsAndConditions: "",
    footNote: "",
    autoDueDate:false,
  });
  const [isChecked, setIsChecked] = useState(localDefaultSetting.autoDueDate);
  const [autoSetDueDate, setAutoSetDueDate] = useState(localDefaultSetting.autoDueDate);


  const [isImageSelected, setIsImageSelected] = useState(true);

  // const [currency, setCurrency] = useState("INR");
  const [pageOrientation, setPageOrientation] = useState("portrait");
  const [pageSize, setPageSize] = useState("A4");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTex, setIsOpenTex] = useState(false);
  const [checked, setChecked] = useState(false);

   const handleCheckboxChange = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    setAutoSetDueDate(newChecked); // Update autoSetDueDate state
    // Update localDefaultSetting with the new autoDueDate value
    setLocalDefaultSetting(prevState => ({
      ...prevState,
      autoDueDate: newChecked,
    }));
  };

  useEffect(() => {
    const storedSettings = localStorage.getItem("defaultSettings");
    if (storedSettings) {
      // Parse the stored JSON string into an object
      const parsedSettings = JSON.parse(storedSettings);
      setLocalDefaultSetting(parsedSettings);
      setIsChecked(parsedSettings.autoDueDate); 
    }
  }, []);

  // Store updated settings to localStorage whenever localDefaultSetting changes
  useEffect(() => {
    localStorage.setItem(
      "defaultSettings",
      JSON.stringify(localDefaultSetting)
    );
  }, [localDefaultSetting]);


  const handleSelectCurrency = (selectedCurrency) => {
    setLocalDefaultSetting((prevSettings) => ({
      ...prevSettings,
      currency: selectedCurrency,
    }));
  };

  const handleTaxationChange = (selectedTaxation) => {
    setLocalDefaultSetting((prevSettings) => ({
      ...prevSettings,
      taxation: selectedTaxation,
    }));
  };

  const handleTaxationPer = (selectedTaxationPer) => {
    setLocalDefaultSetting((prevSettings) => ({
      ...prevSettings,
      taxationPer: selectedTaxationPer,
    }));
  };

  const handleDiscounts = (selecteddiscounts) => {
    setLocalDefaultSetting((prevSettings) => ({
      ...prevSettings,
      discounts: selecteddiscounts,
    }));
  };

  const handleShipping = (selectedshipping) => {
    setLocalDefaultSetting((prevSettings) => ({
      ...prevSettings,
      shipping: selectedshipping,
    }));
  };

  const handleInvoiceNo = (selectedInvoiceNo) => {
    setLocalDefaultSetting((prevSettings) => ({
      ...prevSettings,
      invoiceNo: selectedInvoiceNo,
    }));
  };

  // const handleautoDueDays = (selectedautoDueDays) => {
  //   setLocalDefaultSetting((prevSettings) => ({
  //     ...prevSettings,
  //     autoDueDays: selectedautoDueDays,
  //   }));
  // }; 

  const handleautoDueDays = (value) => {
    // Ensure value is a number
    const autoDueDays = parseInt(value);
    setLocalDefaultSetting(prevState => ({
      ...prevState,
      autoDueDays: isNaN(autoDueDays) ? 0 : autoDueDays, // Set autoDueDays to 0 if value is NaN
    }));
  };

  const handleInvoiceFrom = (selectedinvoiceFrom) => {
    setLocalDefaultSetting((prevSettings) => ({
      ...prevSettings,
      invoiceFrom: selectedinvoiceFrom,
    }));
  };

  const handleTermsAndConditions = (selectedTermsAndConditions) => {
    setLocalDefaultSetting((prevSettings) => ({
      ...prevSettings,
      termsAndConditions: selectedTermsAndConditions,
    }));
  };

  const handleFoodNots = (selectedfootNote) => {
    setLocalDefaultSetting((prevSettings) => ({
      ...prevSettings,
      footNote: selectedfootNote,
    }));
  };

  const handleChangeButton = () => {
    setChecked(!checked);
  };

  const label = { inputProps: { "aria-label": "Switch demo" } };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenuTex = () => {
    setIsOpenTex(!isOpenTex);
  };

  const handleSelectpageOrientation = (value) => {
    setPageOrientation(value);
    setIsOpen(false);
  };

  const handleSelectpageSize = (value) => {
    setPageSize(value);
    setIsOpenTex(false);
  };


  const handleRemoveImage = () => {
    setLocalDefaultSetting((prevSettings) => ({
      ...prevSettings,
      image: null,
    }));
    setIsImageSelected(false);
  };


  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLocalDefaultSetting((prevSettings) => ({
          ...prevSettings,
          image: e.target.result,
        }));
        setIsImageSelected(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const [selectedColor, setSelectedColor] = useState("#213F6B");

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
  };

  return (
    <>
      <NavBar />
      <div className="costom-dark-mod ">
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                sx={{ fontSize: 12, letterSpacing: 0 }}
                className="costom-dark-mod-input border "
                label="Default Settings"
                {...a11yProps(0)}
              />
              <Tab
                sx={{ fontSize: 12, letterSpacing: 0 }}
                className="costom-dark-mod-input"
                label="PDF Settings"
                {...a11yProps(1)}
              />
              <Tab
                sx={{ fontSize: 12, letterSpacing: 0 }}
                className="costom-dark-mod-input"
                label="Template"
                {...a11yProps(2)}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div className="md:h-[82vh]">
              <div className="border border-gray-500 rounded pb-8">
                <div className="md:grid grid-cols-12 px-4">
                  <div className="col-span-5 ">
                    <div className="p-2">
                      {isImageSelected && localDefaultSetting.image ? (
                        <div>
                          <img
                            className="w-20 h-20"
                            src={localDefaultSetting.image}
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
                  <div className="col-span-7 ">
                    <div className="md:grid grid-cols-12 py-3">
                      <div className="px-2 col-span-6">
                        <div className="relative">
                          <div className="flex items-center border">
                            <span className="input-group-text">Currency</span>
                            <input
                              type="text"
                              className="form-input pl-10 pr-4 py-2 w-full costom-dark-mod-input outline-none"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              value={localDefaultSetting.currency}
                              readOnly
                              onClick={toggleMenu}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <BsFillCaretDownFill
                                className="cursor-pointer text-gray-500"
                                onClick={toggleMenu}
                              />
                            </div>
                          </div>
                          {isOpen && (
                            <div className="absolute z-20 w-full rounded-md bg-white shadow-lg">
                              <ul className="rounded">
                                {currencies.map((option) => (
                                  <li
                                    key={option.value}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 hover:text-black costom-dark-mod-input"
                                    onClick={() =>
                                      handleSelectCurrency(option.value)
                                    }
                                  >
                                    {option.label}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="px-2 col-span-6">
                        <div className="relative">
                          <div className="flex items-center border">
                            <span className="input-group-text">Taxation</span>
                            <input
                              type="text"
                              className="form-input pl-10 pr-4 py-2  w-full outline-none costom-dark-mod-input"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              value={localDefaultSetting.taxation}
                              readOnly
                              onClick={toggleMenuTex}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <BsFillCaretDownFill
                                className="cursor-pointer text-gray-500"
                                onClick={toggleMenuTex}
                              />
                            </div>
                          </div>
                          {isOpenTex && (
                            <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg costom-dark-mod-input">
                              <ul className="py-1">
                                {Taxations.map((option) => (
                                  <li
                                    key={option.value}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 hover:text-black"
                                    onClick={() =>
                                      handleTaxationChange(option.value)
                                    }
                                  >
                                    {option.label}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="py-3">
                        <div className="px-2 grid grid-cols-12 gap-4">
                          <div className="col-span-4">
                            <div className="flex flex-wrap w-full ">
                              <label
                                htmlFor="taxationPer"
                                className="input-group-text py-2 pr-2 w-1/5"
                              >
                                GST
                              </label>
                              <input
                                type="number"
                                value={localDefaultSetting.taxationPer}
                                onChange={(e) =>
                                  handleTaxationPer(e.target.value)
                                }
                                className="form-input flex-1 costom-dark-mod-input"
                                placeholder="Taxation Percentage"
                                id="taxationPer"
                              />
                            </div>
                          </div>
                          <div className="col-span-4">
                            <div className="flex flex-wrap w-full ">
                              <label
                                htmlFor="discounts"
                                className="input-group-text py-2 pr-2 w-1/5"
                              >
                                Discounts
                              </label>
                              <input
                                type="number"
                                value={localDefaultSetting.discounts}
                                onChange={(e) =>
                                  handleDiscounts(e.target.value)
                                }
                                className="form-input flex-1 px-3 costom-dark-mod-input"
                                placeholder="Discounts"
                                id="discounts"
                              />
                            </div>
                          </div>
                          <div className="col-span-4">
                            <div className="flex flex-wrap w-full ">
                              <label
                                htmlFor="shipping"
                                className="input-group-text py-2 pr-2 w-1/5"
                              >
                                Shipping
                              </label>
                              <input
                                type="number"
                                value={localDefaultSetting.shipping}
                                onChange={(e) => handleShipping(e.target.value)}
                                className="form-input w-full flex-1 px-3 costom-dark-mod-input"
                                placeholder="Shipping"
                                id="shipping"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-12 px-2 py-4">
                          <div className="col-span-12">
                            <div className="flex flex-wrap w-full ">
                              <label
                                htmlFor="invoiceNo"
                                className="input-group-text py-2 pr-2 w-1/5"
                              >
                                Invoice No
                              </label>
                              <input
                                type="text"
                                className="form-input flex-1 px-3 costom-dark-mod-input"
                                placeholder="Invoice No:"
                                id="invoiceNo"
                                value={localDefaultSetting.invoiceNo}
                                onChange={(e) =>
                                  handleInvoiceNo(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <ul className="flex flex-wrap gap-2 py-1 md:text-[12px] text-[10px]">
                                <li>
                                  <b>Exampal:</b>
                                </li>
                                <li>Invoice No:</li>
                                <li>Bill No:</li>
                                <li>Proforma Invoice No:</li>
                                <li>Receipt No:</li>
                                <li>Purchase Order:</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3 px-2">
                          <div className="flex flex-col md:grid grid-cols-12 items-center">
                            <div className="flex items-center col-span-4 mb-2 md:mb-0">
                              <input
                                type="checkbox"
                                id="AutoSetDueDate"
                                className="form-checkbox h-5 w-5 text-indigo-600"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                              />
                              <label htmlFor="AutoSetDueDate" className="ml-2">
                                Auto set Due Date
                              </label>
                            </div>

                            <div
                              className={`col-span-8 ${
                                autoSetDueDate ? "" : "opacity-50"
                              }`}
                            >
                              <div className="grid grid-cols-12">
                                <span className="px-2 py-1 bg-gray-200 text-gray-700 costom-dark-mod-input col-span-3">
                                  Today Date +
                                </span>
                                <input
                                  type="number"
                                  className="form-input flex-1 px-2 py-1 ml-2 md:ml-0 bg-slate-200 costom-dark-mod-input col-span-6"
                                  min="0"
                                  value={localDefaultSetting.autoDueDays}
                                  onChange={(e) =>
                                    handleautoDueDays(e.target.value)
                                  }
                                  disabled={!autoSetDueDate}
                                />
                                <span className="px-2 py-1 bg-gray-200 text-gray-700 ml-2 md:ml-0 costom-dark-mod-input col-span-3">
                                  No of Day(s)
                                </span>
                              </div>
                            </div>
                          </div>
                          {/*  */}
                          <DateComponent>
                            {(todayDate, futureDate) => (
                              <div className="mt-1 md:text-[12px] text-[10px] ">
                                <b>Example:</b>{" "}
                                <span>
                                  {todayDate} + 7 Days = {futureDate}
                                </span>
                              </div>
                            )}
                          </DateComponent>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" md:grid grid-cols-12 py-5 gap-4 px-4">
                  <div className="col-span-4 ">
                    <div className="">
                      <p>Invoice from</p>
                      <div>
                        <textarea
                          value={localDefaultSetting.invoiceFrom}
                          onChange={(e) => handleInvoiceFrom(e.target.value)}
                          placeholder="Who is this invoice from?"
                          className="w-full border outline-none h-24 p-2 rounded-lg costom-dark-mod-input"
                          name=""
                          id=""
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4 ">
                    <div className="">
                      <p>Terms & Conditions</p>
                      <div>
                        <textarea
                          value={localDefaultSetting.termsAndConditions}
                          onChange={(e) =>
                            handleTermsAndConditions(e.target.value)
                          }
                          placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                          className="w-full border outline-none h-24 p-2 rounded-lg costom-dark-mod-input"
                          name=""
                          id=""
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4 ">
                    <div className="">
                      <p>Foot Note</p>
                      <div>
                        <textarea
                          value={localDefaultSetting.footNote}
                          onChange={(e) => handleFoodNots(e.target.value)}
                          placeholder="Thank you for your business"
                          className="w-full border outline-none h-24 p-2 rounded-lg costom-dark-mod-input"
                          name=""
                          id=""
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <div className="md:h-[83vh]">
              <div className="border border-gray-500 rounded pb-8 pt-4 ">
                <div className="md:grid grid-cols-12 px-4">
                  <div className="col-span-3">
                    <div>
                      <p className="py-2">Background Color</p>
                      <SketchPicker
                        color={selectedColor}
                        onChange={handleColorChange}
                      />
                    </div>
                    <div className="mt-4">
                      <p>Selected Color:</p>
                      <div
                        className="w-12 h-12 rounded-md border border-gray-300"
                        style={{ backgroundColor: selectedColor }}
                      ></div>
                    </div>
                  </div>
                  <div className="col-span-9">
                    <div className="pb-5">
                      <div className="md:grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                          <div className="relative ">
                            <div className="flex items-center border">
                              <span className="input-group-text w-40">
                                Page Orientation
                              </span>
                              <input
                                type="text"
                                className="form-input pl-10 pr-4 py-2  w-full costom-dark-mod-input"
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-default"
                                value={pageOrientation}
                                readOnly
                                onClick={toggleMenu}
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <BsFillCaretDownFill
                                  className="cursor-pointer text-gray-500"
                                  onClick={toggleMenu}
                                />
                              </div>
                            </div>
                            {isOpen && (
                              <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10 costom-dark-mod-input">
                                <ul className="py-1">
                                  {pageOrientationVal.map((option) => (
                                    <li
                                      key={option.value}
                                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 hover:text-black"
                                      onClick={() =>
                                        handleSelectpageOrientation(
                                          option.value
                                        )
                                      }
                                    >
                                      {option.label}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-span-6">
                          <div className="relative ">
                            <div className="flex items-center border">
                              <span className="input-group-text w-40">
                                Page Size
                              </span>
                              <input
                                type="text"
                                className="form-input pl-10 pr-4 py-2  w-full costom-dark-mod-input"
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-default"
                                value={pageSize}
                                readOnly
                                onClick={toggleMenuTex}
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <BsFillCaretDownFill
                                  className="cursor-pointer text-gray-500"
                                  onClick={toggleMenuTex}
                                />
                              </div>
                            </div>
                            {isOpenTex && (
                              <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10 costom-dark-mod-input">
                                <ul className="py-1">
                                  {pageSizeVal.map((option) => (
                                    <li
                                      key={option.value}
                                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 hover:text-black"
                                      onClick={() =>
                                        handleSelectpageSize(option.value)
                                      }
                                    >
                                      {option.label}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pb-5">
                      <div className="border border-gray-700 rounded-md ">
                        <div className="px-">
                          <div className="font-semibold text-2xl py-1 px-2 costom-dark-mod-input">
                            Watermark
                          </div>
                          <div className="w-full bg-black h-[1px]"></div>
                          <hr />
                          <div className="px-2 py-2">
                            <div className="mb-3 flex w-full">
                              <span
                                className="flex-shrink-0 px-3 py-2 bg-gray-200 text-gray-700 costom-dark-mod"
                                id="inputGroup-sizing-default"
                              >
                                Default
                              </span>
                              <input
                                type="text"
                                className="flex-grow px-3 w-full py-2 rounded-r-md border border-gray-300 focus:outline-none focus:border-blue-500 costom-dark-mod-input"
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-default"
                              />
                            </div>
                          </div>
                          {/*  */}
                          <div className="px-2 py-2">
                            <div className="mb-3 sm:flex w-full items-center">
                              <span className="flex-shrink-0 px-3 py-2 bg-gray-200 text-gray-700 rounded-l-md costom-dark-mod">
                                Opacity
                              </span>

                              <input
                                type="text"
                                className="flex-grow px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 costom-dark-mod-input costom-dark-mod-input"
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-default"
                              />
                              <div className=" border p-2 flex items-center">
                                <input
                                  type="checkbox"
                                  id="boldCheckbox"
                                  className="mr-2"
                                />
                                <label htmlFor="boldCheckbox">Bold</label>
                              </div>

                              <div className=" border p-2 flex items-center">
                                <input
                                  type="checkbox"
                                  id="italicCheckbox"
                                  className="mr-2"
                                />
                                <label htmlFor="italicCheckbox">Italic</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*  */}
                    <div className="border border-gray-700 rounded-md ">
                      <div className="px-">
                        <div className="flex items-center costom-dark-mod-input">
                          <div className="font-semibold text-xl py-1 px-2">
                            QR Code
                          </div>
                          <div>
                            <Switch {...label} />
                          </div>
                          <div>Active</div>
                        </div>
                        <div className="w-full bg-black h-[1px]"></div>
                        <hr />

                        <div className="px-2 py-2">
                          <div className="mb-3 sm:flex w-full items-center">
                            <span className="flex-shrink-0 px-3 py-2 bg-gray-200 text-gray-700 rounded-l-md costom-dark-mod">
                              Test
                            </span>

                            <input
                              type="text"
                              className="flex-grow px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 costom-dark-mod-input"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                            />

                            <div className=" p-1 flex items-center ">
                              <Switch
                                checked={checked}
                                onChange={handleChangeButton}
                                inputProps={{
                                  "aria-label": "Append Invoice No",
                                }}
                              />
                              <label
                                htmlFor="appendInvoiceNo"
                                onClick={handleChangeButton}
                                className="cursor-pointer"
                              >
                                Append Invoice No
                              </label>
                            </div>
                          </div>
                          <div className="form-text pb-2">
                            <b className="font-bold">Example:</b>
                            <span className="ml-1">
                              <span className="flex">
                                https://www.example.com/pay?invoice=12345
                              </span>
                            </span>
                            <span className="ml-1 font-bold">or</span>
                            <span className="ml-1">
                              What every text want to add in QR code
                            </span>
                          </div>
                        </div>
                      </div>

                      {/*  */}
                      <div className="flex flex-wrap items-center pb-5  px-2">
                        {/* Text/Foreground Color */}
                        <div className="flex items-center mb-2 md:mb-0">
                          <label htmlFor="textColor" className="mr-2">
                            Text/Foreground Color:
                          </label>
                          <div className="relative">
                            {/* Color Picker for Text/Foreground Color */}
                            <div
                              className="cursor-pointer rounded-full sm:w-8 w-4 h-4 sm:h-8 md:w-10 md:h-10 bg-gray-300 border border-gray-400"
                              style={{ backgroundColor: color }}
                              onClick={togglePickerinput}
                            />
                            {showPicker && (
                              <div className="absolute z-10 mt-2">
                                <SketchPicker
                                  color={color}
                                  onChange={handleColorChangeinput}
                                />
                              </div>
                            )}
                          </div>
                          {/* Text input for Text/Foreground Color */}
                          <input
                            type="text"
                            id="textColor"
                            className="ml-2 sm:w-full w-16 px-3 py-1 border border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{ backgroundColor: color, color: "#000" }}
                            readOnly
                          />
                        </div>

                        {/* Background Color */}
                        <div className="flex items-center mb-2 md:mb-0 ml-0 md:ml-4">
                          <label htmlFor="textColor2" className="mr-2">
                            Background Color:
                          </label>
                          <div className="relative">
                            {/* Color Picker for Background Color */}
                            <div
                              className="cursor-pointer rounded-full w-4 sm:w-8 h-4 sm:h-8 md:w-10 md:h-10 bg-gray-300 border border-gray-400"
                              style={{ backgroundColor: color2 }}
                              onClick={togglePickerinput2}
                            />
                            {showPicker2 && (
                              <div className="absolute z-10 mt-2">
                                <SketchPicker
                                  color={color2}
                                  onChange={handleColorChangeinput2}
                                />
                              </div>
                            )}
                          </div>
                          {/* Text input for Background Color */}
                          <input
                            type="text"
                            id="textColor2"
                            className="ml-2 px-3 py-1 border sm:w-full w-16 border-gray-300 focus:outline-none focus:border-blue-500"
                            style={{
                              backgroundColor: color2,
                              color: "#FFFFFF",
                            }}
                            readOnly
                          />
                        </div>

                        {/* ECC Level */}
                        <div className="flex items-center mt-2 md:mt-0 ml-0 md:ml-4">
                          <label htmlFor="qrCodeEccLevel" className="mr-2">
                            ECC Level:
                          </label>
                          <select
                            className="form-select mr-2 costom-dark-mod-input outline-none"
                            name="qrCodeEccLevel"
                            id="qrCodeEccLevel"
                          >
                            <option value="L">Low</option>
                            <option value="M">Medium</option>
                            <option value="Q">Quartile</option>
                            <option value="H">High</option>
                          </select>
                          <span className="text-blue-500">
                            <Link
                              to="https://en.wikipedia.org/wiki/QR_code#Error_correction"
                              target="_blank"
                              rel="noreferrer"
                              className="ml-2"
                            >
                              wiki
                            </Link>
                          </span>
                        </div>
                      </div>

                      {/*  */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <div className="border border-black pb-8 rounded">
              <div className="md:grid grid-cols-12 gap-5 px-4 md:space-y-0 space-y-5 ">
                <div className="lg:col-span-3 md:col-span-4 border border-black">
                  <Card>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image="/Template/Template 1.jpg"
                        alt="green iguana"
                      />
                      <CardContent></CardContent>
                    </CardActionArea>
                    <CardActions className="costom-dark-mod-input">
                      <label>
                        <input
                          type="radio"
                          name="template"
                          style={{ display: "none" }} // Hide the actual radio button
                          onChange={() => handleTemplateSelect("Template 1")}
                        />
                        <Button
                          size="small"
                          style={{
                            backgroundColor:
                              selectedTemplate === "Template 1"
                                ? "#1976d2"
                                : "white",
                            color:
                              selectedTemplate === "Template 1"
                                ? "white"
                                : "black",
                          }}
                          onClick={() => handleTemplateSelect("Template 1")}
                        >
                          Template 1
                        </Button>
                      </label>
                    </CardActions>
                  </Card>
                </div>
                <div className="lg:col-span-3 md:col-span-4 border border-black">
                  <Card>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image="/Template/Template 2.jpg"
                        alt="green iguana"
                      />
                      <CardContent></CardContent>
                    </CardActionArea>
                    <CardActions className="costom-dark-mod-input">
                      <label>
                        <input
                          type="radio"
                          name="template"
                          style={{ display: "none" }} // Hide the actual radio button
                          onChange={() => handleTemplateSelect("Template 2")}
                        />
                        <Button
                          size="small"
                          style={{
                            backgroundColor:
                              selectedTemplate === "Template 2"
                                ? "#1976d2"
                                : "white",
                            color:
                              selectedTemplate === "Template 2"
                                ? "white"
                                : "black",
                          }}
                          onClick={() => handleTemplateSelect("Template 2")}
                        >
                          Template 2
                        </Button>
                      </label>
                    </CardActions>
                  </Card>
                </div>
                <div className="lg:col-span-3 md:col-span-4 border border-black">
                  <Card>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image="/Template/Template 3.jpg"
                        alt="green iguana"
                      />
                      <CardContent></CardContent>
                    </CardActionArea>
                    <CardActions className="costom-dark-mod-input">
                      <label>
                        <input
                          type="radio"
                          name="template"
                          style={{ display: "none" }} // Hide the actual radio button
                          onChange={() => handleTemplateSelect("Template 3")}
                        />
                        <Button
                          size="small"
                          style={{
                            backgroundColor:
                              selectedTemplate === "Template 3"
                                ? "#1976d2"
                                : "white",
                            color:
                              selectedTemplate === "Template 3"
                                ? "white"
                                : "black",
                          }}
                          onClick={() => handleTemplateSelect("Template 3")}
                        >
                          Template 3
                        </Button>
                      </label>
                    </CardActions>
                  </Card>
                </div>
                <div className="lg:col-span-3 md:col-span-4 border border-black">
                  <Card>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image="/Template/Template 2.jpg"
                        alt="green iguana"
                      />
                      <CardContent></CardContent>
                    </CardActionArea>
                    <CardActions className="costom-dark-mod-input">
                      <label>
                        <input
                          type="radio"
                          name="template"
                          style={{ display: "none" }} // Hide the actual radio button
                          onChange={() => handleTemplateSelect("Template 4")}
                        />
                        <Button
                          size="small"
                          style={{
                            backgroundColor:
                              selectedTemplate === "Template 4"
                                ? "#1976d2"
                                : "white",
                            color:
                              selectedTemplate === "Template 4"
                                ? "white"
                                : "black",
                          }}
                          onClick={() => handleTemplateSelect("Template 4")}
                        >
                          Template 4
                        </Button>
                      </label>
                    </CardActions>
                  </Card>
                </div>
                <div className="lg:col-span-3 md:col-span-4 border border-black">
                  <Card>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image="/Template/Template 5.jpg"
                        alt="green iguana"
                      />
                      <CardContent></CardContent>
                    </CardActionArea>
                    <CardActions className="costom-dark-mod-input">
                      <label>
                        <input
                          type="radio"
                          name="template"
                          style={{ display: "none" }} // Hide the actual radio button
                          onChange={() => handleTemplateSelect("Template 5")}
                        />
                        <Button
                          size="small"
                          style={{
                            backgroundColor:
                              selectedTemplate === "Template 5"
                                ? "#1976d2"
                                : "white",
                            color:
                              selectedTemplate === "Template 5"
                                ? "white"
                                : "black",
                          }}
                          onClick={() => handleTemplateSelect("Template 5")}
                        >
                          Template 5
                        </Button>
                      </label>
                    </CardActions>
                  </Card>
                </div>
                <div className="lg:col-span-3 md:col-span-4 border border-black">
                  <Card>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image="/Template/Template 2.jpg"
                        alt="green iguana"
                      />
                      <CardContent></CardContent>
                    </CardActionArea>
                    <CardActions className="costom-dark-mod-input">
                      <label>
                        <input
                          type="radio"
                          name="template"
                          style={{ display: "none" }} // Hide the actual radio button
                          onChange={() => handleTemplateSelect("Template 6")}
                        />
                        <Button
                          size="small"
                          style={{
                            backgroundColor:
                              selectedTemplate === "Template 6"
                                ? "#1976d2"
                                : "white",
                            color:
                              selectedTemplate === "Template 6"
                                ? "white"
                                : "black",
                          }}
                          onClick={() => handleTemplateSelect("Template 6")}
                        >
                          Template 6
                        </Button>
                      </label>
                    </CardActions>
                  </Card>
                </div>
              </div>
            </div>
          </CustomTabPanel>
        </Box>
      </div>
    </>
  );
};

export default Setting;

// https://en.wikipedia.org/wiki/QR_code#Error_correction
