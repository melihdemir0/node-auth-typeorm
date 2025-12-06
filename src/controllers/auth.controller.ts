import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { RefreshToken } from "../entities/RefreshToken";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRepo = AppDataSource.getRepository(User);
const refreshRepo = AppDataSource.getRepository(RefreshToken);

function generateAccessToken(user: User) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET!, // gizli anahtar
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN } // ör: 15m
  );
}

function generateRefreshToken(user: User) {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Eksik alan var" });
    }

    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email zaten kayıtlı" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = userRepo.create({
      name,
      email,
      password: hashed,
    });

    await userRepo.save(user);

    return res.json({ message: "Kayıt başarılı", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Email veya şifre yanlış" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Email veya şifre yanlış" });
    }

    const accessToken = generateAccessToken(user);

    const refreshTokenValue = generateRefreshToken(user);

    const refreshToken = refreshRepo.create({
      token: refreshTokenValue,
      userId: user.id,
    });

    await refreshRepo.save(refreshToken);

    return res.json({
      message: "Giriş başarılı",
      accessToken,
      refreshToken: refreshTokenValue,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token eksik" });
    }

    const stored = await refreshRepo.findOne({ where: { token } });

    if (!stored || stored.revoked) {
      return res.status(401).json({ message: "Geçersiz refresh token" });
    }

    const payload: any = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);

    const user = await userRepo.findOne({ where: { id: payload.id } });

    if (!user) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı" });
    }

    const newAccessToken = generateAccessToken(user);

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Refresh işlemi başarısız" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token eksik" });
    }

    await refreshRepo.update({ token }, { revoked: true });

    return res.json({ message: "Çıkış başarılı" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};
