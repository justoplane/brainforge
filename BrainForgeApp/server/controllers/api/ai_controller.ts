import { EndpointBuilder, controller } from "../controller";
import { $Enums, PrismaClient } from "@prisma/client";
import { authMiddleware } from "../../middleware/auth_middleware";

export const generateAssignmentOrChallenge: EndpointBuilder = (db) => async (req, res) => {
  const { projectId, type } = req.body;

  if (!projectId || !type) {
    return res.status(400).json({ error: "Project ID and type are required" });
  }

  try {
    // Mock AI response
    const mockResponse =
      type === "CHALLENGE"
        ? {
            type: "CHALLENGE",
            instructions: "Write a function to reverse a string.",
            starterCode: "function reverseString(str) { }",
            expectedOutput: "Input: 'hello' -> Output: 'olleh'",
          }
        : {
            type: "ASSIGNMENT",
            instructions: "Create a simple to-do list application using React.",
          };

    // Store the response in the database
    const history = await db.history.create({
      data: {
        projectId,
        type: mockResponse.type as $Enums.HistoryType,
        instructions: mockResponse.instructions,
        starterCode: mockResponse.starterCode || null,
        expectedOutput: mockResponse.expectedOutput || null,
      },
    });

    res.status(201).json({ history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate assignment or challenge" });
  }
};

export const chatWithAI: EndpointBuilder = (db) => async (req, res) => {
  const { historyId, userMessage } = req.body;

  if (!historyId || !userMessage) {
    return res.status(400).json({ error: "History ID and user message are required" });
  }

  try {
    // Fetch the history entry (optional, for validation)
    const history = await db.history.findUnique({
      where: { id: historyId },
    });

    if (!history) {
      return res.status(404).json({ error: "History entry not found" });
    }

    // Mock AI response
    const mockAIResponse = {
      aiMessage: `You asked: "${userMessage}". Based on your assignment/challenge, here's a suggestion: ...`,
    };

    // Store the chat in the database
    const chat = await db.chatHistory.create({
      data: {
        historyId,
        userMessage,
        aiMessage: mockAIResponse.aiMessage,
      },
    });

    res.status(201).json({ chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to chat with AI" });
  }
};

export const AIController = controller([
  {
    method: "post",
    path: "/generate",
    builder: generateAssignmentOrChallenge,
    middleware: [authMiddleware], // Ensure the user is authenticated
  },
  {
    method: "post",
    path: "/chat",
    builder: chatWithAI,
    middleware: [authMiddleware],
  },
]);