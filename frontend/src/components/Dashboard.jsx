import React, { useState, useEffect } from 'react';

const Dashboard = ({ token, onSheetSelect }) => {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Fetch user details to get the username
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user-details', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const userData = await response.json();
        setUsername(userData.username);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    // Fetch all sheets associated with the user
    const fetchSheets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user-sheets', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch sheets');
        }

        const data = await response.json();
        setSheets(data.sheets);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sheets:', error);
        setError('Failed to load your attendance sheets. Please try again.');
        setLoading(false);
      }
    };

    fetchUserDetails();
    fetchSheets();
  }, [token]);

  // Create a new attendance sheet
  const createNewSheet = () => {
    onSheetSelect('new'); // Special value to indicate a new sheet
  };

  return (
    <div className="container p-6 mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Welcome, {username}</h2>
        <p className="text-gray-600">Manage your attendance sheets</p>
      </div>

      <div className="mb-6">
        <button
          onClick={createNewSheet}
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Create New Attendance Sheet
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <p>Loading your attendance sheets...</p>
        </div>
      ) : error ? (
        <div className="p-4 text-red-700 bg-red-100 rounded">
          <p>{error}</p>
        </div>
      ) : sheets.length === 0 ? (
        <div className="p-6 text-center bg-gray-100 rounded">
          <p>You don't have any attendance sheets yet.</p>
          <p className="mt-2">Create a new sheet to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sheets.map((sheet) => (
            <div
              key={sheet.id}
              className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow hover:shadow-lg"
              onClick={() => onSheetSelect(sheet.id)}
            >
              <div className="p-6 cursor-pointer">
                <div className="mb-2 text-xl font-bold">
                  {sheet.sheetNumber || "Untitled Sheet"}
                </div>
                <div className="mb-1 text-sm text-gray-700">
                  <span className="font-semibold">Class:</span> {sheet.class || "N/A"}
                </div>
                <div className="mb-1 text-sm text-gray-700">
                  <span className="font-semibold">Subject:</span> {sheet.subject || "N/A"}
                </div>
                <div className="mb-1 text-sm text-gray-700">
                  <span className="font-semibold">Year:</span> {sheet.year || "N/A"}
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  Last updated: {new Date(sheet.lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;