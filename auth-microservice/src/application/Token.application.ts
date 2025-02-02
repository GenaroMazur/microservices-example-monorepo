import { JwtPayload, sign, verify } from "jsonwebtoken";
import AccessToken from "../domain/entity/AccessToken";
import RefreshToken from "../domain/entity/RefreshToken";
import GenerateAccessTokenDto from "./dto/GenerateAccessToken.dto";
import GenerateRefreshTokenDto from "./dto/GenerateRefreshToken.dto";

export default class TokenApplication {
  constructor(
    private readonly PRIVATE_KEY: string,
    private readonly PUBLIC_KEY: string,
    public REFRESH_TOKEN_EXPIRATION: string,
    public ACCESS_TOKEN_EXPIRATION: string,
  ) {}

  generateAccessToken(generateAccessTokenDto: GenerateAccessTokenDto): string {
    return sign(generateAccessTokenDto.toObject(), this.PRIVATE_KEY, {
      expiresIn: this.ACCESS_TOKEN_EXPIRATION as unknown as number,
      algorithm: "RS256",
    });
  }

  validateAccessToken(accessToken: string): AccessToken {
    const payload = verify(accessToken, this.PUBLIC_KEY, {
      algorithms: ["RS256"],
    }) as JwtPayload;

    return new AccessToken(Object(payload));
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
    verify(refreshToken, this.PUBLIC_KEY, {
      algorithms: ["RS256"],
    }) as JwtPayload;

    return new RefreshToken();
  }

  getJwks(): {
    keys: {
      kty: string;
      e: string;
      use: string;
      kid: string;
      alg: string;
      n: string;
    }[];
  } {
    return {
      keys: [
        {
          kty: "RSA",
          e: "AQAB",
          use: "sig",
          kid: "1",
          alg: "RS256",
          n: this.PUBLIC_KEY,
        },
      ],
    };
  }
}
