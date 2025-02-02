import { Repository } from "typeorm";
import { PasswordEncoderInterface } from "../interfaces/PasswordEncoder";
import { BadRequestException } from "../utils/exceptions";
import GenerateAccessTokenDto from "./dto/GenerateAccessToken.dto";
import GenerateRefreshTokenDto from "./dto/GenerateRefreshToken.dto";
import TokenApplication from "./Token.application";
import User from "../domain/entity/User";

export default class AuthApplication {
  constructor(
    private readonly tokenApplication: TokenApplication,
    private readonly userRepository: Repository<User>,
    private readonly passwordEncoderApplication: PasswordEncoderInterface,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      select: ["password"],
    });

    if (!user) {
      throw new BadRequestException("invalid credentials");
    }

    const isPasswordValid = await this.passwordEncoderApplication.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException("invalid credentials");
    }

    const refreshToken = this.tokenApplication.generateRefreshToken(
      new GenerateRefreshTokenDto({ userId: user.id }),
    );
    const accessToken = this.tokenApplication.generateAccessToken(
      new GenerateAccessTokenDto({ userId: user.id }),
    );

    return { accessToken, refreshToken };
  }
}
