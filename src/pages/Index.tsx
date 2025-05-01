
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the Home page
    navigate("/", { replace: true });
  }, [navigate]);

  // Render the Home component directly during transition to prevent flashing
  return <Home />;
};

export default Index;
