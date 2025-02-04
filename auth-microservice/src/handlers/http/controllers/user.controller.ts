import { BadRequestException } from "./../../../utils/exceptions";
import { userApplication } from "./../../../dependences";
import { controllerBuilder } from "./../../../utils/catchAsync";
import CreateUserDto from "./../../../application/dto/CreateUser.dto";
import UpdateUserDto from "./../../../application/dto/UpdateUser.dto";

export const GetUsersController = controllerBuilder(async (req) => {
  const { page = "0", limit = "10" } = req.query as {
    page: string;
    limit: string;
  };

  return userApplication.getUserList({
    page: parseInt(page),
    limit: parseInt(limit),
  });
});

export const GetUserController = controllerBuilder(async (req) => {
  const { id } = req.params;
  if (!id) throw new BadRequestException("Id is required");

  return userApplication.getUserDetail(Number(id));
});

export const CreateUserController = controllerBuilder(async (req) => {
  return userApplication.createUser(CreateUserDto.create(req.body));
});

export const UpdateUserController = controllerBuilder(async (req) => {
  const { id } = req.params;
  if (!id) throw new BadRequestException("Id is required");

  return userApplication.updateUser(Number(id), UpdateUserDto.create(req.body));
});

export const DeleteUserController = controllerBuilder(async (req) => {
  const { id } = req.params;
  if (!id) throw new BadRequestException("Id is required");

  return userApplication.deleteUser(Number(id));
});
