interface OutputContainerProps {
  output: string;
}

export const OutputContainer: React.FC<OutputContainerProps> = ({ output }) => {
  return (
    <div className="output-container">
      <h2>Output</h2>
      <pre>{output}</pre>
    </div>
  );
};

