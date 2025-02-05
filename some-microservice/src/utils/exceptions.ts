export class AppError extends Error {
  override name: string;

  httpCode: number;
  isOperational: boolean;

  constructor(
    name: string,
    httpCode: number,
    isOperational: boolean,
    description?: string,
  ) {
    super(description);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this);
  }
}

// Error 400
export class BadRequestException extends AppError {
  constructor(message?: string) {
    super("Bad Request", 400, true, message);
  }
}

//Error 401
export class UnauthorizedException extends AppError {
  constructor(message?: string) {
    super("Unauthorized", 401, true, message);
  }
}

//Error 403
export class ForbiddenException extends AppError {
  constructor(message?: string) {
    super("Forbidden", 403, true, message);
  }
}

// Error 404
export class NotFoundException extends AppError {
  constructor(message?: string) {
    super("Not Found", 404, true, message);
  }
}

//Error 405
export class MethodNotAllowedException extends AppError {
  constructor(message?: string) {
    super("Method Not Allowed", 401, true, message);
  }
}

// Error 500
export class ServerError extends AppError {
  constructor(isOperational: boolean, message?: string) {
    super("Server Error", 500, isOperational, message);
  }
}

export class BadGatewayException extends AppError {
  constructor(message?: string) {
    super("Bad Gateway", 502, true, message);
  }
}
