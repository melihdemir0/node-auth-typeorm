# Node.js Authentication API (Express + TypeORM + JWT)

Bu proje; **Node.js, Express, TypeORM ve PostgreSQL** kullanılarak geliştirilmiş, JWT tabanlı kimlik doğrulama (Authentication) API örneğidir.  
Proje yapısı sade tutulmuştur — işlemler doğrudan `controller` → `repository` akışıyla yapılır.

Modern backend geliştirmeyi göstermek için ideal, temiz bir örnek projedir.

---

##  Özellikler

-  Kullanıcı kaydı (Register)
-  Login (Access + Refresh Token üretir)
-  BCrypt ile şifre hashleme
-  JWT Access Token (kısa ömür)
-  JWT Refresh Token (uzun ömür)
-  Token yenileme (refresh endpoint)
-  Logout (refresh token sıfırlama)
-  TypeORM ile PostgreSQL bağlantısı
-  Middleware ile korunan route (auth middleware)

