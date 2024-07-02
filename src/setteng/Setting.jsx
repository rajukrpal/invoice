import * as React from "react";
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
  const fileInputRef = React.useRef(null);
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [color, setColor] = React.useState("#000"); // Initial color state, white in this case
  const [color2, setColor2] = React.useState("#FFFFFF"); // Initial color state, white in this case
  const [showPicker, setShowPicker] = React.useState(false);
  const [showPicker2, setShowPicker2] = React.useState(false);

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
  const [isImageSelected, setIsImageSelected] = React.useState(true);
  const [image, setImage] = React.useState(null);

  const [currency, setCurrency] = React.useState("INR");
  const [pageOrientation, setPageOrientation] = React.useState("portrait");
  const [pageSize, setPageSize] = React.useState("A4");
  const [taxation, setTaxation] = React.useState("GST");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenTex, setIsOpenTex] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

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

  const handleSelectCurrency = (value) => {
    setCurrency(value);
    setIsOpen(false);
  };

  const handleSelectpageOrientation = (value) => {
    setPageOrientation(value);
    setIsOpen(false);
  };

  const handleSelectpageSize = (value) => {
    setPageSize(value);
    setIsOpenTex(false);
  };

  const handleSelectTex = (value) => {
    setTaxation(value);
    setIsOpenTex(false);
  };

  const handleRemoveImage = () => {
    // setSelectedImage(null);
    setImage(null);
    setIsImageSelected(true);
    // Clear file input (optional, if needed)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  const [selectedColor, setSelectedColor] = React.useState("#213F6B");

  const handleColorChange = (color) => {
    setSelectedColor(color.hex); // Update state with selected color
  };

  return (
    <>
      <NavBar />
      <div className="costom-dark-mod h-[93vh]">
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Default Settings" {...a11yProps(0)} />
              <Tab label="PDF Settings" {...a11yProps(1)} />
              <Tab label="Template" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div>
              <div className="md:grid grid-cols-12 ">
                <div className="col-span-5 ">
                  <div className="p-2">
                    {isImageSelected && image ? (
                      <div>
                        <img className="w-20 h-20" src={image} alt="Selected" />
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
                            className="form-input pl-10 pr-4 py-2 rounded-md w-full"
                            aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-default"
                            value={currency}
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
                          <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg">
                            <ul className="py-1">
                              {currencies.map((option) => (
                                <li
                                  key={option.value}
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
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
                            className="form-input pl-10 pr-4 py-2 rounded-md w-full"
                            aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-default"
                            value={taxation}
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
                          <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg">
                            <ul className="py-1">
                              {Taxations.map((option) => (
                                <li
                                  key={option.value}
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleSelectTex(option.value)}
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
                              className="form-input flex-1"
                              placeholder="Taxation Percentage"
                              id="taxationPer"
                              value=""
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
                              className="form-input flex-1 px-3"
                              placeholder="Discounts"
                              id="discounts"
                              value=""
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
                              className="form-input flex-1 px-3"
                              placeholder="Shipping"
                              id="shipping"
                              value=""
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
                              className="form-input flex-1 px-3"
                              placeholder="Invoice No:"
                              id="invoiceNo"
                              value=""
                            />
                          </div>
                          <div>
                            <ul className="flex flex-wrap gap-2 py-1">
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
                            />
                            <label htmlFor="AutoSetDueDate" className="ml-2">
                              Auto set Due Date
                            </label>
                          </div>

                          <div className="flex flex-col md:flex-row justify-between items-center col-span-8">
                            <div className="flex items-center mb-2 md:mb-0">
                              <span className="px-2 py-1 bg-gray-200 text-gray-700">
                                Today Date +
                              </span>
                              <input
                                type="number"
                                className="form-input flex-1 px-2 py-1 ml-2 md:ml-0"
                                min="0"
                                value="0"
                                disabled
                              />
                              <span className="px-2 py-1 bg-gray-200 text-gray-700 ml-2 md:ml-0">
                                No of Day(s)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-1">
                          <b>Example:</b>{" "}
                          <span>2024-07-02 + 7 Days = 2024-07-09</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" md:grid grid-cols-12 py-5 gap-4">
                <div className="col-span-4 ">
                  <div className="">
                    <p>Invoice from</p>
                    <div>
                      <textarea
                        // value={invoiceFrom}
                        // onChange={(e) => setInvoicefrom(e.target.value)}
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
                        // value={invoiceFrom}
                        // onChange={(e) => setInvoicefrom(e.target.value)}
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
                        // value={invoiceFrom}
                        // onChange={(e) => setInvoicefrom(e.target.value)}
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
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <div>
              <div className="md:grid grid-cols-12">
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
                              className="form-input pl-10 pr-4 py-2 rounded-md w-full"
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
                            <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                              <ul className="py-1">
                                {pageOrientationVal.map((option) => (
                                  <li
                                    key={option.value}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() =>
                                      handleSelectpageOrientation(option.value)
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
                              className="form-input pl-10 pr-4 py-2 rounded-md w-full"
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
                            <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                              <ul className="py-1">
                                {pageSizeVal.map((option) => (
                                  <li
                                    key={option.value}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
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
                    <div className="border border-black rounded-md ">
                      <div className="px-">
                        <div className="font-semibold text-2xl py-1 px-2">
                          Watermark
                        </div>
                        <div className="w-full bg-black h-[1px]"></div>
                        <hr />
                        <div className="px-2 py-2">
                          <div className="mb-3 flex w-full">
                            <span
                              className="flex-shrink-0 px-3 py-2 bg-gray-200 text-gray-700"
                              id="inputGroup-sizing-default"
                            >
                              Default
                            </span>
                            <input
                              type="text"
                              className="flex-grow px-3 py-2 rounded-r-md border border-gray-300 focus:outline-none focus:border-blue-500"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                            />
                          </div>
                        </div>
                        {/*  */}
                        <div className="px-2 py-2">
                          <div className="mb-3 flex w-full items-center">
                            <span className="flex-shrink-0 px-3 py-2 bg-gray-200 text-gray-700 rounded-l-md">
                              Opacity
                            </span>

                            <input
                              type="text"
                              className="flex-grow px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 "
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
                  <div className="border border-black rounded-md ">
                    <div className="px-">
                      <div className="flex items-center">
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
                        <div className="mb-3 flex w-full items-center">
                          <span className="flex-shrink-0 px-3 py-2 bg-gray-200 text-gray-700 rounded-l-md">
                            Test
                          </span>

                          <input
                            type="text"
                            className="flex-grow px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                            aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-default"
                          />

                          <div className="border p-1 flex items-center ">
                            <Switch
                              checked={checked}
                              onChange={handleChangeButton}
                              inputProps={{ "aria-label": "Append Invoice No" }}
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
                        <div className="form-text mb-3">
                          <b className="font-bold">Example:</b>
                          <span className="ml-1">
                            <span className="">
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
                    <div className="flex flex-wrap items-center mb-4 px-2">
                      {/* Text/Foreground Color */}
                      <div className="flex items-center mb-2 md:mb-0">
                        <label htmlFor="textColor" className="mr-2">
                          Text/Foreground Color:
                        </label>
                        <div className="relative">
                          {/* Color Picker for Text/Foreground Color */}
                          <div
                            className="cursor-pointer rounded-full w-8 h-8 md:w-10 md:h-10 bg-gray-300 border border-gray-400"
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
                          className="ml-2 px-3 py-1 border border-gray-300 focus:outline-none focus:border-blue-500"
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
                            className="cursor-pointer rounded-full w-8 h-8 md:w-10 md:h-10 bg-gray-300 border border-gray-400"
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
                          className="ml-2 px-3 py-1 border border-gray-300 focus:outline-none focus:border-blue-500"
                          style={{ backgroundColor: color2, color: "#FFFFFF" }}
                          readOnly
                        />
                      </div>

                      {/* ECC Level */}
                      <div className="flex items-center mt-2 md:mt-0 ml-0 md:ml-4">
                        <label htmlFor="qrCodeEccLevel" className="mr-2">
                          ECC Level:
                        </label>
                        <select
                          className="form-select mr-2"
                          name="qrCodeEccLevel"
                          id="qrCodeEccLevel"
                        >
                          <option value="L">Low</option>
                          <option value="M">Medium</option>
                          <option value="Q">Quartile</option>
                          <option value="H">High</option>
                        </select>
                        <span className="text-blue-500">
                          <a
                            href="https://en.wikipedia.org/wiki/QR_code#Error_correction"
                            target="_blank"
                            rel="noreferrer"
                            className="ml-2"
                          >
                            wiki
                          </a>
                        </span>
                      </div>
                    </div>

                    {/*  */}
                  </div>
                </div>
              </div>
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            Item Three
          </CustomTabPanel>
        </Box>
      </div>
    </>
  );
};

export default Setting;

// https://en.wikipedia.org/wiki/QR_code#Error_correction
