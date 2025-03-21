import { useEffect } from "react";
import { useState } from "react";
import { useApi } from "../../lib/hooks/use_api";

type History = {
  id: number;
  type: "Assignment" | "Challenge";
  instructions: string;
  starterCode?: string;
  expectedOutput: string;
  projectId: number;
  createdAt: string;
  updatedAt: string;
};
interface ProjectHistoryProps {
  projectId: number;
  setHistory: (history: History) => void;
}



export function ProjectHistory({ projectId, setHistory }: ProjectHistoryProps) {
  const [histories, setHistories] = useState<History[]>([]); // Ensure it's initialized as an empty array
  const api = useApi();

  async function fetchHistories() {
    const res = await api.get(`/api/projects/${projectId}/history`);
    if (!res.error && res.history) { // Ensure res.histories exists
      console.log("Histories:", res.history);
      setHistories(res.history);
    } else {
      console.error("Failed to fetch histories or no histories available.");
      setHistories([]); // Fallback to an empty array
    }
  }

  useEffect(() => {
    fetchHistories();
  }, [projectId]);

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        <div className="space-y-4 mt-4">
          {/* Add a fallback check to ensure histories is defined */}
          {histories && histories.length > 0 ? (
            histories.map((history) => (
              <div key={history.id} className="border rounded-lg p-3 bg-card" onClick={() => setHistory(history)}>
                <div className="text-sm font-medium">{history.type}</div>
                <div className="text-muted-foreground text-sm">{history.createdAt}</div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm mt-6">
              No history available for this project. Click Create New to make new challenges/assignments.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

