import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">Lesson Planner</h1>
          </div>

          <div className="flex gap-2">
            <Button
              variant={location.pathname === "/" ? "default" : "outline"}
              onClick={() => navigate("/")}
            >
              Dashboard
            </Button>
            <Button
              variant={location.pathname === "/lessons" ? "default" : "outline"}
              onClick={() => navigate("/lessons")}
            >
              My Lessons
            </Button>
            <Button
              variant={location.pathname === "/planner" ? "default" : "outline"}
              onClick={() => navigate("/planner")}
            >
              Create Lesson
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
