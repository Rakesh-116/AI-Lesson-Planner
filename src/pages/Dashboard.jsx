import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lesson Planner Dashboard</h1>
        <Button
          variant="outline"
          onClick={() => navigate("/login")}
          className="cursor-pointer"
        >
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card
          className="cursor-pointer hover:bg-accent"
          onClick={() => navigate("/planner")}
        >
          <CardHeader>
            <CardTitle>Create New Lesson Plan</CardTitle>
            <CardDescription>
              Generate a new AI-powered lesson plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Start with a blank template and let AI help you create a
              structured lesson plan.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Plans</CardTitle>
            <CardDescription>
              Your recently created lesson plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent plans found.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
