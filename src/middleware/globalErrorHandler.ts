import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client";










function errorHandler (err:any, req:Request, res:Response, next:NextFunction) {
  if (res.headersSent) {
    return next(err)
  }
  let statusCode = 500;
  let errorMessage = err.message;
  //prisma client validation error
  if(err instanceof Prisma.PrismaClientValidationError){
    statusCode = 400;
    errorMessage = "You provide Missing field or incorrect field type"
  }
  res.status(statusCode)
  res.json({
    success:false,
    message: errorMessage,
    details: err
  })
}


export default errorHandler