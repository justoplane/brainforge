import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface CodeIDEProps {
  setOutput: (output: string) => void;
  starterCode?: string;
  
}

const languages = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "Ruby", value: "ruby" },
  { label: "Go", value: "go" },
];

export function CodeIDE({ setOutput, starterCode}:CodeIDEProps){
  const [code, setCode] = useState(starterCode);
  const [language, setLanguage] = useState("javascript");


  useEffect(() => {
    setCode(starterCode);
  }
  , [starterCode]);

  const handleRunCode = async () => {
    try {
      const response = await fetch("/api/piston/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language, code }),
      });

      if (!response.ok) {
        throw new Error("Failed to execute code");
      }

      const data = await response.json();
      let output = data.run.stdout || data.run.stderr || "Error running code";

      if (data.run.stderr) {
        const stderrLines = data.run.stderr.split("\n");
        stderrLines.shift(); // Remove the first line of error
        output = stderrLines.join("\n");
      }

      setOutput(output);
    } catch (error) {
      setOutput("Error running code");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor="language-select" className="text-sm font-medium text-muted-foreground">
          Select Language:
        </label>
        <Select
          value={language}
          onValueChange={(value) => setLanguage(value)}
        >
          <SelectTrigger id="language-select" className="w-48">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Editor
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
        height="400px"
        defaultLanguage="javascript"
        value={code}
        language={language}
        onChange={(value) => setCode(value)}
        className="border rounded-lg"
      />
      <Button onClick={handleRunCode} className="w-full">
        Run Code
      </Button>
    </div>
  );
};