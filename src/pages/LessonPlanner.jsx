import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

export function LessonPlanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [lessonPlan, setLessonPlan] = useState({
    topic: "",
    summary: "",
    date: "",
    subject: "",
    gradeLevel: "",
    mainTopic: "",
    subtopics: "",
    materialsNeeded: "",
    learningObjectives: "",
    lessonOutline: [
      { duration: "", activity: "", remarks: "" },
      { duration: "", activity: "", remarks: "" },
      { duration: "", activity: "", remarks: "" },
    ],
    notes: "",
  });

  const handleGeneratePlan = async () => {
    try {
      setIsLoading(true);
      setError("");
      setHasGeneratedContent(false);

      if (!lessonPlan.topic || !lessonPlan.subject || !lessonPlan.gradeLevel) {
        setError(
          "Please fill in Topic, Subject and Grade Level before generating"
        );
        return;
      }

      const genAI = new GoogleGenerativeAI(
        "AIzaSyBOwU4kY3FyOrCISP3KHb_oixGstdGmSxs"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Create a detailed lesson plan for the following:
        Topic: ${lessonPlan.topic}
        Subject: ${lessonPlan.subject}
        Grade Level: ${lessonPlan.gradeLevel}
        
        Please provide:
        1. A brief summary ${lessonPlan.summary}
        2. Main topic and subtopics ${lessonPlan.mainTopic} ${lessonPlan.subtopics}
        3. Materials needed ${lessonPlan.materialsNeeded}
        4. Learning objectives ${lessonPlan.learningObjectives}
        5. Three lesson activities with duration and remarks ${lessonPlan.lessonOutline}
        
        Format the response as a JSON object matching this structure:
        {
          "summary": "",
          "mainTopic": "",
          "subtopics": "",
          "materialsNeeded": "",
          "learningObjectives": "",
          "lessonOutline": [
            {"duration": "", "activity": "", "remarks": ""}
          ]
        }`;

      const result = await model.generateContent(prompt);
      const response = result.response.candidates[0].content.parts[0].text;
      console.log("Raw response:", response);

      const cleanedResponse = response.replace(/```json\n|\n```/g, "").trim();

      if (!cleanedResponse) {
        throw new Error("Empty response from AI model");
      }

      try {
        const generatedPlan = JSON.parse(cleanedResponse);
        setAiResponse(generatedPlan);
        setShowModal(true);
        setHasGeneratedContent(true);
      } catch (parseError) {
        throw new Error(`Failed to parse AI response: ${parseError.message}`);
      }
    } catch (err) {
      console.error("Detailed error:", err);
      setError(
        `Failed to generate lesson plan: ${err.message || "Please try again"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLocalStorage = (plan) => {
    try {
      const timestamp = new Date().getTime();
      localStorage.setItem(`lessonPlan_${timestamp}`, JSON.stringify(plan));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const handleApplyAiSuggestions = () => {
    if (!aiResponse) return;

    const updatedPlan = {
      ...lessonPlan,
      summary: aiResponse.summary || lessonPlan.summary,
      mainTopic: aiResponse.mainTopic || lessonPlan.mainTopic,
      subtopics: aiResponse.subtopics || lessonPlan.subtopics,
      materialsNeeded: aiResponse.materialsNeeded || lessonPlan.materialsNeeded,
      learningObjectives:
        aiResponse.learningObjectives || lessonPlan.learningObjectives,
      lessonOutline: aiResponse.lessonOutline || lessonPlan.lessonOutline,
    };

    setLessonPlan(updatedPlan);
    saveToLocalStorage(updatedPlan);
    setShowModal(false);
  };

  return (
    <div className="container mx-auto p-6">
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      {hasGeneratedContent && (
        <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
          AI has generated content for your lesson plan. Please review and edit
          as needed.
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create Lesson Plan</h1>
        <div className="space-x-2">
          <Button onClick={handleGeneratePlan} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate with AI"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="basic-info">
              <AccordionTrigger>Basic Information</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      value={lessonPlan.topic}
                      onChange={(e) =>
                        setLessonPlan({ ...lessonPlan, topic: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      value={lessonPlan.summary}
                      onChange={(e) =>
                        setLessonPlan({
                          ...lessonPlan,
                          summary: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={lessonPlan.date}
                        onChange={(e) =>
                          setLessonPlan({ ...lessonPlan, date: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={lessonPlan.subject}
                        onChange={(e) =>
                          setLessonPlan({
                            ...lessonPlan,
                            subject: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="gradeLevel">Grade Level</Label>
                      <Input
                        id="gradeLevel"
                        value={lessonPlan.gradeLevel}
                        onChange={(e) =>
                          setLessonPlan({
                            ...lessonPlan,
                            gradeLevel: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="topics">
              <AccordionTrigger>Topics & Materials</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="mainTopic">Main Topic</Label>
                    <Input
                      id="mainTopic"
                      value={lessonPlan.mainTopic}
                      onChange={(e) =>
                        setLessonPlan({
                          ...lessonPlan,
                          mainTopic: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtopics">Subtopics</Label>
                    <Textarea
                      id="subtopics"
                      value={lessonPlan.subtopics}
                      onChange={(e) =>
                        setLessonPlan({
                          ...lessonPlan,
                          subtopics: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="materials">Materials Needed</Label>
                    <Textarea
                      id="materials"
                      value={lessonPlan.materialsNeeded}
                      onChange={(e) =>
                        setLessonPlan({
                          ...lessonPlan,
                          materialsNeeded: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="objectives">
              <AccordionTrigger>Learning Objectives</AccordionTrigger>
              <AccordionContent>
                <div>
                  {/* <Label htmlFor="objectives">Learning Objectives</Label> */}
                  <Textarea
                    id="objectives"
                    value={lessonPlan.learningObjectives}
                    onChange={(e) =>
                      setLessonPlan({
                        ...lessonPlan,
                        learningObjectives: e.target.value,
                      })
                    }
                    placeholder="Include at least two outcomes based on Bloom's Taxonomy..."
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="outline">
              <AccordionTrigger>Lesson Outline</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {lessonPlan.lessonOutline.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Duration</Label>
                        <Input
                          value={item.duration}
                          onChange={(e) => {
                            const newOutline = [...lessonPlan.lessonOutline];
                            newOutline[index].duration = e.target.value;
                            setLessonPlan({
                              ...lessonPlan,
                              lessonOutline: newOutline,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <Label>Activity</Label>
                        <Input
                          value={item.activity}
                          onChange={(e) => {
                            const newOutline = [...lessonPlan.lessonOutline];
                            newOutline[index].activity = e.target.value;
                            setLessonPlan({
                              ...lessonPlan,
                              lessonOutline: newOutline,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <Label>Remarks</Label>
                        <Input
                          value={item.remarks}
                          onChange={(e) => {
                            const newOutline = [...lessonPlan.lessonOutline];
                            newOutline[index].remarks = e.target.value;
                            setLessonPlan({
                              ...lessonPlan,
                              lessonOutline: newOutline,
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="notes">
              <AccordionTrigger>Notes</AccordionTrigger>
              <AccordionContent>
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={lessonPlan.notes}
                    onChange={(e) =>
                      setLessonPlan({ ...lessonPlan, notes: e.target.value })
                    }
                    placeholder="Include your pre-lesson reminders or post-discussion observations here..."
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Generated Suggestions</DialogTitle>
          </DialogHeader>

          {aiResponse && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Summary</h3>
                <p className="text-sm">{aiResponse.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold">Main Topic</h3>
                <p className="text-sm">{aiResponse.mainTopic}</p>
              </div>
              <div>
                <h3 className="font-semibold">Subtopics</h3>
                <p className="text-sm">{aiResponse.subtopics}</p>
              </div>
              <div>
                <h3 className="font-semibold">Materials Needed</h3>
                <p className="text-sm">{aiResponse.materialsNeeded}</p>
              </div>
              <div>
                <h3 className="font-semibold">Learning Objectives</h3>
                <p className="text-sm">{aiResponse.learningObjectives}</p>
              </div>
              <div>
                <h3 className="font-semibold">Lesson Outline</h3>
                {aiResponse.lessonOutline.map((item, index) => (
                  <div key={index} className="ml-4 mt-2">
                    <p className="text-sm">
                      <span className="font-medium">Duration:</span>{" "}
                      {item.duration}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Activity:</span>{" "}
                      {item.activity}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Remarks:</span>{" "}
                      {item.remarks}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyAiSuggestions}>
              Apply Suggestions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
