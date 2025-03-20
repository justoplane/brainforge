import ReactMarkdown from "react-markdown";

interface TaskProps {
  instructions: string;
  expectedOutput?: string;
}

export function Task({ instructions, expectedOutput }: TaskProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card">
      <h2 className="text-xl font-semibold mb-2">Assignment</h2>
      
      <div className="p-3 border border-solid rounded-md bg-muted/20">
        <ReactMarkdown>{instructions}</ReactMarkdown>
      </div>
      
      {expectedOutput && (
        <div className="p-3 border border-dashed rounded-md bg-muted/10 mt-4">
          <b className="text-primary">Expected Output: </b>
          <p className="text-muted-foreground">{expectedOutput}</p>
        </div>
      )}
    </div>
  );
};