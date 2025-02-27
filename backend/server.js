const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fs = require("fs");

const app = express();
const port = 5000;

// **MongoDB Connection**
mongoose
  .connect("mongodb+srv://aryavjain170804:Aryav123@cluster0.iz6by.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// **Middleware**
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// **Models**
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  class: { type: String, default: "" }, // New field
  subject: { type: String, default: "" }, // New field
  year: { type: String, default: "" }, // New field
});

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  class: { type: String, default: "" },
  subject: { type: String, default: "" },
  year: { type: String, default: "" },
  sheetNumber: { type: String, default: "" },
  data: { type: Array, required: true }, // This will include date and time fields
});
const User = mongoose.model("User", UserSchema);
const Attendance = mongoose.model("Attendance", AttendanceSchema);

// **JWT Secret Key**
const SECRET_KEY = "aryavjainsecretkeybackend";

// **JWT Middleware**
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication token required" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Fetch User Details
app.get("/api/user-details", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user details", details: error.message });
  }
});

// Update User Details (Class, Subject, Year)
app.patch("/api/update-user-details", authenticateToken, async (req, res) => {
  try {
    const { class: newClass, subject, year } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { class: newClass, subject, year },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User details updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user details", details: error.message });
  }
});
// **PATCH Update Specific Attendance Record (Protected)**
app.patch("/api/update-attendance", authenticateToken, async (req, res) => {
  try {
    const { class: newClass, subject, year, sheetNumber, updatedData } = req.body;

    if (!updatedData) {
      return res.status(400).json({ error: "Missing updatedData" });
    }

    const attendance = await Attendance.findOne({ userId: req.user.userId });
    if (!attendance) {
      return res.status(404).json({ error: "No attendance data found" });
    }

    // Update class, subject, year, sheet number, and attendance data
    attendance.class = newClass || attendance.class;
    attendance.subject = subject || attendance.subject;
    attendance.year = year || attendance.year;
    attendance.sheetNumber = sheetNumber || attendance.sheetNumber;
    attendance.data = updatedData;
    await attendance.save();

    res.json({ message: "Attendance data updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update attendance data", details: error.message });
  }
});
// **Register Endpoint**
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed", details: error.message });
  }
});

// **Login Endpoint**
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "24h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

// **GET Attendance Data (Protected)**
app.get("/api/attendance-data", authenticateToken, async (req, res) => {
  try {
    const attendance = await Attendance.findOne({ userId: req.user.userId }).populate(
      "userId",
      "username"
    );

    if (!attendance) {
      return res.json([]); // Return empty array if no data exists
    }

    // Include username in the response
    const responseData = {
      ...attendance.toObject(),
      username: attendance.userId.username,
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attendance data", details: error.message });
  }
});

// **POST Attendance Data (Protected)**
app.post("/api/attendance-data", authenticateToken, async (req, res) => {
  try {
    const { class: newClass, subject, year, sheetNumber, data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        error: "Invalid data format. Expected an array of attendance records.",
      });
    }

    // Update or create attendance data for user
    await Attendance.findOneAndUpdate(
      { userId: req.user.userId },
      { class: newClass, subject, year, sheetNumber, data }, // Include sheet number
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      message: "Attendance data updated successfully",
      recordsCount: data.length,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update attendance data",
      details: error.message,
    });
  }
});
// Add this new endpoint to get all sheet numbers associated with a user
app.get("/api/user-sheets", authenticateToken, async (req, res) => {
  try {
    // Find all attendance records for the user
    const attendanceRecords = await Attendance.find({ userId: req.user.userId });
    
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.json({ sheets: [] });
    }
    
    // Extract unique sheet information
    const sheets = attendanceRecords.map(record => ({
      id: record._id,
      sheetNumber: record.sheetNumber || "Untitled Sheet",
      class: record.class || "",
      subject: record.subject || "",
      year: record.year || "",
      lastUpdated: record._id.getTimestamp()
    }));
    
    res.json({ sheets });
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to fetch user's sheet numbers", 
      details: error.message 
    });
  }
});

// Add this endpoint to get a specific attendance sheet
app.get("/api/attendance-data/:sheetId", authenticateToken, async (req, res) => {
  try {
    const { sheetId } = req.params;
    
    // Verify that the sheet belongs to the user
    const attendance = await Attendance.findOne({ 
      _id: sheetId,
      userId: req.user.userId 
    }).populate("userId", "username");
    
    if (!attendance) {
      return res.status(404).json({ error: "Attendance sheet not found" });
    }
    
    // Include username in the response
    const responseData = {
      ...attendance.toObject(),
      username: attendance.userId.username,
    };
    
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to fetch attendance data", 
      details: error.message 
    });
  }
});
// **File Upload Setup (Multer)**
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // Directory to save the uploaded file
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  },
});

const upload = multer({ storage });

// **Ensure "uploads" Directory Exists**
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// **POST Endpoint to Handle Image Upload**
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res.status(200).json({
    message: "File uploaded successfully",
    filePath: `http://localhost:${port}/uploads/${req.file.filename}`, // Return full URL
  });
});

// **Error Handling Middleware**
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// **Start the Server**
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
