import { useApi } from "../../lib/hooks/use_api";
import { useEffect, useState } from "react";
import { requireLogin } from "../../lib/hooks/require_login";
import { OptionsDrawer } from "../../components/project/OptionsDrawer";
import { ProjectHistory } from "../../components/project/ProjectHistory";
import { CodeIDE } from "../../components/project/CodeIDE";
import { ChatContainer } from "../../components/project/ChatContainer";
import { OutputContainer } from "../../components/project/OutputContainer";
import { Task } from "../../components/project/Task";
import { Drawer,  DrawerContent,  DrawerTrigger,} from "../../components/ui/drawer";
import { DialogTitle } from "../../components/ui/dialog";
import { useParams } from "react-router";
import { Button } from "../../components/ui/button";


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
  expectedOutput: string;
  projectId: number;
  createdAt: string;
  updatedAt: string;
};


export const Project = () => {
  requireLogin();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [output, setOutput] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [starterCode, setStarterCode] = useState<string>("");
  const [history, setHistory] = useState<History[] | null>(null);
  const [currentHistory, setCurrentHistory] = useState<History | null>(null);
  const [correctOutputMessage, setCorrectOutputMessage] = useState<string>("");
  const api = useApi();

  async function fetchProject() {
    const res = await api.get(`/api/projects/${id}`);
    if (!res.error) {
      setProject(res.project);
      setLoading(false);
    }
  }

  async function fetchHistory() {
    const res = await api.get(`/api/projects/${id}/history`);
    if (!res.error) {
      setHistory(res.history);
    }
  }

  useEffect(() => {
    fetchProject();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (history != null && history?.length >0) {
      setCurrentHistory(history[history.length-1]);
    }
  }, [history]);

  useEffect(() => {
    if (currentHistory) {
      setInstructions(currentHistory.instructions);
      setStarterCode(currentHistory.starterCode || "");
    }
  }, [currentHistory]);


  useEffect(() => {

    if(currentHistory){
      const trimmedOutput = output.replace(/\s+$/, "");
      if(trimmedOutput === currentHistory.expectedOutput){
        setCorrectOutputMessage("Correct Output!");
      }
      else{
        setCorrectOutputMessage("Incorrect Output!");
      }
    }
    
  }, [output]);

  
  const handleAssignmentSubmit = (newHistory: History) => {
    // Update the UI with the new history data
    setInstructions(newHistory.instructions);
    setStarterCode(newHistory.starterCode || "");
  
    // update history
    setHistory(history ? [...history, newHistory] : [newHistory]);
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
      {/* Left Side Drawer create options drawer*/}
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

        <DrawerContent className="w-[300px] p-0" aria-describedby="">
          <DialogTitle className="text-xl font-semibold">Create New Assignment</DialogTitle> {/* Add DialogTitle */}


          <div className="h-full">
            <DialogTitle></DialogTitle>
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

        <DrawerContent className="w-[300px] p-0" aria-describedby="">
          <DialogTitle className="text-xl font-semibold">Project History</DialogTitle>
          <div className="h-full">
            <DialogTitle></DialogTitle>
            <ProjectHistory 
              projectId={project.id} 
              setHistory={(newHistory: History) => 
                setHistory(prev => prev ? [...prev, newHistory] : [newHistory])
              } 
            />
          </div>
        </DrawerContent>
      </Drawer>
      

      {/* Main Content */}
      <div className="flex-1 container mx-auto py-6 px-4 w-full">
        <h1 className="text-3xl font-bold text-center">{project?.title}</h1>
        <p className="text-muted-foreground text-center mb-6">Welcome click "Create New" to add learning resources and create a challenges or assignment based off your learning. You may create multiple challenges/assignments in a project.</p>
        <div className="grid grid-cols-4 gap-6">
          <Task instructions={instructions} expectedOutput={history?.[history.length - 1]?.expectedOutput} />
          
          {/* CodeIDE and OutputContainer stacked vertically */}
          <div className="col-span-2 flex flex-col gap-6">
            <CodeIDE setOutput={setOutput} starterCode={starterCode}/>
            <OutputContainer output={output} />
            {output && (
              <div className="bg-green-100 text-green-800 p-4 rounded">
              {correctOutputMessage}
              </div>
            )}
          </div>
          
          <ChatContainer historyId={history?.[history.length - 1]?.id} />
        </div>
      </div>
    </div>
  );
};