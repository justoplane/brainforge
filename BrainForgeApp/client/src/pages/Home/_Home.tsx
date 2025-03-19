import { Link } from "react-router";
import { Card, CardContent} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export const Home = () => {
  return (
    <main className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Welcome to Brain Forge</h2>
          <p className="text-lg text-muted-foreground">
            This app allows users to input learning resources, focused mostly on programming, 
            and use AI to develop challenges and assignments to test the user on what they have learned.
          </p>
          <Button asChild>
            <Link to="/signup">Try Now</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};