
interface TaskProps {
  instructions: string;
  expectedOutput?: string;
}

export function Task({ instructions, expectedOutput }:TaskProps){
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