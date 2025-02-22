import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Trash2 } from "lucide-react";

export function LessonList() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedLesson, setEditedLesson] = useState(null);

  useEffect(() => {
    const allLessons = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("lessonPlan")) {
        try {
          const lesson = JSON.parse(localStorage.getItem(key));
          allLessons.push(lesson);
        } catch (error) {
          console.error("Error parsing lesson:", error);
        }
      }
    }
    setLessons(allLessons);
  }, []);

  const handleSave = () => {
    if (editedLesson) {
      console.log("lessons", lessons);
      const updatedLessons = [...lessons];
      const index = lessons.findIndex((l) => l === selectedLesson);
      updatedLessons[index] = editedLesson;
      setLessons(updatedLessons);
      console.log("updatedLessons", updatedLessons);

      localStorage.setItem(`lessonPlan${index}`, JSON.stringify(editedLesson));
      setIsModalOpen(false);
    }
  };

  const handleDelete = (lessonToDelete) => {
    let storageKeyToDelete = null;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("lessonPlan")) {
        const storedLesson = JSON.parse(localStorage.getItem(key));
        if (
          storedLesson.topic === lessonToDelete.topic &&
          storedLesson.date === lessonToDelete.date &&
          storedLesson.subject === lessonToDelete.subject
        ) {
          storageKeyToDelete = key;
          break;
        }
      }
    }

    if (storageKeyToDelete) {
      localStorage.removeItem(storageKeyToDelete);
    }

    const updatedLessons = lessons.filter(
      (lesson) => lesson !== lessonToDelete
    );
    setLessons(updatedLessons);
  };

  return (
    <div className="min-h-screen mx-auto px-20 py-10 w-full">
      <div className="flex justify-between items-center mb-6 w-full">
        <h1 className="text-3xl font-bold">My Lesson Plans</h1>
        <Button onClick={() => navigate("/planner")}>Create New Lesson</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{lesson.topic || "Untitled Lesson"}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(lesson);
                }}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Subject:</strong> {lesson.subject}
                </p>
                <p>
                  <strong>Grade Level:</strong> {lesson.gradeLevel}
                </p>
                <p>
                  <strong>Date:</strong> {lesson.date}
                </p>
                <p className="line-clamp-3">
                  <strong>Summary:</strong> {lesson.summary}
                </p>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedLesson(lesson);
                      setEditedLesson({ ...lesson });
                      setIsModalOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No lesson plans found. Create your first lesson plan!
          </p>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} className="">
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 p-4">
            <DialogContent className="max-w-2xl h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Lesson Details</DialogTitle>
              </DialogHeader>
              {editedLesson && (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold">Topic:</label>
                    <input
                      className="w-full p-2 border rounded"
                      value={editedLesson.topic}
                      onChange={(e) =>
                        setEditedLesson({
                          ...editedLesson,
                          topic: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-bold">Subject:</label>
                    <input
                      className="w-full p-2 border rounded"
                      value={editedLesson.subject}
                      onChange={(e) =>
                        setEditedLesson({
                          ...editedLesson,
                          subject: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-bold">Grade Level:</label>
                    <input
                      className="w-full p-2 border rounded"
                      value={editedLesson.gradeLevel}
                      onChange={(e) =>
                        setEditedLesson({
                          ...editedLesson,
                          gradeLevel: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-bold">Date:</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      value={editedLesson.date}
                      onChange={(e) =>
                        setEditedLesson({
                          ...editedLesson,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-bold">Summary:</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={editedLesson.summary}
                      rows={4}
                      onChange={(e) =>
                        setEditedLesson({
                          ...editedLesson,
                          summary: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-bold">Learning Objectives:</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={editedLesson.learningObjectives}
                      rows={3}
                      onChange={(e) =>
                        setEditedLesson({
                          ...editedLesson,
                          learningObjectives: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-bold">Materials Needed:</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={editedLesson.materialsNeeded}
                      rows={3}
                      onChange={(e) =>
                        setEditedLesson({
                          ...editedLesson,
                          materialsNeeded: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-bold">Lesson Structure:</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={editedLesson.lessonStructure}
                      rows={4}
                      onChange={(e) =>
                        setEditedLesson({
                          ...editedLesson,
                          lessonStructure: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-bold">Assessment Methods:</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={editedLesson.assessmentMethods}
                      rows={3}
                      onChange={(e) =>
                        setEditedLesson({
                          ...editedLesson,
                          assessmentMethods: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-bold">Additional Notes:</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={editedLesson.additionalNotes}
                      rows={3}
                      onChange={(e) =>
                        setEditedLesson({
                          ...editedLesson,
                          additionalNotes: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </div>
        )}
      </Dialog>
    </div>
  );
}
