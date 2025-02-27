


import React, { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";

const AttendanceTable = ({ token, sheetId }) => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [updatedData, setUpdatedData] = useState([]); // Track updated data
  const [username, setUsername] = useState(""); // State for username
  const [classValue, setClassValue] = useState(""); // State for class
  const [subject, setSubject] = useState(""); // State for subject
  const [year, setYear] = useState(""); // State for year
  const [sheetNumber, setSheetNumber] = useState(""); // State for sheet number
  const [isEditing, setIsEditing] = useState(false); // State for editing mode
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Data from Backend
  useEffect(() => {
    if (!token) return; // Ensure token exists before making API call

    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:5000/api/attendance-data";
        
        // If sheetId is provided and not 'new', fetch that specific sheet
        if (sheetId && sheetId !== 'new') {
          url = `http://localhost:5000/api/attendance-data/${sheetId}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }

        const data = await response.json();

        // If it's a new sheet, initialize with empty data
        if (sheetId === 'new') {
          // Initialize with a basic empty structure
          setUsername(data.username || "");
          setClassValue("");
          setSubject("");
          setYear("");
          setSheetNumber("");
          
          // Create empty table structure
          const emptyData = [
            { "S.No": "S.No", "Name Of Student": "Name Of Student", "Roll No": "Roll No", "Lec1": "" },
            { "S.No": "", "Name Of Student": "Date>", "Roll No": "", "Lec1": "" },
            { "S.No": "", "Name Of Student": "Time>", "Roll No": "", "Lec1": "" }
          ];
          setTableData(emptyData);
          setUpdatedData(emptyData);
          setColumns(["S.No", "Name Of Student", "Roll No", "Lec1"]);
        } else {
          // Set username, class, subject, year, and sheet number
          if (data.username) setUsername(data.username);
          if (data.class) setClassValue(data.class);
          if (data.subject) setSubject(data.subject);
          if (data.year) setYear(data.year);
          if (data.sheetNumber) setSheetNumber(data.sheetNumber);

          // Set table data and columns
          if (data.data && data.data.length > 0) {
            const colKeys = Object.keys(data.data[0])
              .filter((col) => col !== "Date>" && col !== "Time>" && col !== "Name Of Student");

            setColumns(colKeys);
            setTableData(data.data);
            setUpdatedData(data.data); // Initialize updatedData with fetched data
          } else {
            // Default empty structure if no data
            const emptyData = [
              { "S.No": "S.No", "Name Of Student": "Name Of Student", "Roll No": "Roll No", "Lec1": "" },
              { "S.No": "", "Name Of Student": "Date>", "Roll No": "", "Lec1": "" },
              { "S.No": "", "Name Of Student": "Time>", "Roll No": "", "Lec1": "" }
            ];
            setTableData(emptyData);
            setUpdatedData(emptyData);
            setColumns(["S.No", "Name Of Student", "Roll No", "Lec1"]);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setError("Failed to load attendance data. Please try again.");
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [token, sheetId]); // Run whenever token or sheetId changes

  // Toggle Attendance (Present/Absent)
  const toggleAttendance = (rowIndex, colKey) => {
    setUpdatedData((prevData) => {
      const newData = prevData.map((row, index) =>
        index === rowIndex
          ? { ...row, [colKey]: row[colKey] === 1 ? 2 : row[colKey] === 2 ? 1 : 2 }
          : row
      );
      return newData;
    });
  };

  // Handle Date and Time Input Changes
  const handleDateTimeChange = (rowIndex, colKey, field, value) => {
    setUpdatedData((prevData) => {
      const newData = prevData.map((row, index) =>
        index === rowIndex
          ? { ...row, [`${colKey}_${field}`]: value } // Store date/time in a unique key
          : row
      );
      return newData;
    });
  };

  // Handle Submit Button Click
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/attendance-data", {
        method: "POST", // Use POST for both new and updated sheets
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class: classValue,
          subject,
          year,
          sheetNumber,
          data: updatedData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update attendance data");
      }

      const result = await response.json();
      console.log("Attendance data updated successfully:", result);
      alert("Attendance data updated successfully!");
    } catch (error) {
      console.error("Error updating attendance data:", error);
      alert("Failed to update attendance data. Please try again.");
    }
  };

  // Handle Update User Details
  const handleUpdateUserDetails = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/update-user-details", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ class: classValue, subject, year, sheetNumber }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      const result = await response.json();
      console.log("User details updated successfully:", result);
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Loading attendance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-4 text-red-700 bg-red-100 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-x-auto">
      {/* Display Username */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Welcome, {username}</h2>
      </div>

      {/* Class, Subject, Year, Sheet Number Fields */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Class Details</h3>
        {isEditing ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Class</label>
              <input
                type="text"
                value={classValue}
                onChange={(e) => setClassValue(e.target.value)}
                placeholder="Class"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Year"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Sheet Number</label>
              <input
                type="text"
                value={sheetNumber}
                onChange={(e) => setSheetNumber(e.target.value)}
                placeholder="Sheet Number"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex space-x-2 md:col-span-2 lg:col-span-4">
              <button
                onClick={handleUpdateUserDetails}
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <span className="font-medium">Class:</span> {classValue || "Not specified"}
              </div>
              <div>
                <span className="font-medium">Subject:</span> {subject || "Not specified"}
              </div>
              <div>
                <span className="font-medium">Year:</span> {year || "Not specified"}
              </div>
              <div>
                <span className="font-medium">Sheet Number:</span> {sheetNumber || "Not specified"}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 mt-3 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Edit Details
            </button>
          </div>
        )}
      </div>

      {/* Image Upload Component */}
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">Upload Attendance Sheet</h3>
        <ImageUpload />
      </div>

      {/* Attendance Table */}
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">Attendance Data</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-collapse border-gray-300 table-auto">
            <thead>
              <tr className="bg-gray-200">
                {columns.map((col, index) => (
                  <th key={index} className="p-2 border border-gray-300">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {updatedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`border border-gray-300 p-2 text-center cursor-pointer ${
                        colIndex >= 2 && rowIndex > 2
                          ? row[col] === 1
                            ? "bg-red-200 text-red-700"
                            : row[col] === 2
                            ? "bg-green-200 text-green-700"
                            : "bg-gray-200 text-gray-700"
                          : ""
                      }`}
                      onClick={() => (colIndex >= 2 && rowIndex > 2 ? toggleAttendance(rowIndex, col) : null)}
                    >
                      {rowIndex === 1 && colIndex >= 2 ? (
                        <input
                          type="date"
                          value={row[`${col}_date`] || ""}
                          onChange={(e) =>
                            handleDateTimeChange(rowIndex, col, "date", e.target.value)
                          }
                          className="p-2 mr-4 border border-gray-300 rounded"
                        />
                      ) : rowIndex === 2 && colIndex >= 2 ? (
                        <div>
                          From:
                          <input
                            type="time"
                            value={row[`${col}_fromTime`] || ""}
                            onChange={(e) =>
                              handleDateTimeChange(rowIndex, col, "fromTime", e.target.value)
                            }
                            className="p-2 mr-4 border border-gray-300 rounded"
                          />
                          <br />
                          To:
                          <input
                            type="time"
                            value={row[`${col}_toTime`] || ""}
                            onChange={(e) =>
                              handleDateTimeChange(rowIndex, col, "toTime", e.target.value)
                            }
                            className="p-2 mr-4 border border-gray-300 rounded"
                          />
                        </div>
                      ) : rowIndex >= 3 && colIndex >= 2 ? (
                        row[col] === 1 ? (
                          "Absent"
                        ) : row[col] === 2 ? (
                          "Present"
                        ) : (
                          "Undefined"
                        )
                      ) : (
                        row[col]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Save Attendance Data
        </button>
      </div>
    </div>
  );
};

export default AttendanceTable;