import { useApi } from "../../lib/hooks/use_api";
import { useEffect, useState } from "react";
import { requireLogin } from "../../lib/hooks/require_login";
import { OptionsDrawer } from "../../components/project/OptionsDrawer";
import { ProjectHistory } from "../../components/project/ProjectHistory";
import { CodeIDE } from "../../components/project/CodeIDE";
import { ChatContainer } from "../../components/project/ChatContainer";
import { OutputContainer } from "../../components/project/OutputContainer";


type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

type Project = {
  id: number;
  title: string;
  description: string;
  // Add other project fields as needed
}


const defaultProject: Project = {
  id: 1000000000,
  title: 'Default Project',
  description: 'this is default project description',
}

export const Project = () => {
  requireLogin();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(defaultProject);
  // const [project, setProject] = useState<Project | null>(null);
  const api = useApi();
  
  async function fetchUser() {
    const res = await api.get("/api/users/me");
    if (!res.error) {
      setUser(res.user);
    }
    setLoading(false);
  }

  // async function fetchProject() {
  //   const res = await api.get(`/api/projects/${project?.id}`);
  //   if (!res.error) {
  //     setProject(res.project);
  //   }
  //   setLoading(false);
  // }

  useEffect(() => {
    fetchUser();
  }, [])

  if (loading) return <div>Loading...</div>;

  return (
    <div className="project-page">
      <OptionsDrawer />
      <div className="main-content">
        <ProjectHistory />
        <CodeIDE />
        <div className="right-container">
          <ChatContainer />
          <OutputContainer />
        </div>
      </div>
    </div>
    
  );
}