import "reflect-metadata";
import * as dotenv from "dotenv";
import { app } from "./app";
import { AppDataSource } from "./data-source";

dotenv.config();

const PORT = Number(process.env.PORT || 3000);

AppDataSource.initialize()
  .then(() => {
    console.log("📌 Database bağlantısı başarılı!");

    app.listen(PORT, () => {
      console.log(`🚀 API çalışıyor → http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database bağlantı hatası:", err);
  });
