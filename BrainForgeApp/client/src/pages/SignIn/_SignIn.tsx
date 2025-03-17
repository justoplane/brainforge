import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { FormEvent, useState } from "react";
import { useApi } from "../../lib/hooks/use_api";
import { setAuthToken } from "../../store/application_slice";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const api = useApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function signIn(e: FormEvent) {
    e.preventDefault();
    const res = await api.post("/sessions", {
      email,
      password
    });
    console.log(res);
    if (!res.error && res.authToken) {
      dispatch(setAuthToken(res.authToken));
      navigate("/dashboard");
    } else {
      console.log(res.error);
    }
  }

  return (
    <main className="auth-container">
      <form onSubmit={signIn} className="auth-form">
        <h3 className="auth-title">Sign In</h3>
        <div className="auth-input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="auth-input"
          />
        </div>
        <div className="auth-input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="auth-input"
          />
        </div>
        <div className="auth-button-group">
          <button className="auth-button">Sign In</button>
        </div>
      </form>
      <div className="auth-footer">
        New user? <Link to="/signup" className="auth-link">Create an account.</Link>
      </div>
    </main>
  );
};