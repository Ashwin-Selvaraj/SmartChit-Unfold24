import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppContext } from './Context';
import { Web3Button } from '@thirdweb-dev/react';

const NewChitForm = () => {
  const { submitChit } = useAppContext();
  const [formData, setFormData] = useState({
    chitName: '',
    chitDetails: '',
    totalAmount: '',
    installmentAmount: '',
    duration: '',
    participantCount: '',
    endDate: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    submitChit(formData);
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center">
        <div className="w-1/3 border-r-2 pr-4">
          <h3 className="text-lg font-semibold mt-16 mb-4 text-gray-700">Chit Fund Rules</h3>
          <ul className="list-disc text-gray-600 ml-4">
            <li>One member is selected each cycle to receive the fund.</li>
            <li>All contributions are equally divided among participants.</li>
            <li>The recipient is chosen randomly for fairness.</li>
            <li>Each participant must contribute a fixed amount per cycle.</li>
            <li>Early withdrawal is not allowed until the chit term ends.</li>
          </ul>
        </div>
        <div className="w-2/3 pl-6 mt-16">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">Start a New Chit Fund</h3>
          <form>
            <label htmlFor="chitName" className="block text-gray-700 font-medium mb-2">Chit Name:</label>
            <input 
              onChange={handleInputChange} 
              type="text" 
              id="chitName" 
              name="chitName" 
              placeholder="Enter chit name" 
              className="bg-gray-50 w-full mb-4 p-2 border border-gray-300 rounded" 
            />

            <label htmlFor="chitDetails" className="block text-gray-700 font-medium mb-2">Description:</label>
            <textarea 
              onChange={handleInputChange} 
              id="chitDetails" 
              name="chitDetails" 
              placeholder="Provide a brief description" 
              className="bg-gray-50 w-full mb-4 p-2 border border-gray-300 rounded" 
            />

            <label htmlFor="totalAmount" className="block text-gray-700 font-medium mb-2">Total Fund Value (ETH):</label>
            <input 
              onChange={handleInputChange} 
              type="number" 
              id="totalAmount" 
              name="totalAmount" 
              placeholder="e.g., 1.5" 
              className="bg-gray-50 w-full mb-4 p-2 border border-gray-300 rounded" 
            />

            <label htmlFor="installmentAmount" className="block text-gray-700 font-medium mb-2">Installment Amount (ETH):</label>
            <input 
              onChange={handleInputChange} 
              type="number" 
              id="installmentAmount" 
              name="installmentAmount" 
              placeholder="e.g., 0.3" 
              className="bg-gray-50 w-full mb-4 p-2 border border-gray-300 rounded" 
            />

            <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">Duration (Months):</label>
            <input 
              onChange={handleInputChange} 
              type="number" 
              id="duration" 
              name="duration" 
              placeholder="e.g., 6" 
              className="bg-gray-50 w-full mb-4 p-2 border border-gray-300 rounded" 
            />

            <label htmlFor="participantCount" className="block text-gray-700 font-medium mb-2">Number of Participants:</label>
            <input 
              onChange={handleInputChange} 
              type="number" 
              id="participantCount" 
              name="participantCount" 
              placeholder="e.g., 5" 
              className="bg-gray-50 w-full mb-4 p-2 border border-gray-300 rounded" 
            />

            <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">Deadline:</label>
            <input 
              onChange={handleInputChange} 
              type="date" 
              id="endDate" 
              name="endDate" 
              className="bg-gray-50 w-full mb-4 p-2 border border-gray-300 rounded" 
            />

            <button 
              onClick={handleFormSubmit} 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded">Create Chit
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewChitForm;
