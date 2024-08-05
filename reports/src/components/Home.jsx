// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useApi } from './ApiContext';

const Home = () => {
  const { apiEndpoints, setApiEndpoints } = useApi();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApiEndpoints = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      try {
        const axiosInstance = axios.create({
          baseURL: 'http://localhost:8000/api/v1', // Полный путь к внешнему API-серверу
        });
        const response = await axiosInstance.get('/');
        console.log(response.data)
        setApiEndpoints(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch API endpoints');
        setLoading(false);
      }
    };

    fetchApiEndpoints();
  }, [setApiEndpoints]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Tables</h2>
      <ul className="list-disc pl-5">
        {Object.keys(apiEndpoints).map((key) => (
          <li key={key}>
            <Link to={`/table/${key}`} className="text-blue-500 hover:underline">
              {key}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
