import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());

app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

app.use("/api/auth", authRoutes);

app.use("/api", userRoutes);
