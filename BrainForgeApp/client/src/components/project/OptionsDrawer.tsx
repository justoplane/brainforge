import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { useApi } from "@/lib/hooks/use_api";



// interface OptionsDrawerProps {
//   onAssignmentSubmit: (data: { type: string; instructions: string; starterCode: string; expectedOutput: string }) => void;
//   projectId: string; // Add projectId as a prop
// }

// interface OptionsDrawerProps {
//   onAssignmentSubmit: (data: { type: "Assignment" | "Challenge"; instructions: string; starterCode?: string; expectedOutput?: string }) => void;
//   projectId: string; // Add projectId as a prop
// }

interface OptionsDrawerProps {
  onAssignmentSubmit: (history: any) => void;
  projectId: string; // Add projectId as a prop
}

type History = {
  id: number;
  type: "Assignment" | "Challenge";
  instructions: string;
  starterCode?: string;
  expectedOutput?: string;
  projectId: number;
  createdAt: string;
  updatedAt: string;
};



export const OptionsDrawer: React.FC<OptionsDrawerProps> = ({ onAssignmentSubmit, projectId }) => {
  const [taskType, setTaskType] = useState("challenge");
  const [inputType, setInputType] = useState("text");
  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const api = useApi();
  const [history, setHistory] = useState<History | null>(null);
  
  

  // const handleSubmit = async () => {
  //   // onAssignmentSubmit({ type: taskType as "Assignment" | "Challenge", instructions: inputValue });
    

  //   // try {
  //   //   console.log("Submitting assignment...");
  //   //   console.log("Task Type:", taskType);
  //   //   console.log("Input Type:", inputType);
  //   //   console.log("Input Value:", inputValue);
  //   //   console.log("File:", file);
  //   //   const response = await api.post("/api/ai/generate", {
  //   //       projectId, 
  //   //       type: taskType.toUpperCase(),
  //   //       inputType,
  //   //       inputValue: inputType === 'pdf' && file ? file.name : inputValue,
        
        
  //   //   });
const handleSubmit = async () => {
    try {
      console.log("Submitting assignment...");
      console.log("Task Type:", taskType);
      console.log("Input Type:", inputType);
      console.log("Input Value:", inputValue);
      console.log("File:", file);
      const response = await api.post("/api/ai/generate", {
          projectId, 
          type: taskType.toUpperCase(),
          inputType,
          inputValue: inputType === 'pdf' && file ? file.name : inputValue,
      });
      
      if (response) {
        onAssignmentSubmit(response.history); // Pass the server response to the parent
      } else {
        console.error('Error: response was not ok.');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);}


  //   //   if (response.ok) {
  //   //     const data = await response.json();
  //   //     onAssignmentSubmit(data); // Pass the server response to the parent
  //   //   } else {
  //   //     const error = await response.json();
  //   //     console.error('Error:', error);
  //   //   }
  //   // } catch (error) {
  //   //   console.error('Error submitting assignment:', error);

    
  //   //  }
  //   };

  const handleSubmitMock = () => {
    
      const history = {
        
        type: taskType as "Assignment" | "Challenge",
        instructions: "here is some default instructions",
        starterCode: taskType === "challenge" ? "// Starter code here" : undefined,
        expectedOutput: taskType === "challenge" ? "Expected output will go here here" : undefined,
        projectId: parseInt(projectId),
      };
      onAssignmentSubmit(history);


  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        {/* <h2 className="text-xl font-semibold">Create New Challenge</h2> */}
        
        {/* Task Type Dropdown */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Task Type</label>
          <Select value={taskType} onValueChange={(value) => setTaskType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Task Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="challenge">Challenge</SelectItem>
              <SelectItem value="assignment">Assignment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Input Type Dropdown */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Input Type</label>
          <Select value={inputType} onValueChange={(value) => setInputType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Input Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="youtube">YouTube Link</SelectItem>
              <SelectItem value="text">Text</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conditional Input Fields */}
        {inputType === "pdf" && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Upload PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        )}
        {inputType === "youtube" && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">YouTube Link</label>
            <input
              type="url"
              placeholder="Enter YouTube link"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        )}
        {inputType === "text" && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Text</label>
            <textarea
              placeholder="Enter text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 border rounded-lg"
            ></textarea>
          </div>
        )}

        {/* Submit and Generate AI Response Buttons */}
        <div className="flex space-x-4 mt-6">
          <Button onClick={handleSubmit} className="w-full">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

