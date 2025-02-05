import { JwtPayload, sign, verify } from "jsonwebtoken";
import AccessToken from "../domain/entity/AccessToken";
import RefreshToken from "../domain/entity/RefreshToken";
import GenerateAccessTokenDto from "./dto/GenerateAccessToken.dto";
import GenerateRefreshTokenDto from "./dto/GenerateRefreshToken.dto";
import { BadRequestException } from "../utils/exceptions";
import nodeJose from "node-jose";

export default class TokenApplication {
  constructor(
    private readonly PRIVATE_KEY: string,
    private readonly PUBLIC_KEY: string,
    public REFRESH_TOKEN_EXPIRATION: string,
    public ACCESS_TOKEN_EXPIRATION: string,
  ) {}

  async generateAccessToken(
    generateAccessTokenDto: GenerateAccessTokenDto,
  ): Promise<string> {
    return sign(generateAccessTokenDto.toObject(), this.PRIVATE_KEY, {
      expiresIn: this.ACCESS_TOKEN_EXPIRATION as unknown as number,
      algorithm: "RS256",
      keyid: (await this.getJwks()).keys[0]!.kid,
    });
  }

  validateAccessToken(accessToken: string): AccessToken {
    try {
      const payload = verify(accessToken, this.PUBLIC_KEY, {
        algorithms: ["RS256"],
      }) as JwtPayload;

      return new AccessToken(Object(payload));
    } catch {
      throw new BadRequestException("Invalid token provided");
    }
  }

  generateRefreshToken(
    generateRefreshTokenDto: GenerateRefreshTokenDto,
  ): string {
    return sign(generateRefreshTokenDto.toObject(), this.PRIVATE_KEY, {
      expiresIn: this.REFRESH_TOKEN_EXPIRATION as unknown as number,
      algorithm: "RS256",
    });
  }

  validateRefreshToken(refreshToken: string): RefreshToken {
    try {
      const payload = verify(refreshToken, this.PUBLIC_KEY, {
        algorithms: ["RS256"],
      }) as JwtPayload;

      return new RefreshToken(Object(payload));
    } catch {
      throw new BadRequestException("Invalid token provided");
    }
  }

  async getJwks(): Promise<{
    keys: {
      kty: string;
      e: string;
      use: string;
      kid: string;
      alg: string;
      n: string;
    }[];
  }> {
    return {
      keys: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await nodeJose.JWK.asKey(this.PUBLIC_KEY, "pem")).toJSON() as any,
      ],
    };
  }
}
