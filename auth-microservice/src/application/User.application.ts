import { Repository } from "typeorm";
import User from "../domain/entity/User";
import { PasswordEncoderInterface } from "../interfaces/PasswordEncoder";
import { BadRequestException, NotFoundException } from "../utils/exceptions";
import CreateUserDto from "./dto/CreateUser.dto";

export default class UserApplication {
  constructor(
    private userRepository: Repository<User>,
    private readonly passwordEncoder: PasswordEncoderInterface,
  ) {}

  async createAdminIfNotExists(): Promise<void> {
    const someUser = (await this.userRepository.find())[0];
    if (!someUser) {
      const admin = User.Builder()
        .username("admin")
        .password(await this.passwordEncoder.encode("admin"))
        .build();

      await this.userRepository.save(admin);
    }
  }

  async getUserList(pagination: { page: number; limit: number }) {
    const { page, limit } = pagination;
    const skip = page * limit;
    return this.userRepository.find({ skip, take: limit });
  }

  async getUserDetail(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = User.Builder()
      .username(createUserDto.username)
      .password(await this.passwordEncoder.encode(createUserDto.password))
      .build();

    return this.userRepository.save(user);
  }

  async updateUser(id: number, user: Partial<User>) {
    const userToUpdate = await this.userRepository.findOneBy({ id });
    if (!userToUpdate) {
      throw new NotFoundException("User not found");
    }

    if (user.password) {
      user.password = await this.passwordEncoder.encode(user.password);
    }

    if (user.username && user.username !== userToUpdate.username) {
      const existingUser = await this.userRepository.findOneBy({
        username: user.username,
      });
      if (existingUser && existingUser.id !== id)
        throw new BadRequestException("Username already exists");
      userToUpdate.username = user.username;
    }

    return this.userRepository.save(userToUpdate);
  }

  async deleteUser(id: number) {
    const userToDelete = await this.userRepository.softDelete({ id });
    if (!userToDelete) {
      throw new NotFoundException("User not found");
    }

    return userToDelete;
  }
}
