import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { UsersController } from "../controllers/api/users_controller"
import { PistonController } from "../controllers/piston_controller";

export const apiRouter = (db: PrismaClient) => {
  const router = Router({mergeParams: true})
  
  router.use("/users", UsersController(db));
  router.use("/piston", PistonController(db));

  return router;
}
