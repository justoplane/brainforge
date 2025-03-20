import React from "react";

interface TaskProps {
  instructions: string;
  expectedOutput?: string;
}

export const Task: React.FC<TaskProps> = ({ instructions, expectedOutput }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card">
      <h2 className="text-xl font-semibold mb-2">Assignment</h2>
      <p className="text-muted-foreground">{instructions}</p>
      {expectedOutput && (
        <p className="text-muted-foreground">Expected Output: {expectedOutput}</p>
      )}
    </div>
  );
};