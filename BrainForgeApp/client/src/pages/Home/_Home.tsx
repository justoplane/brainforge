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
          Brain Forge is an AI-powered learning platform that turns your study materials into interactive assignments and coding challenges. Simply upload your learning resources—whether it's articles, textbooks, or video series—and Brain Forge will generate tailored exercises to reinforce key concepts and test your knowledge. Whether you're a student looking to practice, an educator designing coursework, or a self-learner exploring new topics, Brain Forge helps you engage with content in a more hands-on, meaningful way.
          </p>
          <Button asChild>
            <Link to="/signup">Try Now</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};