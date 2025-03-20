import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { UsersController } from "../controllers/api/users_controller"
import { PistonController } from "../controllers/api/piston_controller";
import { ProjectsController } from "../controllers/api/projects_controller";
import { AIController } from "../controllers/api/ai_controller";


export const apiRouter = (db: PrismaClient) => {
  const router = Router({mergeParams: true})
  
  router.use("/users", UsersController(db));
  router.use("/piston", PistonController(db));
  router.use("/projects", ProjectsController(db));
  router.use("/ai", AIController(db));

  return router;
}
