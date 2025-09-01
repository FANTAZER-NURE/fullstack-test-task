import type { ErrorRequestHandler } from "express";
import { AppError, createInternalServerError } from "../errors/appError";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const error = err instanceof AppError ? err : createInternalServerError();
  if (!(err instanceof AppError)) {
     
    console.error(err);
  }
  res.status(error.status).json({
    success: error.success,
    message: error.message,
    code: error.code,
    path: error.path,
    value: error.value
  });
};
