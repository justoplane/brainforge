import { useApi } from "../../lib/hooks/use_api";
import { useEffect, useState } from "react";
import { requireLogin } from "../../lib/hooks/require_login";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const Dashboard = () => {
  requireLogin();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  
  async function fetchUser() {
    const res = await api.get("/api/users/me");
    if (!res.error) {
      setUser(res.user);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUser();
  }, [])

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user?.firstName}</h1>
    </div>
  );
}