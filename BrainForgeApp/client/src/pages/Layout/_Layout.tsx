import { Outlet, Link } from "react-router";
import { Error } from "../../components/common/Error";
import { useAuthToken } from "../../lib/hooks/use_auth_token";

export const Layout = () => {
  const authToken = useAuthToken();
  const isAuthenticated = !!authToken;

  const logout = () => {
    // Implement your logout logic here
  };

  return (
    <>
      <div className="banner">
        <Link to="/" className="banner-link">
        <h1 className="banner-title">Brain Forge</h1>
        </Link>
        <div className="banner-buttons">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="banner-link">
                <button className="banner-button">Dashboard</button>
              </Link>

              <Link to="/logout" className="banner-link">
                <button className="banner-button" onClick={logout}>Logout</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/signin" className="banner-link">
                <button className="banner-button">Sign in</button>
              </Link>
              <Link to="/signup" className="banner-link">
                <button className="banner-button">Sign up</button>
              </Link>
            </>
          )}
        </div>
      </div>
      <Error />
      <Outlet />
    </>
  );
};