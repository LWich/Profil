import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useApi } from './ApiContext';

const TableView = () => {
  const { tableName } = useParams();
  const { apiEndpoints } = useApi();
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTableData = async () => {
      const token = localStorage.getItem('authToken');
      const endpoint = apiEndpoints[tableName];

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
        setTableData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch table data');
        setLoading(false);
      }
    };

    if (apiEndpoints[tableName]) {
      fetchTableData();
    } else {
      setError('Invalid table name');
      setLoading(false);
    }
  }, [tableName, apiEndpoints]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Table: {tableName}</h2>
      <pre>{JSON.stringify(tableData, null, 2)}</pre>
    </div>
  );
};

export default TableView;