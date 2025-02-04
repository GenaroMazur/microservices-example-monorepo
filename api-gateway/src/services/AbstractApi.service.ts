import { Axios, AxiosRequestConfig } from "axios";
import { logger } from "../utils/logger";
import Core from "../infrastructure/Core";

type ApiResponseT<T> = {
  ok: boolean;
  code: number;
  message: string;
  body: T extends undefined ? undefined : T;
};

export enum StatusServiceE {
  NOT_INITIALIZED = "NOT_INITIALIZED",
  INITIALIZING = "INITIALIZING",
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
}

//TODO: Si el retryStrategy falla, Se debería dar la opción de enviar por RabbitMQ

/**
 * Clase abstracta que define un servicio de API.
 * @param url URL base de la API.
 *
 * Si cualquier método falla, se reintentará 3 veces (Por defecto).
 */
export default abstract class ApiService {
  private readonly axios: Axios;
  public status: StatusServiceE = StatusServiceE.NOT_INITIALIZED;

  constructor(url: string) {
    this.axios = new Axios({
      baseURL: url,
      transformRequest: (data, headers) => {
        headers["Content-Type"] = "application/json";
        return JSON.stringify(data);
      },
      transformResponse: (data) => {
        try {
          return JSON.parse(data);
        } catch {
          return data;
        }
      },
    });

    this.status = StatusServiceE.INITIALIZING;

    const interval = setInterval(async () => {
      try {
        logger.verbose(`Checking connection to ${url}`);
        await this.checkAlive();
        logger.verbose(`connection to ${url} is alive`);
        if (this.status === StatusServiceE.DISCONNECTED) {
          logger.info(`Reconnected to ${url}`);
        }

        this.status = StatusServiceE.CONNECTED;
      } catch {
        this.status = StatusServiceE.DISCONNECTED;
        logger.error(`Error trying to connect to ${url}`);
      }
    }, 5 * 1000);

    Core.intervals.push(interval);
  }

  private async retryStrategy<T>(
    method: () => T | Promise<T>,
    retries = 3,
    alreadyRetried = false,
  ): Promise<T> {
    try {
      const result = await method();

      if (alreadyRetried) {
        logger.info("Request succeeded after retrying." + retries);
      }

      return result;
    } catch (error) {
      logger.warn(`Retrying request. Retries left: ${retries}`);

      if (retries === 0) {
        throw error;
      }

      let resolve: (value: T) => void;
      let reject: (error: unknown) => void;

      const promise = new Promise<T>((res, rej) => {
        resolve = (value: T) => {
          res(value);
        };
        reject = rej;
      });

      setTimeout(async () => {
        try {
          resolve(await this.retryStrategy(method, retries - 1, true));
        } catch (error) {
          reject(error);
        }
      }, 1000);

      return promise;
    }
  }

  protected async get<T>(
    path: string,
    axiosRequestConfig?: AxiosRequestConfig,
  ): Promise<ApiResponseT<T>> {
    const response = await this.retryStrategy(async () =>
      this.axios.get<ApiResponseT<T>>(path, axiosRequestConfig),
    );

    return response.data;
  }

  protected async post<T>(
    path: string,
    data: unknown,
    axiosRequestConfig?: AxiosRequestConfig,
  ): Promise<ApiResponseT<T>> {
    const response = await this.retryStrategy(() =>
      this.axios.post<ApiResponseT<T>>(path, data, axiosRequestConfig),
    );

    return response.data;
  }

  protected async put<T>(
    path: string,
    data: unknown,
    axiosRequestConfig?: AxiosRequestConfig,
  ): Promise<ApiResponseT<T>> {
    const response = await this.retryStrategy(() =>
      this.axios.put<ApiResponseT<T>>(path, data, axiosRequestConfig),
    );

    return response.data;
  }

  protected async delete<T>(
    path: string,
    axiosRequestConfig?: AxiosRequestConfig,
  ): Promise<ApiResponseT<T>> {
    const response = await this.retryStrategy(() =>
      this.axios.delete<ApiResponseT<T>>(path, axiosRequestConfig),
    );

    return response.data;
  }

  protected async patch<T>(
    path: string,
    data: unknown,
    axiosRequestConfig?: AxiosRequestConfig,
  ): Promise<ApiResponseT<T>> {
    const response = await this.retryStrategy(() =>
      this.axios.patch<ApiResponseT<T>>(path, data, axiosRequestConfig),
    );

    return response.data;
  }

  public checkAlive() {
    return this.get("/");
  }
}
