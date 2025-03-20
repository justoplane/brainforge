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
import { DialogTitle } from "../../components/ui/dialog"; // Assuming you have a DialogTitle component
import { useParams } from "react-router";
import { Button } from "../../components/ui/button";

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


type History = {
  id: number;
  type: "Assignment" | "Challenge";
  instructions: string;
  starterCode?: string;
  expectedOutput?: string;
  projectId: number;
  createdAt: string;
  updatedAt: string;
};

type ChatHistory = {
  id: number;
  historyId: number;
  userMessage: string;
  aiMessage: string;
  createdAt: string;
};


export const Project = () => {
  requireLogin();
  const { id } = useParams<{ id: string }>();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [output, setOutput] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [starterCode, setStarterCode] = useState<string>("");
  const [history, setHistory] = useState<History | null>(null);
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

  // const handleAssignmentSubmit = (data: { type: string; instructions: string; starterCode: string; expectedOutput: string }) => {
  //   setAssignmentText(data.instructions); // Update Task instructions
  //   setOutput(data.expectedOutput); // Update OutputContainer with expected output
  //   setIsOptionsOpen(false); // Close drawer after submission
  // };

  const handleAssignmentSubmit = (newHistory: History) => {
    // Update the UI with the new history data
    setInstructions(newHistory.instructions);
    setStarterCode(newHistory.starterCode || "");
    // setOutput(newHistory.expectedOutput || "");
  
    // Optionally, update the history state if needed
    setHistory(newHistory);
  
    // Close the options drawer
    setIsOptionsOpen(false);
  };


  if (loading || !project)
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
          <Button 
            className="absolute top-4 left-0 z-20 bg-primary text-white rounded-r-lg p-2 shadow-md cursor-pointer flex items-center"
            style={{ width: "30px", writingMode: "vertical-rl", textOrientation: "mixed", height: "auto" }}
          >
            Create New
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-[300px] p-0">
          <DialogTitle className="text-xl font-semibold">Create New Assignment</DialogTitle> {/* Add DialogTitle */}
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
          <DialogTitle className="text-xl font-semibold">Project History</DialogTitle>
          <div className="h-full">
            <ProjectHistory />
          </div>
        </DrawerContent>
      </Drawer>
      {/* <div className="relative">
      <Button
        onClick={() => setIsHistoryOpen(true)}
        className="fixed left-4 top-1/2 transform -translate-y-1/2"
      >
        History
      </Button>

      <Drawer open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DrawerContent className="w-80 bg-white">
          
          <div className="p-4 border-b">
            <Button variant="ghost" onClick={() => setIsHistoryOpen(false)}>
              Close
            </Button>
          </div>

          
          <div className="p-4">
            <ProjectHistory />
          </div>
        </DrawerContent>
      </Drawer>
    </div> */}


{/* <div className="relative">
     
      <Button
        onClick={() => setIsHistoryOpen(true)}
        className="fixed right-4 top-1/2 transform -translate-y-1/2"
      >
        History
      </Button>

      
      <Drawer open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DrawerContent className="w-80 bg-white ml-auto">
          
          <div className="p-4 border-b flex justify-end">
            <Button variant="ghost" onClick={() => setIsHistoryOpen(false)}>
              Close
            </Button>
          </div>

          
          <div className="p-4">
            <ProjectHistory />
          </div>
        </DrawerContent>
      </Drawer>
    </div> */}

      {/* Main Content - full width regardless of drawer state */}
      <div className="flex-1 container mx-auto py-6 px-4 w-full">
        <h1 className="text-3xl font-bold text-center">{project?.title}</h1>
        <p className="text-muted-foreground text-center mb-6">{project?.description}</p>
        <div className="grid grid-cols-4 gap-6">
          <Task instructions={instructions} expectedOutput={history?.expectedOutput} />
          <CodeIDE setOutput={setOutput} starterCode={starterCode} />
          <OutputContainer output={output} />
          <ChatContainer />
        </div>
      </div>
    </div>
  );
};