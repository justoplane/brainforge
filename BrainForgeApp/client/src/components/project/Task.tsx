import React from "react";

interface TaskProps {
  assignmentText: string;
}

export const Task: React.FC<TaskProps> = ({ assignmentText }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card">
      <h2 className="text-xl font-semibold mb-2">Assignment</h2>
      <p className="text-muted-foreground">{assignmentText}</p>
    </div>
  );
};