import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { LessonPlanner } from "./pages/LessonPlanner";
import { LessonList } from "./pages/LessonList";
import { Header } from "./pages/Header";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <>
                <Header />
                <div className="flex items-center justify-center">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/planner" element={<LessonPlanner />} />
                    <Route path="/lessons" element={<LessonList />} />
                  </Routes>
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
