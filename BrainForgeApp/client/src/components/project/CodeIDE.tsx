import React, { useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeIDEProps {
  setOutput: (output: string) => void;
}

const languages = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "Ruby", value: "ruby" },
  { label: "Go", value: "go" },
  // Add more languages as needed
];

export const CodeIDE: React.FC<CodeIDEProps> = ({ setOutput }) => {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("javascript");

  const handleRunCode = async () => {
    try {
      const response = await fetch('/api/piston/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, code }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute code');
      }

      const data = await response.json();
      console.log('Data:', data);

      let output = data.run.stdout || data.run.stderr || "Error running code";
      if (data.run.stderr) {
        const stderrLines = data.run.stderr.split('\n');
        stderrLines.shift(); // Remove the first line
        output = stderrLines.join('\n');
      }

      setOutput(output);
    } catch (error) {
      console.error('Error:', error);
      setOutput('Error running code');
    }
  };

  return (
    <div className="code-ide">
      <div className="language-selector">
        <label htmlFor="language">Select Language: </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
      <Editor
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
        height="400px"
        defaultLanguage="javascript"
        defaultValue={code}
        language={language}
        onChange={(value) => setCode(value || "")}
      />
      <button onClick={handleRunCode} className="run-button">Run Code</button>
    </div>
  );
};