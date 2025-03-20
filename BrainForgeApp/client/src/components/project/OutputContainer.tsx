interface OutputContainerProps {
  output: string;
}

export const OutputContainer = ({ output }: OutputContainerProps) =>{
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card">
      <h2 className="text-xl font-semibold mb-2">Output</h2>
      <pre className="bg-muted p-2 rounded-lg whitespace-pre-wrap break-words">{output}</pre>
    </div>
  );
};

