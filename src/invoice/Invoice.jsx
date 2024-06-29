import React from 'react'
import NavBar from '../navBar/NavBar'

const Invoice = ({ darkMode, toggleDarkMode , filteredInvoices}) => {
  console.log("filteredInvoices",filteredInvoices)
  return (
    <div>
        <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className='px-5 costom-dark-mod'>
      <table id="invoiceTable" className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                    <th className="px-4 py-2 border-b-2 text-left">Invoice No</th>
                    <th className="px-4 py-2 border-b-2 text-left">Invoice Date</th>
                    <th className="px-4 py-2 border-b-2 text-left">Due Date</th>
                    <th className="px-4 py-2 border-b-2 text-left">Currency</th>
                    <th className="px-4 py-2 border-b-2 text-left">Invoice To</th>
                    <th className="px-4 py-2 border-b-2 text-left">Action</th>
                </tr>
                {/* <tr>
                    <th className="px-4 py-2 border-b-2 text-left"><input type="text" placeholder="Invoice No" className="w-24  rounded px-2 py-1"/></th>
                    <th className="px-4 py-2 border-b-2 text-left"><input type="text" placeholder="Invoice Date" className="w-52  rounded px-2 py-1"/></th>
                    <th className="px-4 py-2 border-b-2 text-left"><input type="text" placeholder="Due Date" className="w-52  rounded px-2 py-1"/></th>
                    <th className="px-4 py-2 border-b-2 text-left"><input type="text" placeholder="Currency" className="w-24  rounded px-2 py-1"/></th>
                    <th className="px-4 py-2 border-b-2 text-left"><input type="text" placeholder="Invoice To" className="w-full  rounded px-2 py-1"/></th>
                    <th className="px-4 py-2 border-b-2 text-left"></th>
                </tr> */}
            </thead>
            <tbody>
                <tr className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">884937</td>
                    <td className="px-4 py-2 border-b">2024-06-29</td>
                    <td className="px-4 py-2 border-b">2024-06-29</td>
                    <td className="px-4 py-2 border-b">USD</td>
                    <td className="px-4 py-2 border-b">Customer 1</td>
                    <td className="px-4 py-2 border-b">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded">Open</button>
                        <button className="bg-green-500 text-white px-3 py-1 rounded">Download</button>
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded">Print</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                    </td>
                </tr>
                <tr className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">60694</td>
                    <td className="px-4 py-2 border-b">2024-06-29</td>
                    <td className="px-4 py-2 border-b">2024-06-29</td>
                    <td className="px-4 py-2 border-b">USD</td>
                    <td className="px-4 py-2 border-b">Customer 2</td>
                    <td className="px-4 py-2 border-b">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded">Open</button>
                        <button className="bg-green-500 text-white px-3 py-1 rounded">Download</button>
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded">Print</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                    </td>
                </tr>
                <tr className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">47932</td>
                    <td className="px-4 py-2 border-b">2024-06-29</td>
                    <td className="px-4 py-2 border-b">2024-06-29</td>
                    <td className="px-4 py-2 border-b">USD</td>
                    <td className="px-4 py-2 border-b">Customer 3</td>
                    <td className="px-4 py-2 border-b">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded">Open</button>
                        <button className="bg-green-500 text-white px-3 py-1 rounded">Download</button>
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded">Print</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default Invoice
