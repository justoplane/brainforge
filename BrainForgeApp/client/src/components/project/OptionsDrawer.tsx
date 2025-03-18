import React, { useState } from "react";

export const OptionsDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [submissionType, setSubmissionType] = useState("");

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmissionTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSubmissionType(event.target.value);
  };

  const handleSubmit = () => {
    // Handle the submit action here
    console.log("Submitted:", { selectedOption, submissionType });
  };

  return (
    <div className={`options-drawer ${isOpen ? "open" : ""}`}>
      <button className="toggle-button" onClick={toggleDrawer}>
        {isOpen ? "Close Options" : "Open Options"}
      </button>
      {isOpen && (
        <div className="drawer-content">
          <h2>Options</h2>
          <label className="drawer-label">
            Select Type:
            <select value={selectedOption} onChange={handleOptionChange}>
              <option value="">Select...</option>
              <option value="short-challenge">Short Challenge</option>
              <option value="assignment">Assignment</option>
            </select>
          </label>
          {selectedOption && (
            <div className="submission-options">
              <label className="drawer-label">
                Submission Type:
                <select value={submissionType} onChange={handleSubmissionTypeChange}>
                  <option value="">Select...</option>
                  <option value="youtube-link">YouTube Link</option>
                  <option value="paste-text">Paste Text</option>
                  <option value="upload-pdf">Upload PDF</option>
                </select>
              </label>
              {submissionType === "youtube-link" && (
                <div className="input-group">
                  <label>
                    YouTube Link:
                    <input type="text" placeholder="Paste YouTube link here" />
                  </label>
                </div>
              )}
              {submissionType === "paste-text" && (
                <div className="input-group">
                  <label>
                    Text:
                    <textarea placeholder="Paste text here"></textarea>
                  </label>
                </div>
              )}
              {submissionType === "upload-pdf" && (
                <div className="input-group">
                  <label>
                    Upload PDF:
                    <input type="file" accept="application/pdf" />
                  </label>
                </div>
              )}
              <button onClick={handleSubmit} className="submit-button">Submit</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

