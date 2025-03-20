import { EndpointBuilder, controller } from "../controller";
import { $Enums, PrismaClient } from "@prisma/client";
import { authMiddleware } from "../../middleware/auth_middleware";
import { fetchAIAssnResponse, fetchAIChatResponse } from "./ai_prompts";
import { YoutubeTranscript } from "youtube-transcript";

export const generateAssignmentOrChallenge: EndpointBuilder = (db) => async (req, res) => {
  console.log("generate called");
  console.log(req.body)
  
  let { projectId, type,inputType, inputValue } = req.body;
  projectId = parseInt(projectId);

  if (!projectId || !type || !inputType) {
    return res.status(400).json({ error: "Project ID and type are required" });
  }

  if(inputType == "youtube"){
    try{
      const transcript = await YoutubeTranscript.fetchTranscript(inputValue, { lang: 'en'});
      inputValue = transcript.map(entry => entry.text).join(' '); // copilot told me how to get the text
      console.log("yt link text:", inputType)
    } catch(erro){
      console.log("Unable to get Youtube video!");
    }
  }

  try {
    // Call the OpenAI API via the fetchAIResponse function
    const aiResponse = await fetchAIAssnResponse(type, inputValue);

    if (!aiResponse) {
      return res.status(500).json({ error: "Failed to generate response from AI" });
    }

    // Store the response in the database
    const history = await db.history.create({
      data: {
        projectId,
        type: aiResponse.type as $Enums.HistoryType,
        instructions: aiResponse.instructions || "",
        starterCode: aiResponse.starterCode || null,
        expectedOutput: aiResponse.expectedOutput || null,
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

    // Fetch the chat history for the given historyId
    const chatHistory = await db.chatHistory.findMany({
      where: { historyId },
      orderBy: { createdAt: "asc" }, // Optional: Order by creation time
    });

    // Call fetchAIChatResponse with the messages array
    const ai_response = await fetchAIChatResponse(chatHistory, history.instructions, history.starterCode, userMessage);
    if (!ai_response) {
      return res.status(500).json({ error: "Failed to get AI response" });
    }
    // Store the new chat in the database
    const chat = await db.chatHistory.create({
      data: {
        historyId,
        userMessage,
        aiMessage: ai_response,
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