
// import React, { useState, useEffect } from "react";
// import ImageUpload from "./components/ImageUpload";

// const AttendanceTable = ({ token }) => {
//   const [tableData, setTableData] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [updatedData, setUpdatedData] = useState([]); // Track updated data

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
//         if (data.length > 0) {
//           const colKeys = Object.keys(data[0])
//             .slice(1)
//             .filter((col) => col !== "Date>" && col !== "Time>" && col !== "Name Of Student");

//           setColumns(colKeys);
//           setTableData(data);
//           setUpdatedData(data); // Initialize updatedData with fetched data
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
//         body: JSON.stringify({ updatedData }), // Send updated data to backend
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

//   return (
//     <div className="p-4 overflow-x-auto">
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
import ImageUpload from "./components/ImageUpload";

const AttendanceTable = ({ token }) => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [updatedData, setUpdatedData] = useState([]); // Track updated data
  const [username, setUsername] = useState(""); // State for username
  const [classValue, setClassValue] = useState(""); // State for class
  const [subject, setSubject] = useState(""); // State for subject
  const [year, setYear] = useState(""); // State for year
  const [isEditing, setIsEditing] = useState(false); // State for editing mode

  // Fetch Data from Backend
  useEffect(() => {
    if (!token) return; // Ensure token exists before making API call

    const fetchAttendanceData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/attendance-data", {
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

        // Set username, class, subject, and year
        if (data.username) setUsername(data.username);
        if (data.class) setClassValue(data.class);
        if (data.subject) setSubject(data.subject);
        if (data.year) setYear(data.year);

        // Set table data and columns
        if (data.data && data.data.length > 0) {
          const colKeys = Object.keys(data.data[0])
            .slice(1)
            .filter((col) => col !== "Date>" && col !== "Time>" && col !== "Name Of Student");

          setColumns(colKeys);
          setTableData(data.data);
          setUpdatedData(data.data); // Initialize updatedData with fetched data
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, [token]); // Run whenever token changes

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
      const response = await fetch("http://localhost:5000/api/update-attendance", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class: classValue,
          subject,
          year,
          updatedData, // Include class, subject, and year with attendance data
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
        body: JSON.stringify({ class: classValue, subject, year }),
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

  return (
    <div className="p-4 overflow-x-auto">
      {/* Display Username */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Welcome, {username}</h2>
      </div>

      {/* Class, Subject, Year Fields */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Class Details</h3>
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={classValue}
              onChange={(e) => setClassValue(e.target.value)}
              placeholder="Class"
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
              className="p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleUpdateUserDetails}
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 ml-2 text-white bg-gray-500 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <p>Class: {classValue}</p>
            <p>Subject: {subject}</p>
            <p>Year: {year}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Attendance Table */}
      <ImageUpload />
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
                  onClick={() => (colIndex >= 2 ? toggleAttendance(rowIndex, col) : null)}
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

      {/* Submit Button */}
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AttendanceTable;