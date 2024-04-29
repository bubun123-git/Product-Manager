import React, { useEffect, useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import parsePDF from "./assets/pdfParser";

function App() {
  // State variables
  const [skills, setSkills] = useState([]); // Stores skills fetched from the server
  const [jobDescription, setJobDescription] = useState(""); // Stores job description entered by user
  const [resumeFile, setResumeFile] = useState(null); // Stores resume file uploaded by user
  const [matchingSkillsCountFromJob, setMatchingSkillsCountFromJob] = useState(0); // Stores the number of matching skills from job description
  const [matchingSkillsCountFromPDF, setMatchingSkillsCountFromPDF] = useState(0); // Stores the number of matching skills from PDF
  const [matchedLevels, setMatchedLevels] = useState({}); // Stores the count of matched levels

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
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setResumeFile(file);
    } else {
      alert("Please upload a PDF or Word document.");
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Job Description:", jobDescription);

    const matchSkills = (text, skills) => {
      return skills.filter((skill) => {
        if (typeof skill === "object" && skill.skill) {
          return text.toLowerCase().includes(skill.skill.toLowerCase());
        }
        return false;
      });
    };

    const matchingFromJobDescription = matchSkills(jobDescription, skills);

    console.log(
      "Number of Matching Skills from Job Description:",
      matchingFromJobDescription.length
    );
    console.log("Matching Skills from Job Description:");
    matchingFromJobDescription.forEach((skill) => {
      console.log("Skill:", skill.skill, "- Level:", skill.level);
    });

    // Set the number of matching skills from job description
    setMatchingSkillsCountFromJob(matchingFromJobDescription.length);

    // Reset matched levels count
    setMatchedLevels({});

    if (resumeFile) {
      try {
        const parsedText = await parsePDF(resumeFile);
        const matchingFromPDF = matchSkills(parsedText, skills);

        console.log(
          "Number of Matching Skills from PDF:",
          matchingFromPDF.length
        );
        console.log("Matching Skills from PDF:");
        matchingFromPDF.forEach((skill) => {
          console.log("Skill:", skill.skill, "- Level:", skill.level);
          // Count the matched levels
          setMatchedLevels((prevLevels) => ({
            ...prevLevels,
            [skill.level]: (prevLevels[skill.level] || 0) + 1,
          }));
        });

        // Set the number of matching skills from PDF
        setMatchingSkillsCountFromPDF(matchingFromPDF.length);
      } catch (error) {
        console.error("Error parsing PDF:", error);
      }
    } else {
      // If no resume file is uploaded, set the number of matching skills from PDF to 0
      setMatchingSkillsCountFromPDF(0);
    }
  };

  // Determine the level with the most matched skills
  const determineBestMatchedLevel = () => {
    let maxCount = 0;
    let bestMatchedLevel = '';

    Object.entries(matchedLevels).forEach(([level, count]) => {
      if (count > maxCount) {
        maxCount = count;
        bestMatchedLevel = level;
      }
    });

    return bestMatchedLevel;
  };

  // Function to download the uploaded CV
  const downloadCV = () => {
    const url = URL.createObjectURL(resumeFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.pdf'; // Change the filename as needed
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

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

          <button type="submit">Submit</button>
        </form>
        {/* Display number of matching skills in UI */}
        <div className="matching-skills">
          <h2 style={{ color: "black" }}>Number of Matching Skills:</h2>
          <div>
            <p style={{ color: "black" }}>
              <b>From Job Description: {matchingSkillsCountFromJob}</b>
            </p>
            <p style={{ color: "black" }}>
              <b>From PDF: {matchingSkillsCountFromPDF}</b>
            </p>
          </div>
        </div>
        {/* Display best matched level */}
        {Object.keys(matchedLevels).length > 0 && (
          <div className="matched-level">
            <h2 style={{ color: "black" }}>Best Matched Level:</h2>
            <p style={{ color: "black" }}>
              {determineBestMatchedLevel() || 'No level matched'}
            </p>
          </div>
        )}
        {/* Download CV button */}
        {resumeFile && (
          <button onClick={downloadCV}>Download CV</button>
        )}
      </div>
    </div>
  );
}

export default App;
