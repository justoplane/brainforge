import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { FormEvent, useEffect, useState } from "react";
import { useApi } from "../../lib/hooks/use_api";
import { setAuthToken } from "../../store/application_slice";
import { Card, CardHeader, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { RootState } from "../../store/store";




export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const api = useApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authToken = useSelector((store: RootState) => store.application.authToken);

  useEffect(() => {
    if (authToken) {
      navigate("/dashboard", { replace: true });
    }
  }, [authToken, navigate]);

  async function signUp(e: FormEvent) {
    e.preventDefault();

    // Check if all fields are filled
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      alert("All fields are required!");
      return;
    }

    if(password.trim().length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    
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
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <Button type="submit" className="w-full mt-4">Create Account</Button>
            <p className="text-sm text-center">
              Already have an account? <Link to="/signin" className="text-primary font-medium">Go to sign in.</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
};