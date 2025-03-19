import { useApi } from "../../lib/hooks/use_api";
import { useEffect, useState } from "react";
import { requireLogin } from "../../lib/hooks/require_login";
import { OptionsDrawer } from "../../components/project/OptionsDrawer";
import { ProjectHistory } from "../../components/project/ProjectHistory";
import { CodeIDE } from "../../components/project/CodeIDE";
import { ChatContainer } from "../../components/project/ChatContainer";
import { OutputContainer } from "../../components/project/OutputContainer";
import { Task } from "../../components/project/Task";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "../../components/ui/drawer";
import { useParams } from "react-router";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type Project = {
  id: number;
  title: string;
  description: string;
};

const defaultProject: Project = {
  id: 1000000000,
  title: "Default Project",
  description: "This is the default project description",
};

// interface OptionsDrawerProps {
//   onAssignmentSubmit: (data: { type: string; instructions: string; starterCode: string; expectedOutput: string }) => void;
//   isOpen: boolean;
// }

export const Project = () => {
  requireLogin();
  const { id } = useParams<{ id: string }>();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(defaultProject);
  const [output, setOutput] = useState<string>("");
  const [assignmentText, setAssignmentText] = useState<string>("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const api = useApi();

  async function fetchUser() {
    const res = await api.get("/api/users/me");
    if (!res.error) {
      setUser(res.user);
    }
    setLoading(false);
  }

  async function fetchProject() {
    const res = await api.get(`/api/projects/${id}`);
    if (!res.error) {
      setProject(res.project);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchProject();
  }, []);

  const handleAssignmentSubmit = (data: { type: string; instructions: string; starterCode: string; expectedOutput: string }) => {
    setAssignmentText(data.instructions); // Update Task instructions
    setOutput(data.expectedOutput); // Update OutputContainer with expected output
    setIsOptionsOpen(false); // Close drawer after submission
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="relative flex min-h-screen">
      {/* Left Side Drawer using chadcn UI */}
      <Drawer
        open={isOptionsOpen}
        onOpenChange={setIsOptionsOpen}
        direction="left"
      >
        <DrawerTrigger asChild>
          <button 
            className="absolute top-4 left-0 z-20 bg-primary text-white rounded-r-lg p-2 shadow-md cursor-pointer flex items-center"
            style={{ width: "30px", writingMode: "vertical-rl", textOrientation: "mixed", height: "auto" }}
          >
            Create New
          </button>
        </DrawerTrigger>
        <DrawerContent className="w-[300px] p-0">
          <div className="h-full">
            <OptionsDrawer onAssignmentSubmit={handleAssignmentSubmit} projectId={id || "default-id"} />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Right Side Drawer for Project History */}
      <Drawer
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        direction="right"
      >
        <DrawerTrigger asChild>
          <button 
            className="absolute top-4 right-0 z-20 bg-primary text-white rounded-l-lg p-2 shadow-md cursor-pointer flex items-center"
            style={{ width: "30px", writingMode: "vertical-rl", textOrientation: "mixed", height: "auto" }}
          >
            History
          </button>
        </DrawerTrigger>
        <DrawerContent className="w-[300px] p-0">
          <div className="h-full">
            <ProjectHistory />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Main Content - full width regardless of drawer state */}
      <div className="flex-1 container mx-auto py-6 px-4 w-full">
        <h1 className="text-3xl font-bold text-center">{project?.title}</h1>
        <p className="text-muted-foreground text-center mb-6">{project?.description}</p>
        <div className="grid grid-cols-4 gap-6">
          <Task assignmentText={assignmentText} />
          <CodeIDE setOutput={setOutput} />
          <OutputContainer output={output} />
          <ChatContainer />
        </div>
      </div>
    </div>
  );
};