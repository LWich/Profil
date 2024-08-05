import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApi } from './ApiContext';

const StatusProductTable = () => {
  const { apiEndpoints } = useApi();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(apiEndpoints['statusproduct']);

  const fetchTableData = async (url) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('Authentication token not found');
      setLoading(false);
      return;
    }

    if (!url) {
      setError('API endpoint not found');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.results) {
        setTableData(response.data.results);
        setNextPage(response.data.links.next);
        setPrevPage(response.data.links.previous);
      } else {
        setError('Invalid data format');
      }
      setLoading(false);
    } catch (err) {
      console.error(err); // Logging error for debugging
      setError('Failed to fetch table data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData(currentPage);
  }, [currentPage, apiEndpoints]);

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      setCurrentPage(prevPage);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (tableData.length === 0) {
    return <div>No data available</div>;
  }

  const headers = Object.keys(tableData[0]);

  const renderCell = (value) => {
    if (value === null || value === undefined) {
      return '';
    } else if (typeof value === 'object') {
      return JSON.stringify(value);
    } else {
      return value.toString();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Table: Status Product</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left text-sm font-medium text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                {headers.map((header) => (
                  <td
                    key={header}
                    className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700"
                  >
                    {renderCell(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={!prevPage}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={!nextPage}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusProductTable;
