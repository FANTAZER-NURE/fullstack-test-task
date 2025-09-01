export class AppError extends Error {
  status: number;
  isOperational: boolean;
  success: boolean;
  path?: string;
  value?: unknown;
  code?: string;
  errorMessage?: string;

  constructor(
    message: string,
    status: number = 500,
    isOperational: boolean = true,
    success: boolean = false
  ) {
    super(message);
    this.status = status;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    this.success = success;
    this.message = message;
    this.errorMessage = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const createBadRequestError = (
  message: string,
  value?: unknown,
  success?: boolean
): AppError => {
  const error = new AppError(message, 400, true, success ?? false);
  if (value !== undefined) error.value = value;
  return error;
};

export const createUnauthorizedError = (
  message: string = "Unauthorized"
): AppError => {
  return new AppError(message, 401);
};

export const createForbiddenError = (
  message: string = "Forbidden"
): AppError => {
  return new AppError(message, 403);
};

export const createNotFoundError = (
  message: string,
  path?: string
): AppError => {
  const error = new AppError(message, 404);
  if (path) error.path = path;
  return error;
};

export const createConflictError = (message: string, value?: unknown): AppError => {
  const error = new AppError(message, 409);
  if (value !== undefined) error.value = value;
  return error;
};

export const createInternalServerError = (
  message: string = "Internal Server Error"
): AppError => {
  return new AppError(message, 500, false);
};

export const createBadGatewayError = (
  message: string = "Bad Gateway"
): AppError => {
  return new AppError(message, 502);
};
