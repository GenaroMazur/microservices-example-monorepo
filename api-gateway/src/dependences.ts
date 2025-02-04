import { Environments } from "./enums/Environments.enum";
import AuthService from "./services/Auth.service";
import { getEnvironments } from "./utils/getEnvironments.utils";

const AUTH_SERVICE_URL = getEnvironments(Environments.AUTH_SERVICE_URL);

export const authService = new AuthService(AUTH_SERVICE_URL);
