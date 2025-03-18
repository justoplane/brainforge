import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { runCode } from "../../api/pistonapi";

interface CodeIDEProps {
  setOutput: (output: string) => void;
}

export const CodeIDE: React.FC<CodeIDEProps> = ({ setOutput }) => {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("javascript");

  const handleRunCode = async () => {
    const result = await runCode(language, code);
    setOutput(result.output || result.message || "Error running code");
  };

  return (
    <div className="code-ide">
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