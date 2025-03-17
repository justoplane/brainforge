import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { FormEvent, useState } from "react";
import { useApi } from "../../lib/hooks/use_api";
import { setAuthToken } from "../../store/application_slice";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailConfirmation, setEmailConfirmation] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const api = useApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function signUp(e: FormEvent) {
    e.preventDefault();
    const res = await api.post("/api/users", {
      firstName,
      lastName,
      email,
      password
    });

    if (!res.error && res.authToken) {
      dispatch(setAuthToken(res.authToken));
      navigate("/dashboard");
    } else {
      console.log(res.error);
    }
  }

  return (
    <main className="auth-container">
      <form onSubmit={signUp} className="auth-form">
        <h3 className="auth-title">Sign Up</h3>
        <div className="auth-input-group">
          <input
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="auth-input"
          />
        </div>
        <div className="auth-input-group">
          <input
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="auth-input"
          />
        </div>
        <div className="auth-input-group">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="auth-input"
          />
        </div>
        <div className="auth-input-group">
          <input
            placeholder="Confirm Email"
            type="email"
            value={emailConfirmation}
            onChange={e => setEmailConfirmation(e.target.value)}
            className="auth-input"
          />
        </div>
        <div className="auth-input-group">
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="auth-input"
          />
        </div>
        <div className="auth-input-group">
          <input
            placeholder="Confirm Password"
            type="password"
            value={passwordConfirmation}
            onChange={e => setPasswordConfirmation(e.target.value)}
            className="auth-input"
          />
        </div>
        <div className="auth-button-group">
          <button className="auth-button">Create Account</button>
        </div>
      </form>
      <div className="auth-footer">
        Already have an account? <Link to="/signin" className="auth-link">Go to sign in.</Link>
      </div>
    </main>
  );
};