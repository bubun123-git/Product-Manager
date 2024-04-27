import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  // State variables
  const [skills, setSkills] = useState([]); // Stores skills fetched from the server
  const [jobDescription, setJobDescription] = useState(""); // Stores job description entered by user
  const [resumeFile, setResumeFile] = useState(null); // Stores resume file uploaded by user

  
  useEffect(() => {
    // Function to fetch skills from the server
    const fetchSkills = () => {
      fetch("http://localhost:5000/api/skills")
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error fetching data from server");
          }
          return res.json();
        })
        .then((data) => {
          setSkills(data);
        })
        .catch((err) => console.log(err));
    };

    fetchSkills();
  }, []);

  // Handle change in job description textarea
  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  // Handle change in uploaded resume file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setResumeFile(file);
    } else {
      alert("Please upload a PDF or Word document.");
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Job Description:", jobDescription);
    console.log("Resume File:", resumeFile);
    setJobDescription("");
    setResumeFile(null);
    // You can include code here to handle form submission, e.g., sending data to the server
  };

  // Render component
  return (
    <div className="app">
      <h1>Apply for a Job</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="jobDescription">Job Description:</label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="resumeFile">Upload Resume (PDF/Word):</label>
          <input
            type="file"
            id="resumeFile"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
