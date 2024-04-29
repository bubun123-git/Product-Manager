const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "skills_management",
  port: 3306,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// Define storage for the uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Uploads will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // You can also generate a unique filename using uuid or any other method
  },
});

// Initialize multer middleware
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  return res.json({ message: "From Backend Side" });
});

// Route for fetching product managers
app.get("/api/skills", (req, res) => {
  const sql = "SELECT * FROM skills_management.skill_management_table";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send("Error fetching data from database...");
      return;
    }
    res.json(result);
  });
});

// Route to handle file uploads
app.post("/upload", upload.single("resume"), (req, res) => {
  // Access the uploaded file through req.file
  console.log("Uploaded file:", req.file);

  // Optionally, you can save the file details to your database here
  // For example, you can save the file path or filename to the database

  res.send("File uploaded successfully!");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
