import { Outlet, Link } from "react-router";
import { Error } from "../../components/common/Error";
import { useAuthToken } from "../../lib/hooks/use_auth_token";
import { Button } from "../../components/ui/button";

export const Layout = () => {
  const authToken = useAuthToken();
  const isAuthenticated = !!authToken;

  const logout = () => {
    // Implement your logout logic here
  };

  return (
    <>
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <Link to="/" className="text-2xl font-bold">
            Brain Forge
          </Link>
          <nav className="flex space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="secondary">Dashboard</Button>
                </Link>
                <Button variant="destructive" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="secondary">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <Error />
      <main className="container mx-auto py-6 px-4">
        <Outlet />
      </main>
    </>
  );
};