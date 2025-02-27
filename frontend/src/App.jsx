
import React, { useState, useEffect } from 'react';
import AttendanceTable from './components/AttendanceTable';
import Dashboard from './components/Dashboard';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSheetId, setSelectedSheetId] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setError('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentView('dashboard');
    setSelectedSheetId(null);
  };

  const navigateToSheet = (sheetId) => {
    setSelectedSheetId(sheetId);
    setCurrentView('attendanceTable');
  };

  const navigateToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedSheetId(null);
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Attendance System</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
          </div>
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {error && <div className="text-red-500">{error}</div>}
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between p-4 bg-gray-100">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Attendance Management System</h1>
          {currentView === 'attendanceTable' && (
            <button
              onClick={navigateToDashboard}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Back to Dashboard
            </button>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      
      {currentView === 'dashboard' ? (
        <Dashboard token={token} onSheetSelect={navigateToSheet} />
      ) : (
        <AttendanceTable token={token} sheetId={selectedSheetId} />
      )}
    </div>
  );
};

export default App;