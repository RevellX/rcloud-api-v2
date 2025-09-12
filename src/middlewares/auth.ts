import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { hasPermission, Permission } from "../utils/permissions";
import { User } from "../models/User";

export const hello = (req: Request, res: Response) => {
  res.json({ message: "Hello, world!" });
};

export const ping = (req: Request, res: Response) => {
  res.json({ message: "Pong!" });
};

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      next(new Error("JWT_SECRET is not defined"));
      return;
    }

    let id;
    try {
      id = (jwt.verify(token, secretKey) as { id: string }).id;
    } catch (err) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findByPk(id);
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    res.locals.user = user;
    next();
  } catch (err) {
    next(err);
    return;
  }
};

export const requirePermission =
  (required: Permission) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;
      if (!user) {
        throw new Error("User was not authorized");
      }

      if (hasPermission(user, required)) {
        next();
      } else {
        res.status(403).json({ message: "Insufficient permissions" });
        return;
      }
    } catch (err) {
      next(err);
      return;
    }
  };
