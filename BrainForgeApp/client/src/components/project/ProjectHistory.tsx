import React, { useState } from "react";

export const ProjectHistory: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHistory = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`project-history ${isOpen ? "open" : ""}`}>
      <button className="toggle-button" onClick={toggleHistory}>
        {isOpen ? "Close History" : "Open History"}
      </button>
      {isOpen && (
        <div className="history-content">
          <h2>Project History</h2>
          {/* Add project history content here */}
        </div>
      )}
    </div>
  );
};

