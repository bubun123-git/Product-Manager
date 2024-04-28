import React, { useEffect, useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

function App() {
  // State variables
  const [skills, setSkills] = useState([]); // Stores skills fetched from the server
  const [jobDescription, setJobDescription] = useState(""); // Stores job description entered by user
  const [resumeFile, setResumeFile] = useState(null); // Stores resume file uploaded by user
  const [matchingSkills, setMatchingSkills] = useState([]); // Stores matching skills

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
          console.log("Fetched Skills:", data); // Log fetched skills
        })
        .catch((err) => console.log(err));
    };

    fetchSkills();
  }, []);

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

    // Match keywords with skills
    const matching = skills.filter((skill) => {
      if (typeof skill === "object" && skill.skill) {
        return jobDescription.toLowerCase().includes(skill.skill.toLowerCase());
      }
      return false;
    });

    console.log("Number of Matching Skills:", matching.length);
    console.log("Matching Skills:");
    matching.forEach((skill) => {
      console.log("Skill:", skill.skill, "- Level:", skill.level);
    });

    setMatchingSkills(matching);

    // Update number of matching skills in UI
    setMatchingSkillsCount(matching.length);

    // Store job description in the provided API
    const id = uuidv4();
    fetch(`https://crudcrud.com/api/17fb8cd13bf0449ead544a5d85082df0/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobDescription,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error storing data in API");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Stored data in API:", data);
      })
      .catch((err) => console.log(err));

    setJobDescription("");
    setResumeFile(null);
  };

  // State variable to store number of matching skills
  const [matchingSkillsCount, setMatchingSkillsCount] = useState(0);

  // Render component
  return (
    <div className="container">
      <div className="app">
        <h1>Apply for a Job</h1>
        <form onSubmit={handleSubmit}>
          {/* Job Description */}
          <div className="form-group">
            <label htmlFor="jobDescription">Job Description:</label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              required
            />
          </div>
          {/* Upload Resume */}
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
          {/* Submit Button */}
          <button type="submit">Submit</button>
        </form>
        {/* Display number of matching skills in UI */}
        <div>
          <h2 style={{ color: "black" }}>Number of Matching Skills:</h2>
          <b>
            <p style={{ color: "black" }}>{matchingSkillsCount}</p>
          </b>
        </div>
      </div>
    </div>
  );
}

export default App;
