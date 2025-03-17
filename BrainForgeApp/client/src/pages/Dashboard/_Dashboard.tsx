import { useApi } from "../../lib/hooks/use_api";
import { useEffect, useState } from "react";
import { requireLogin } from "../../lib/hooks/require_login";
import { Link } from "react-router";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

type Project = {
  id: string;
  title: string;
  description: string;
}

const mockProjects: Project[] = [
  { id: '1', title: 'Project Alpha', description: 'Description for Project Alpha' },
  { id: '2', title: 'Project Beta', description: 'Description for Project Beta' },
  { id: '3', title: 'Project Gamma', description: 'Description for Project Gamma' },
  { id: '4', title: 'Project Delta', description: 'Description for Project Delta' },
  { id: '5', title: 'Project Epsilon', description: 'Description for Project Epsilon' },
  { id: '6', title: 'Project Zeta', description: 'Description for Project Zeta' },
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

  // async function getLearningProjects() {
  //   const res = await api.get("/api/projects");
  //   if (!res.error) {
  //     console.log(res.projects);
  //     setProjects(res.projects);
  //   }
  // }

  useEffect(() => {
    fetchUser();
    //getLearningProjects();
  }, [])

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.firstName}</h1>
      <div className="projects-container">
        {projects.map(project => (
          <Link key={project.id} to={`/projects/${project.id}`} className="project-card">
          {/* <div key={project.id} className="project-card"> */}
            <h2>{project.title}</h2>
            <p>{project.description}</p>
          {/* </div> */}
          </Link>
        ))}
      </div>
    </div>
  );
}