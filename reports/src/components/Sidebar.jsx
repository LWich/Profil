import React from 'react';
import { Link } from 'react-router-dom';
import { useApi } from './ApiContext';

const Sidebar = () => {
  const { apiEndpoints } = useApi();

  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Tables</h2>
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

export default Sidebar;