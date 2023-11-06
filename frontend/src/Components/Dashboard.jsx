import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [totalDebt, setTotalDebt] = useState(250000);
  const [totalCollection, setTotalCollection] = useState(0);
  const [todayCollection, setTodayCollection] = useState(0);
  const [collectionRecords, setCollectionRecords] = useState([]);
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  return (
    <div>
      <div className='max-w-7xl p-4 mx-auto mt-12'>
        <div className='w-full py-8 bg-gray-800 rounded-2xl dark:bg-gray-700'>
          <h1 className='text-5xl text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 font-bold text-center'>{width}% Completed</h1>
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
                Today's Collection : {todayCollection} RS
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
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
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
  );
};

export default Dashboard;
