import "express";
import AccessToken from "../domain/entity/AccessToken";
import RefreshToken from "../domain/entity/RefreshToken";

declare module "express" {
  export interface Response {
    locals: {
      accessToken?: AccessToken;
      refreshToken?: RefreshToken;
    };
  }
}
