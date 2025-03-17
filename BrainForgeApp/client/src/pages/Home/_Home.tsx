import { Link } from "react-router";

export const Home = () => {
  return (
    
      <div className="description">
        <h2 className="description-title">Welcome to Brain Forge</h2>
        <p className="description-text">
          This app allows users to input learning resources, focused mostly on programming, 
          and use AI to develop challenges and assignments to test the user on what they have learned.
        </p>
        <Link to="/signup" className="try-now-link">Try Now</Link>
      </div>
    
  );
}