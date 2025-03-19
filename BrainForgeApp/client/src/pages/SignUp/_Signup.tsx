import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { FormEvent, useState } from "react";
import { useApi } from "../../lib/hooks/use_api";
import { setAuthToken } from "../../store/application_slice";
import { Card, CardHeader, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

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
    <main className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <h3 className="text-2xl font-bold text-center">Sign Up</h3>
        </CardHeader>
        <form onSubmit={signUp}>
          <CardContent className="space-y-4">
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Confirm Email"
              value={emailConfirmation}
              onChange={e => setEmailConfirmation(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirmation}
              onChange={e => setPasswordConfirmation(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <Button type="submit" className="w-full">Create Account</Button>
            <p className="text-sm text-center">
              Already have an account? <Link to="/signin" className="text-primary font-medium">Go to sign in.</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
};