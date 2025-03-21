import ReactMarkdown from "react-markdown";

interface TaskProps {
  instructions: string;
  expectedOutput?: string;
}

export function Task({ instructions, expectedOutput }: TaskProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card">
      <h2 className="text-xl font-semibold mb-2">Assignment</h2>
      
      <div className="p-3 border border-solid rounded-md bg-muted/20 break-words overflow-y-auto max-h-102">
        <ReactMarkdown>{instructions}</ReactMarkdown>
      </div>
      
      {expectedOutput && (
        <div className="p-3 border border-dashed rounded-md bg-muted/10 overflow-y-auto mt-4">
          <b className="text-primary">Expected Output: </b>
          <pre className="bg-muted p-2 rounded-lg whitespace-pre-wrap break-words">{expectedOutput}</pre>
        </div>
      )}
    </div>
  );
};