const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(cors());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "skills_management",
  port: 3306
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});