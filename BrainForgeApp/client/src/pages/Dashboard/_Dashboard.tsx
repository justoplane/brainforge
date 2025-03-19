import { useApi } from "../../lib/hooks/use_api";
import { useEffect, useState } from "react";
import { requireLogin } from "../../lib/hooks/require_login";
import { Link } from "react-router";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

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

  async function fetchUser() {
    const res = await api.get("/api/users/me");
    if (!res.error) {
      setUser(res.user);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.firstName}</h1>
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