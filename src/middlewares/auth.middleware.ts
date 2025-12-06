import { Request, Response, NextFunction } from "express";

import * as jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res
      .status(401)
      .json({ message: "Token yok (Authorization header eksik)" });
  }

  const parts = auth.split(" ");
  const token = parts.length === 2 ? parts[1] : null;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Token formatı hatalı (Bearer TOKEN beklenir)" });
  }

  try {
    const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    req.user = { id: payload.id, email: payload.email };

    return next();
  } catch {
    return res
      .status(401)
      .json({ message: "Token geçersiz veya süresi dolmuş" });
  }
};
