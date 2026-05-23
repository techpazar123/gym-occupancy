# Spor Salonu Doluluk Takip Sistemi

Kart/turnike sisteminden gelen giriş-çıkış verilerine göre anlık salon doluluk oranını gösteren web uygulaması.

## Özellikler

- Anlık doluluk oranı (yüzde + görsel)
- Durum göstergesi: Sakin / Orta / Yoğun
- Giriş/çıkış kayıt listesi
- Giriş & çıkış simülasyon butonları
- Maksimum kapasite yönetimi

## Gereksinimler

- Node.js 18+
- npm
- PostgreSQL (lokal geliştirme için)

## Lokal Geliştirme

### 1. PostgreSQL veritabanı oluştur

```sql
CREATE DATABASE gym_occupancy;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# .env içindeki DATABASE_URL, JWT_SECRET vb. değerleri doldur
npm install
npm run dev
```

Backend `http://localhost:3001` adresinde çalışır.  
Tablolar ilk çalıştırmada otomatik oluşturulur.

### 3. Frontend

Yeni bir terminal açın:

```bash
cd frontend
cp .env.example .env
# VITE_API_URL boş bırak (Vite proxy localhost:3001'e yönlendirir)
npm install
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışır.

---

## Production Deploy

### Mimari

```
Vercel (Frontend)  →  Railway/Render (Backend)  →  PostgreSQL
```

---

### A. PostgreSQL — Railway veya Supabase

**Railway ile:**
1. [railway.app](https://railway.app) → New Project → Add PostgreSQL
2. Variables sekmesinden `DATABASE_URL` değerini kopyala

**Supabase ile (ücretsiz):**
1. [supabase.com](https://supabase.com) → New Project
2. Settings → Database → Connection string → **Transaction mode** URL'sini kopyala

---

### B. Backend — Railway

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
2. Root Directory: `backend` olarak ayarla
3. Variables sekmesine şunları ekle:

```
DATABASE_URL=<PostgreSQL URL>
JWT_SECRET=<güçlü rastgele anahtar>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<güçlü şifre>
FRONTEND_URL=https://<vercel-projen>.vercel.app
NODE_ENV=production
```

4. Deploy tamamlandığında URL'yi not et: `https://xxx.railway.app`

**Render ile (alternatif):**
1. [render.com](https://render.com) → New Web Service → GitHub repo bağla
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment Variables'a yukarıdakileri ekle

---

### C. Frontend — Vercel

1. [vercel.com](https://vercel.com) → New Project → GitHub repo bağla
2. Root Directory: `frontend` olarak ayarla
3. Framework Preset: **Vite**
4. Environment Variables'a ekle:

```
VITE_API_URL=https://<railway-veya-render-url>
```

5. Deploy et — URL'yi backend'deki `FRONTEND_URL`'ye ekle ve backend'i yeniden deploy et

---

### Deployment Sırası (ilk kez)

1. PostgreSQL oluştur → `DATABASE_URL` al
2. Backend'i deploy et → backend URL'yi al
3. Frontend'i deploy et (`VITE_API_URL` = backend URL) → frontend URL'yi al
4. Backend'e `FRONTEND_URL` = frontend URL ekle → backend'i redeploy et

---

### Çevre Değişkenleri Özeti

| Değişken | Nerede | Açıklama |
|---|---|---|
| `DATABASE_URL` | Backend | PostgreSQL bağlantı URL'si |
| `JWT_SECRET` | Backend | Token imzalama anahtarı |
| `ADMIN_USERNAME` | Backend | Admin kullanıcı adı |
| `ADMIN_PASSWORD` | Backend | Admin şifresi |
| `FRONTEND_URL` | Backend | CORS için frontend URL |
| `PORT` | Backend | Otomatik (Railway/Render ayarlar) |
| `NODE_ENV` | Backend | `production` olarak ayarla |
| `VITE_API_URL` | Frontend | Backend'in tam URL'si |

## API Referansı

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/occupancy` | Anlık doluluk verisi |
| POST | `/api/access` | Giriş/çıkış kaydı |
| GET | `/api/logs` | Son 50 hareket |
| POST | `/api/settings/capacity` | Kapasite güncelle |

### POST /api/access — Örnek İstek

```json
{
  "cardId": "KART-1234",
  "type": "entry",
  "timestamp": "2026-05-21T10:30:00.000Z"
}
```

### GET /api/occupancy — Örnek Yanıt

```json
{
  "currentCount": 42,
  "maxCapacity": 100,
  "occupancyRate": 42,
  "status": "Orta"
}
```

## Kullanıcı Rolleri

### Üye Ekranı — `/`
- Giriş gerektirmez
- Sadece anlık doluluk oranı, kişi sayısı, kapasite ve yoğunluk durumu görünür
- Log veya kapasite ayarı yoktur

### Yönetici Paneli — `/admin`
- `/admin/login` adresinden giriş yapılır
- **Kullanıcı adı:** `admin`
- **Şifre:** `admin123`
- Giriş sonrası görünür: anlık doluluk, giriş/çıkış logları, kapasite ayarı, simülasyon butonları
- Oturum 8 saat geçerlidir — tarayıcı kapatılsa bile localStorage'da saklanır
- "Çıkış Yap" butonu oturumu sonlandırır

### API Güvenliği
| Endpoint | Kimlik |
|---|---|
| `GET /api/occupancy` | Herkese açık |
| `POST /api/access` | Herkese açık (kart sistemi için) |
| `POST /api/auth/login` | Herkese açık |
| `GET /api/logs` | Admin token gerekli |
| `POST /api/settings/capacity` | Admin token gerekli |

Token `Authorization: Bearer <token>` header'ı ile gönderilir.

## Durum Eşikleri

| Aralık | Durum | Renk |
|--------|-------|------|
| %0–40 | Sakin | Yeşil |
| %41–75 | Orta | Sarı |
| %76–100 | Yoğun | Kırmızı |

## Telefona Nasıl Kurulur (Add to Home Screen)

Uygulama PWA (Progressive Web App) desteklidir — uygulama mağazası gerekmez, doğrudan tarayıcıdan ana ekrana eklenebilir.

### Android (Chrome)

1. Uygulamayı Chrome'da aç (`http://localhost:5173` veya sunucu adresin)
2. Sağ üstteki **⋮** (üç nokta) menüsüne dokun
3. **"Ana ekrana ekle"** seçeneğini seç
4. Açılan diyalogda **"Ekle"** butonuna bas
5. Uygulama ana ekrana ikon olarak eklenir ve tam ekran açılır

### iOS (Safari)

1. Uygulamayı Safari'de aç
2. Alt çubuktaki **Paylaş** ikonuna (kare içinde yukarı ok) dokun
3. Aşağı kaydırarak **"Ana Ekrana Ekle"** seçeneğini bul ve seç
4. İsmi değiştirebilirsin — ardından **"Ekle"** butonuna bas
5. Uygulama ana ekranda görünür

### Masaüstü (Chrome / Edge)

1. Uygulamayı aç
2. Adres çubuğunun sağındaki **⊕ Yükle** ikonuna tıkla
3. **"Yükle"** butonuna bas — uygulama masaüstü uygulaması gibi açılır

> **Not:** PWA özelliği sadece production build'de (`npm run build`) tam çalışır.
> Geliştirme sunucusunda (`npm run dev`) service worker devre dışıdır.

## Gerçek Kart Sistemi Entegrasyonu

Simülasyon butonları yerine, kart okuyucu/turnike sistemi doğrudan `POST /api/access` endpoint'ine istek atabilir.
App.jsx içindeki `SimulatePanel` bileşeni kaldırılabilir.
