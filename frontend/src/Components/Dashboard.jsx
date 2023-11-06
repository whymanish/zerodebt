import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [totalDebt, setTotalDebt] = useState(250000);
  const [totalCollection, setTotalCollection] = useState(0);
  const [todayCollection, setTodayCollection] = useState(0);
  const [collectionRecords, setCollectionRecords] = useState([]);
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true); // Set to true to display modal initially
  const [enteredToken, setEnteredToken] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const width = ((totalCollection / totalDebt) * 100).toFixed(2);

  // Function to fetch data and update the progress bar
  const fetchData = async () => {
    try {
      const apiUrl = 'http://localhost:5000/api';

      const summaryResponse = await axios.get(`${apiUrl}/summary`);
      const collectionResponse = await axios.get(`${apiUrl}/collection-records`);

      const summaryData = summaryResponse.data;
      const collectionData = collectionResponse.data;

      setTotalCollection(summaryData.totalCollection);
      setTodayCollection(summaryData.todayCollection);
      setCollectionRecords(collectionData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchData();
  }, [totalDebt, todayCollection]);

  useEffect(() => {
    if (isValidToken) {
      // Fetch data only when the token is valid
      fetchData();
    }
  }, [isValidToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (enteredToken === 'DEBTZERO') {
      setIsValidToken(true);
      setIsModalOpen(false); // Close the modal when the token is valid
    } else {
      setIsValidToken(false);
    }
    // Check if the date and amount are not empty
    if (date && amount) {
      const newCollection = { date, amount };

      try {
        const response = await axios.post('http://localhost:5000/api/add-collection', newCollection);
        console.log(response.data);
        setDate('');
        setAmount('');

        // After adding data, trigger data fetching to update the collectionRecords
        fetchData();
      } catch (error) {
        console.error(error);
      }
    } 
    
  };

  return (
    <div >
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-container bg-gray-100 w-full max-w-md mx-auto rounded-2xl  z-50 overflow-y-auto">
            <div className="modal-content py-4 text-left px-6">
              <div className="modal-header">
                <h3 className="text-2xl font-semibold">Enter Secret Token</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body mt-2">
                  <input
                    type="password"
                    value={enteredToken}
                    onChange={(e) => setEnteredToken(e.target.value)}
                    placeholder="Secret Token"
                    className="input-box border border-gray-300 p-2 w-full rounded-xl mt-2 focus:outline-none focus:ring focus:ring-blue-200"
                  />
                  {!isValidToken && (
                    <p className="text-red-500 mt-2 text-sm">Enter Correct Token</p>
                  )}
                </div>
                <div className="modal-footer mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {isValidToken && (
      <div className='max-w-7xl p-4 mx-auto mt-12'>
        <div className='w-full py-8 bg-gray-800 rounded-2xl dark:bg-gray-700'>
          <h1 className='text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 font-bold text-center'>{width}% Completed</h1>
        </div>
        <div className='flex justify-center'>
          <div className='grid mt-10 lg:grid-cols-3 gap-4'>
            <div className='bg-gradient-to-r from-gray-700 via-gray-900 to-black rounded-xl w-96 h-20'>
              <h1 className='text-2xl font-bold text-white text-center mt-6'>
                Total Debt : {totalDebt} RS
              </h1>
            </div>
            <div className='bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl w-96 h-20'>
              <h1 className='text-2xl font-bold text-white text-center mt-6'>
                Total Collection : {totalCollection} RS
              </h1>
            </div>
            <div className='bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-indigo-200 via-slate-600 to-indigo-200 rounded-xl w-96 h-20'>
              <h1 className='text-2xl font-bold text-white text-center mt-6'>
                Today's Collection: {collectionRecords.reduce((total, record) => record.amount, 0)} RS
              </h1>
            </div>
          </div>
        </div>
        <h1 className='text-center text-gray-500 text-xl font-bold mt-10'>
          Add Today's Collection
        </h1>
        <div className='flex justify-center'>
          <div className='bg-gradient-to-r from-gray-400 via-gray-400 to-gray-200 py-4 px-6 p-4 border-2 rounded-2xl mt-4'>
            <form onSubmit={handleSubmit}>
              <div className='grid lg:grid-cols-3 lg:gap-4'>
                <div className=''>
                  <label className='block mb-2 text-sm font-medium text-white dark:text-gray-200'>
                    Date
                  </label>
                  <input
                    type='text'
                    name='date'
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className='block w-full px-4 py-4 mt-2 text-gray-700 bg-white border rounded-xl'
                    placeholder='Enter Date'
                    required // Add the required attribute
                  />
                </div>
                <div className=''>
                  <label className='block mb-2 text-sm font-medium text-white dark:text-gray-200'>
                    Amount
                  </label>
                  <input
                    type='text'
                    name='amount'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className='block w-full px-4 py-4 mt-2 text-gray-700 bg-white border rounded-xl'
                    placeholder='Enter Amount'
                    required // Add the required attribute
                    pattern='[0-9]*' // Allow only numeric values
                  />
                </div>
                <div className=''>
                  <label className='block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200'>
                    &nbsp;
                  </label>
                  <button
                    type='submit'
                    className='block w-full px-4 py-4 mt-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 font-bold transition rounded-xl'
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className='relative max-w-4xl mx-auto overflow-x-auto shadow-md mt-4 sm:rounded-lg'>
          <div className='h-64 scrollbar-hide overflow-y-auto' >
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
            <thead className='  text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Sr.No
                </th>
                <th scope='col' className='px-6 py-3'>
                  Date
                </th>
                <th scope='col' className='px-6 py-3'>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {collectionRecords.map((record, index) => (
                <tr
                  key={index}
                  className='bg-white border-b dark:bg-gray-900 dark:border-gray-700'
                >
                  <th
                    scope='row'
                    className='px-6 font-semibold text-lg py-4 text-gray-900 whitespace-nowrap dark:text-white'
                  >
                    {index + 1}
                  </th>
                  <td className='px-6 font-semibold text-lg py-4'>{record.date}</td>
                  <td className='px-6 font-semibold text-lg py-4'>{record.amount} RS</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
       )}
    </div>
  );
};

export default Dashboard;
