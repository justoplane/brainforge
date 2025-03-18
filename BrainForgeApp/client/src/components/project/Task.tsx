import React from "react";

interface TaskProps {
  assignmentText: string;
}

export const Task: React.FC<TaskProps> = ({ assignmentText }) => {
  return (
    <div className="task-container">
      <h2>Assignment</h2>
      <p>{assignmentText}</p>
    </div>
  );
};