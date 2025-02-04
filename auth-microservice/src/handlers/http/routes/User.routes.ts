import { Router } from "express";
import {
  CreateUserController,
  DeleteUserController,
  GetUserController,
  GetUsersController,
  UpdateUserController,
} from "../controllers/user.controller";

const UserRouter = Router();

UserRouter.route("/").get(GetUsersController).post(CreateUserController);

UserRouter.route("/:id")
  .get(GetUserController)
  .patch(UpdateUserController)
  .delete(DeleteUserController);

export default UserRouter;
