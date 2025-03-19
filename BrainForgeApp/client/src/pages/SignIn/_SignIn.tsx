import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { FormEvent, useState } from "react";
import { useApi } from "../../lib/hooks/use_api";
import { setAuthToken } from "../../store/application_slice";
import { Card, CardHeader, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

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
          <h3 className="text-2xl font-bold text-center">Sign In</h3>
        </CardHeader>
        <form onSubmit={signIn}>
          <CardContent className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <Button type="submit" className="w-full">Sign In</Button>
            <p className="text-sm text-center">
              New user? <Link to="/signup" className="text-primary font-medium">Create an account.</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
};