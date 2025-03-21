import { EndpointBuilder, controller } from "../controller";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../../middleware/auth_middleware";
import { ProjectsRepository } from "../../lib/repositories/projects_repository";

export const createProject: EndpointBuilder = (db) => async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const projectsRepository = new ProjectsRepository(db);

  try {
    const project = await projectsRepository.createProject(userId, title);
    res.status(201).json({ project });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to create project" });
  }
};

export const addMaterial: EndpointBuilder = (db) => async (req, res) => {
  const { projectId, type, content } = req.body;

  try {
    const material = await db.material.create({
      data: {
        type,
        content,
        projectId,
      },
    });
    res.status(201).json({ material });
  } catch (error) {
    res.status(400).json({ error: "Failed to add material" });
  }
};

export const generateHistory: EndpointBuilder = (db) => async (req, res) => {
  const { projectId, type, instructions, starterCode, expectedOutput } = req.body;

  try {
    const history = await db.history.create({
      data: {
        type,
        instructions,
        starterCode,
        expectedOutput,
        projectId,
      },
    });
    res.status(201).json({ history });
  } catch (error) {
    res.status(400).json({ error: "Failed to generate history" });
  }
};

export const getProjectHistory: EndpointBuilder = (db) => async (req, res) => {
  const { projectId } = req.params;

  try {
    const history = await db.history.findMany({
      where: { projectId: parseInt(projectId) },
    });
    res.status(200).json({ history });
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch project history" });
  }
};

export const getProject: EndpointBuilder = (db) => async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await db.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch project" });
  }
};

export const getAllProjects: EndpointBuilder = (db) => async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const projects = await db.project.findMany({
      where: { userId },
    });
    res.status(200).json({ projects });
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch projects" });
  }
};

export const getChatHistory: EndpointBuilder = (db) => async (req, res) => {
  const { historyId } = req.params;

  try {
    const chatHistory = await db.chatHistory.findMany({
      where: { historyId: parseInt(historyId) },
      orderBy: { createdAt: "asc" }, // Optional: Order by creation time
    });

    if (!chatHistory.length) {
      return res.status(404).json({ error: "No chat history found for the given history ID" });
    }

    res.status(200).json({ chatHistory });
    console.log(chatHistory);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch chat history" });
  }
};

export const ProjectsController = controller([
  {
    method: "post",
    path: "/",
    builder: createProject,
    middleware: [authMiddleware], // Ensure the user is authenticated
  },
  {
    method: "post",
    path: "/:projectId/materials",
    builder: addMaterial,
    middleware: [authMiddleware],
  },
  {
    method: "post",
    path: "/:projectId/history",
    builder: generateHistory,
    middleware: [authMiddleware],
  },
  {
    method: "get",
    path: "/:projectId/history",
    builder: getProjectHistory,
    middleware: [authMiddleware],
  },
  {
    method: "get",
    path: "/:projectId",
    builder: getProject,
    middleware: [authMiddleware],
  },
  {
    method: "get",
    path: "/",
    builder: getAllProjects,
    middleware: [authMiddleware],
  },
  {
    method: "get",
    path: "/:historyId/chat-history",
    builder: getChatHistory,
    middleware: [authMiddleware],
  },
]);