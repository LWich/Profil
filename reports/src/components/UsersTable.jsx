import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApi } from './ApiContext';

const UsersTable = () => {
  const { apiEndpoints } = useApi();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTableData = async () => {
      const token = localStorage.getItem('authToken');
      const endpoint = apiEndpoints['users'];

      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTableData(response.data.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch table data');
        setLoading(false);
      }
    };

    if (apiEndpoints['users']) {
      fetchTableData();
    } else {
      setError('Invalid table name');
      setLoading(false);
    }
  }, [apiEndpoints]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const headers = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Table: Users</h2>
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
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;