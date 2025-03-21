import { useApi } from "../../lib/hooks/use_api";
import { useEffect, useState } from "react";
import { requireLogin } from "../../lib/hooks/require_login";
import { Link } from "react-router";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router"; // Add this import for navigation

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
};

const mockProjects: Project[] = [
  { id: "1", title: "Project Alpha", description: "Description for Project Alpha" },
  { id: "2", title: "Project Beta", description: "Description for Project Beta" },
  { id: "3", title: "Project Gamma", description: "Description for Project Gamma" },
  { id: "4", title: "Project Delta", description: "Description for Project Delta" },
  { id: "5", title: "Project Epsilon", description: "Description for Project Epsilon" },
  { id: "6", title: "Project Zeta", description: "Description for Project Zeta" },
];

export const Dashboard = () => {
  requireLogin();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [newProjectName, setNewProjectName] = useState("");
  const navigate = useNavigate();


  async function fetchUser() {
    const res = await api.get("/api/users/me");
    if (!res.error) {
      setUser(res.user);
    }
    setLoading(false);
  }

  async function fetchProjects() {
    const res = await api.get("/api/projects");
    if (!res.error) {
      setProjects(res.projects);
    }
  }

  async function createProject() {
    if (!newProjectName) {
      return;
    }
    const res = await api.post("/api/projects", { title: newProjectName });
    if (!res.error) {
      setProjects((prev) => [...prev, res.project]);
      navigate(`/projects/${res.project.id}`);
    }
    else{
      console.log(res.error);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchProjects();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.firstName}</h1>
      <Dialog>
      <DialogTrigger asChild>
        <Button className="mx-auto my-4" variant="outline">Create New Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Enter the name your new project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Name
            </Label>
            <Input id="name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={createProject}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <h2 className="text-xl font-semibold">{project.title}</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{project.description}</p>
              <Button asChild variant="link" className="mt-4">
                <Link to={`/projects/${project.id}`}>View Project</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </div>
  );
};