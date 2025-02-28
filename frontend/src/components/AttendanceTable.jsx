
// import React, { useState, useEffect } from "react";
// import ImageUpload from "./ImageUpload";

// const AttendanceTable = ({ token }) => {
//   const [tableData, setTableData] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [updatedData, setUpdatedData] = useState([]); // Track updated data
//   const [username, setUsername] = useState(""); // State for username
//   const [classValue, setClassValue] = useState(""); // State for class
//   const [subject, setSubject] = useState(""); // State for subject
//   const [year, setYear] = useState(""); // State for year
//   const [isEditing, setIsEditing] = useState(false); // State for editing mode

//   // Fetch Data from Backend
//   useEffect(() => {
//     if (!token) return; // Ensure token exists before making API call

//     const fetchAttendanceData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/attendance-data", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch attendance data");
//         }

//         const data = await response.json();

//         // Set username, class, subject, and year
//         if (data.username) setUsername(data.username);
//         if (data.class) setClassValue(data.class);
//         if (data.subject) setSubject(data.subject);
//         if (data.year) setYear(data.year);

//         // Set table data and columns
//         if (data.data && data.data.length > 0) {
//           const colKeys = Object.keys(data.data[0])
//             .slice(1)
//             .filter((col) => col !== "Date>" && col !== "Time>" && col !== "Name Of Student");

//           setColumns(colKeys);
//           setTableData(data.data);
//           setUpdatedData(data.data); // Initialize updatedData with fetched data
//         }
//       } catch (error) {
//         console.error("Error fetching attendance data:", error);
//       }
//     };

//     fetchAttendanceData();
//   }, [token]); // Run whenever token changes

//   // Toggle Attendance (Present/Absent)
//   const toggleAttendance = (rowIndex, colKey) => {
//     setUpdatedData((prevData) => {
//       const newData = prevData.map((row, index) =>
//         index === rowIndex
//           ? { ...row, [colKey]: row[colKey] === 1 ? 2 : row[colKey] === 2 ? 1 : 2 }
//           : row
//       );
//       return newData;
//     });
//   };

//   // Handle Date and Time Input Changes
//   const handleDateTimeChange = (rowIndex, colKey, field, value) => {
//     setUpdatedData((prevData) => {
//       const newData = prevData.map((row, index) =>
//         index === rowIndex
//           ? { ...row, [`${colKey}_${field}`]: value } // Store date/time in a unique key
//           : row
//       );
//       return newData;
//     });
//   };

//   // Handle Submit Button Click
//   const handleSubmit = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/update-attendance", {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           class: classValue,
//           subject,
//           year,
//           updatedData, // Include class, subject, and year with attendance data
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update attendance data");
//       }

//       const result = await response.json();
//       console.log("Attendance data updated successfully:", result);
//       alert("Attendance data updated successfully!");
//     } catch (error) {
//       console.error("Error updating attendance data:", error);
//       alert("Failed to update attendance data. Please try again.");
//     }
//   };

//   // Handle Update User Details
//   const handleUpdateUserDetails = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/update-user-details", {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ class: classValue, subject, year }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update user details");
//       }

//       const result = await response.json();
//       console.log("User details updated successfully:", result);
//       setIsEditing(false); // Exit editing mode
//     } catch (error) {
//       console.error("Error updating user details:", error);
//     }
//   };

//   return (
//     <div className="p-4 overflow-x-auto">
//       {/* Display Username */}
//       <div className="mb-4">
//         <h2 className="text-xl font-bold">Welcome, {username}</h2>
//       </div>

//       {/* Class, Subject, Year Fields */}
//       <div className="mb-4">
//         <h3 className="text-lg font-semibold">Class Details</h3>
//         {isEditing ? (
//           <div className="space-y-2">
//             <input
//               type="text"
//               value={classValue}
//               onChange={(e) => setClassValue(e.target.value)}
//               placeholder="Class"
//               className="p-2 border border-gray-300 rounded"
//             />
//             <input
//               type="text"
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               placeholder="Subject"
//               className="p-2 border border-gray-300 rounded"
//             />
//             <input
//               type="text"
//               value={year}
//               onChange={(e) => setYear(e.target.value)}
//               placeholder="Year"
//               className="p-2 border border-gray-300 rounded"
//             />
//             <button
//               onClick={handleUpdateUserDetails}
//               className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
//             >
//               Save
//             </button>
//             <button
//               onClick={() => setIsEditing(false)}
//               className="px-4 py-2 ml-2 text-white bg-gray-500 rounded hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//           </div>
//         ) : (
//           <div>
//             <p>Class: {classValue}</p>
//             <p>Subject: {subject}</p>
//             <p>Year: {year}</p>
//             <button
//               onClick={() => setIsEditing(true)}
//               className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
//             >
//               Edit
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Attendance Table */}
//       <ImageUpload />
//       <table className="w-full border border-collapse border-gray-300 table-auto">
//         <thead>
//           <tr className="bg-gray-200">
//             {columns.map((col, index) => (
//               <th key={index} className="p-2 border border-gray-300">
//                 {col}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {updatedData.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {columns.map((col, colIndex) => (
//                 <td
//                   key={colIndex}
//                   className={`border border-gray-300 p-2 text-center cursor-pointer ${
//                     colIndex >= 2 && rowIndex > 2
//                       ? row[col] === 1
//                         ? "bg-red-200 text-red-700"
//                         : row[col] === 2
//                         ? "bg-green-200 text-green-700"
//                         : "bg-gray-200 text-gray-700"
//                       : ""
//                   }`}
//                   onClick={() => (colIndex >= 2 ? toggleAttendance(rowIndex, col) : null)}
//                 >
//                   {rowIndex === 1 && colIndex >= 2 ? (
//                     <input
//                       type="date"
//                       value={row[`${col}_date`] || ""}
//                       onChange={(e) =>
//                         handleDateTimeChange(rowIndex, col, "date", e.target.value)
//                       }
//                       className="p-2 mr-4 border border-gray-300 rounded"
//                     />
//                   ) : rowIndex === 2 && colIndex >= 2 ? (
//                     <div>
//                       From:
//                       <input
//                         type="time"
//                         value={row[`${col}_fromTime`] || ""}
//                         onChange={(e) =>
//                           handleDateTimeChange(rowIndex, col, "fromTime", e.target.value)
//                         }
//                         className="p-2 mr-4 border border-gray-300 rounded"
//                       />
//                       <br />
//                       To:
//                       <input
//                         type="time"
//                         value={row[`${col}_toTime`] || ""}
//                         onChange={(e) =>
//                           handleDateTimeChange(rowIndex, col, "toTime", e.target.value)
//                         }
//                         className="p-2 mr-4 border border-gray-300 rounded"
//                       />
//                     </div>
//                   ) : rowIndex >= 3 && colIndex >= 2 ? (
//                     row[col] === 1 ? (
//                       "Absent"
//                     ) : row[col] === 2 ? (
//                       "Present"
//                     ) : (
//                       "Undefined"
//                     )
//                   ) : (
//                     row[col]
//                   )}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Submit Button */}
//       <div className="mt-4">
//         <button
//           onClick={handleSubmit}
//           className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AttendanceTable;

import React, { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";

const AttendanceTable = ({ token, sheetId }) => {
  const [frontData, setFrontData] = useState([]); // State for front data
  const [backData, setBackData] = useState([]); // State for back data
  const [columns, setColumns] = useState([]);
  const [updatedFrontData, setUpdatedFrontData] = useState([]); // Track updated front data
  const [updatedBackData, setUpdatedBackData] = useState([]); // Track updated back data
  const [username, setUsername] = useState("");
  const [classValue, setClassValue] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [sheetNumber, setSheetNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const columnMapping = {
    "0": "Batch",
    "1": "Roll No.",
    "2": "Name Of Student",
    "3": "Lec1",
    "4": "Lec2",
    "5": "Lec3",
    "6": "Lec4",
    "7": "Lec5",
  };

  // Fetch Data from Backend
  useEffect(() => {
    if (!token) return;

    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:5000/api/attendance-data";

        if (sheetId && sheetId !== "new") {
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

        // Transform data using columnMapping
        const transformData = (data) => {
          return data.map((row) => {
            const newRow = {};
            Object.keys(row).forEach((key) => {
              const columnName = columnMapping[key] || key;
              newRow[columnName] = row[key];
            });
            return newRow;
          });
        };

        // Set front and back data
        setFrontData(transformData(data.frontData || []));
        setBackData(transformData(data.backData || []));
        setUpdatedFrontData(transformData(data.frontData || []));
        setUpdatedBackData(transformData(data.backData || []));
        setColumns(Object.values(columnMapping));

        setUsername(data.username);
        setClassValue(data.class);
        setSubject(data.subject);
        setYear(data.year);
        setSheetNumber(data.sheetNumber);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setError("Failed to load attendance data. Please try again.");
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [token, sheetId]);

  // Toggle Attendance (Present/Absent)
  const toggleAttendance = (rowIndex, colKey, type) => {
    if (type === "front") {
      setUpdatedFrontData((prevData) => {
        const newData = prevData.map((row, index) =>
          index === rowIndex
            ? { ...row, [colKey]: row[colKey] === 1 ? 2 : row[colKey] === 2 ? 1 : 2 }
            : row
        );
        return newData;
      });
    } else if (type === "back") {
      setUpdatedBackData((prevData) => {
        const newData = prevData.map((row, index) =>
          index === rowIndex
            ? { ...row, [colKey]: row[colKey] === 1 ? 2 : row[colKey] === 2 ? 1 : 2 }
            : row
        );
        return newData;
      });
    }
  };

  // Handle Date and Time Input Changes
  const handleDateTimeChange = (rowIndex, colKey, field, value, type) => {
    if (type === "front") {
      setUpdatedFrontData((prevData) => {
        const newData = prevData.map((row, index) =>
          index === rowIndex
            ? { ...row, [`${colKey}_${field}`]: value }
            : row
        );
        return newData;
      });
    } else if (type === "back") {
      setUpdatedBackData((prevData) => {
        const newData = prevData.map((row, index) =>
          index === rowIndex
            ? { ...row, [`${colKey}_${field}`]: value }
            : row
        );
        return newData;
      });
    }
  };

  // Handle Submit Button Click
  const handleSubmit = async (type) => {
    try {
      const data = type === "front" ? updatedFrontData : updatedBackData;
      const response = await fetch("http://localhost:5000/api/attendance-data", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class: classValue,
          subject,
          year,
          sheetNumber,
          data,
          type,
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

  // Render Table for Front or Back Data
  const renderTable = (data, type) => {
    return (
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">{type === "front" ? "Front Data" : "Back Data"}</h3>
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
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`border border-gray-300 p-2 text-center ${
                        colIndex >= 2 && rowIndex > 2 && col !== "Name Of Student"
                          ? row[col] === 1
                            ? "bg-red-200 text-red-700 cursor-pointer"
                            : row[col] === 2
                            ? "bg-green-200 text-green-700 cursor-pointer"
                            : "bg-gray-200 text-gray-700 cursor-pointer"
                          : ""
                      }`}
                      onClick={() => {
                        if (colIndex >= 2 && rowIndex > 2 && col !== "Name Of Student") {
                          toggleAttendance(rowIndex, col, type);
                        }
                      }}
                    >
                      {col === "Name Of Student" ? (
                        row[col]
                      ) : rowIndex === 1 && colIndex >= 2 ? (
                        <input
                          type="date"
                          value={row[`${col}_date`] || ""}
                          onChange={(e) =>
                            handleDateTimeChange(rowIndex, col, "date", e.target.value, type)
                          }
                          className="p-2 border border-gray-300 rounded"
                        />
                      ) : rowIndex === 2 && colIndex >= 2 ? (
                        <div>
                          From:
                          <input
                            type="time"
                            value={row[`${col}_fromTime`] || ""}
                            onChange={(e) =>
                              handleDateTimeChange(rowIndex, col, "fromTime", e.target.value, type)
                            }
                            className="p-2 border border-gray-300 rounded"
                          />
                          <br />
                          To:
                          <input
                            type="time"
                            value={row[`${col}_toTime`] || ""}
                            onChange={(e) =>
                              handleDateTimeChange(rowIndex, col, "toTime", e.target.value, type)
                            }
                            className="p-2 border border-gray-300 rounded"
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
    );
  };

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
            {/* ... (existing code) ... */}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
              {/* ... (existing code) ... */}
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

      {/* Front Data Table */}
      {renderTable(updatedFrontData, "front")}

      {/* Back Data Table */}
      {renderTable(updatedBackData, "back")}

      {/* Submit Buttons */}
      <div className="mt-4">
        <button
          onClick={() => handleSubmit("front")}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Save Front Data
        </button>
        <button
          onClick={() => handleSubmit("back")}
          className="px-4 py-2 ml-4 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Save Back Data
        </button>
      </div>
    </div>
  );
};

export default AttendanceTable;