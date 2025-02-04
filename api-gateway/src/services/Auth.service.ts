import ApiService from "./AbstractApi.service";
import CreateUserDto from "./dto/CreateUser.dto";
import UpdateUserDto from "./dto/UpdateUser.dto";

export default class AuthService extends ApiService {
  async login(username: string, password: string) {
    return await this.post<{ accessToken: string; refreshToken: string }>(
      "/auth/login",
      { username, password },
    );
  }

  async refreshToken(refreshToken: string) {
    return await this.post(
      "/auth/refresh-token",
      {},
      { headers: { "x-refresh-token": refreshToken } },
    );
  }

  async getUsers(
    accessToken: string,
    pagination: { page: number; limit: number },
  ) {
    return await this.get("/users", {
      params: pagination,
      headers: { "x-access-token": accessToken },
    });
  }

  async getUserById(accessToken: string, userId: number) {
    return await this.get(`/users/${userId}`, {
      headers: { "x-access-token": accessToken },
    });
  }

  async createUser(accessToken: string, user: CreateUserDto) {
    return await this.post("/users", user.toPrimitive(), {
      headers: { "x-access-token": accessToken },
    });
  }

  async updateUser(accessToken: string, userId: number, user: UpdateUserDto) {
    return await this.put(`/users/${userId}`, user.toPrimitive(), {
      headers: { "x-access-token": accessToken },
    });
  }

  async deleteUser(accessToken: string, userId: number) {
    return await this.delete(`/users/${userId}`, {
      headers: { "x-access-token": accessToken },
    });
  }
}
