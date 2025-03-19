import { HistoryType, MaterialType } from '@prisma/client';
import { Repository } from './repository';


export class ProjectsRepository extends Repository {
  async createProject(userId: number, title: string) {
    return this.db.project.create({
      data: {
        userId,
        title,
        description: '', 
      },
    });
  }

  async findProjectById(projectId: number) {
    return this.db.project.findUnique({
      where: { id: projectId },
      include: {
        materials: true,
        history: true,
      },
    });
  }

  async findProjectsByUser(userId: number) {
    return this.db.project.findMany({
      where: { userId },
      include: {
        materials: true,
        history: true,
      },
    });
  }

  async addMaterialToProject(projectId: number, type: MaterialType, content: string) {
    return this.db.material.create({
      data: {
        projectId,
        type,
        content,
      },
    });
  }

  async addHistoryToProject(
    projectId: number,
    type: HistoryType,
    instructions: string,
    starterCode?: string,
    expectedOutput?: string
  ) {
    return this.db.history.create({
      data: {
        projectId,
        type,
        instructions,
        starterCode,
        expectedOutput,
      },
    });
  }

  async getProjectHistory(projectId: number) {
    return this.db.history.findMany({
      where: { projectId },
    });
  }
}