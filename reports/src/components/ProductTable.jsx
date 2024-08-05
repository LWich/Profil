import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApi } from './ApiContext';

const ProductTable = () => {
  const { apiEndpoints } = useApi();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(apiEndpoints['product']);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageInput, setPageInput] = useState(1);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ field: 'name', order: 'asc' });

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
        params: {
          ...filters,
          sort: sort.field,
          order: sort.order,
        },
      });
      if (response.data && response.data.results) {
        setTableData(response.data.results);
        setNextPage(response.data.links.next);
        setPrevPage(response.data.links.previous);
        setCount(response.data.count);
        setTotalPages(response.data.total_pages);
        const urlParams = new URLSearchParams(new URL(url).search);
        setPageInput(urlParams.get('page') ? parseInt(urlParams.get('page')) : 1);
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
  }, [currentPage, sort, apiEndpoints]);

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

  const handlePageInput = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(pageInput, 10);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(`${apiEndpoints['product']}?page=${pageNumber}`);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSortChange = (field) => {
    setSort({ field, order: sort.order === 'asc' ? 'desc' : 'asc' });
  };

  const applyFilters = () => {
    setCurrentPage(apiEndpoints['product']); // Reset to the first page when filter changes
    fetchTableData(apiEndpoints['product']); // Apply filters and fetch data
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
      <h2 className="text-2xl font-bold mb-4">Table: Product</h2>
      <p className="mb-4">Total Records: {count} | Total Pages: {totalPages} | Current Page: {pageInput}</p>

      <div className="flex mb-4 space-x-4">
        <input
          type="text"
          name="name"
          placeholder="Filter by name"
          value={filters.name || ''}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="synonyms"
          placeholder="Filter by synonyms"
          value={filters.synonyms || ''}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="linked_id"
          placeholder="Filter by linked ID"
          value={filters.linked_id || ''}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Apply Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  onClick={() => handleSortChange(header)}
                  className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left text-sm font-medium text-gray-700 cursor-pointer"
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
      </div>
      <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={!prevPage}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <form onSubmit={handlePageSubmit} className="flex items-center">
            <input
              type="number"
              value={pageInput}
              onChange={handlePageInput}
              className="px-4 py-2 border border-gray-300 rounded"
              min="1"
              max={totalPages}
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Go
            </button>
          </form>
          <button
            onClick={handleNextPage}
            disabled={!nextPage}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
    </div>
  );
};

export default ProductTable;
