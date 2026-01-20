import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }
  let statusCode = 500;
  let errorMessage = err.message;
  //prisma client validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provide Missing field or incorrect field type";
  }
  // prisma client know request error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage =
        "An operation failed because it depends on one or more records that were required but not found.";
    }
    if (err.code === "P2002") {
      errorMessage = "Unique constraint failed on the {constraint}";
    }
    if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed on the field: {field_name}";
    }
  }

  // prisma initialization error

  if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "Authentication failed. please check your credentials";
    }
    if (err.errorCode === "P1001") {
      statusCode = 400;
      errorMessage = "can't reach database server";
    }
  }

  //

  // prisma unknown error
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error occurred during query execution";
  }
  res.status(statusCode);
  res.json({
    success: false,
    message: errorMessage,
    details: err,
  });
}

export default errorHandler;
