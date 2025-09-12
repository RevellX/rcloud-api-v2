import { NextFunction, Request, Response } from "express";
import User from "../models/User";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, password } = req.body;
      if (!id || !password) {
        res.status(400).json("Id and password are required");
        return;
      }

      const user = await User.findByPk(id);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json("Invalid credentials");
        return;
      }

      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        next(new Error("SECRET_JWT is undefined"));
        return;
      }

      const token = jwt.sign(
        {
          id: user!.id,
          permissions: user!.permissions,
        },
        secretKey,
        {
          expiresIn: process.env.TOKEN_EXPIRE || "1d",
        }
      );
      res.json({ token: token });
    } catch (err) {
      next(err);
      return;
    }
  },

  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        next(new Error("SECRET_JWT is undefined"));
        return;
      }

      if (!jwt.verify(token, secretKey)) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }
      // What if provided token is valid, but containts something weird?
      const { id } = jwt.decode(token) as { id: string };

      const user = await User.findByPk(id);
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const payload = {
        id: user.id,
        permissions: user.permissions,
      };

      const newToken = jwt.sign(payload, secretKey, {
        expiresIn: process.env.TOKEN_EXPIRE || "1d",
      });
      res.json({ token: newToken });
    } catch (err) {
      next(err);
      return;
    }
  },
};
