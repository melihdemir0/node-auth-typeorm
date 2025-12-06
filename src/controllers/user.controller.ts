import { Request, Response } from "express";

export const me = (req: Request, res: Response) => {
  return res.json({
    message: "Kullanıcı bilgisi",
    user: req.user,
  });
};
