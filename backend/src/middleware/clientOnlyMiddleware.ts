import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./authMiddleware.ts";

export const clientOnlyMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.role !== "client") {
    return res.status(403).json({
      msg: "Only clients can access this route",
    });
  }

  next();
};

export const freelancersOnlyMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.role !== "freelancer") {
    return res.status(403).json({
      msg: "Only clients can access this route",
    });
  }

  next();
};
