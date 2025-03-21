import { Outlet, Link, useNavigate } from "react-router";
import { Error } from "../../components/common/Error";
import { useAuthToken } from "../../lib/hooks/use_auth_token";
import { Button } from "../../components/ui/button";
import { useDispatch } from "react-redux";
import { clearAuthToken } from "@/store/application_slice";

export const Layout = () => {
  const authToken = useAuthToken();
  const isAuthenticated = !!authToken;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(clearAuthToken());
    navigate("/signin", { replace: true });
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
      <main className="w-full py-6">
        <Outlet />
      </main>
    </>
  );
};