# 🌱 FellahConnect API

> AI-powered Smart Agriculture Platform for Moroccan Farmers 🇲🇦

![Banner](./assets/banner.png)

## 📖 About

FellahConnect API is a RESTful backend application designed to help Moroccan farmers manage their farms, harvests, market prices, and sales.

The platform integrates an AI conversational assistant capable of answering questions and performing actions using Function Calling with Google Gemini or DeepSeek.

Example:

> "I have 300 kg of tomatoes ready. Where should I sell them for the best price?"

The AI assistant compares market prices, recommends the best market, and can create a sale offer after user confirmation.

---

## 🚀 Features

- 👨‍🌾 Farmer Management
- 🌾 Farm & Parcel Management
- 🍅 Product Management
- 📦 Harvest Tracking
- 💰 Market Price Monitoring
- 🛒 Sale Offers
- 🔐 JWT Authentication
- 🛡️ Role-Based Access Control (RBAC)
- 🤖 AI Agent with Function Calling
- 📊 Optimized PostgreSQL Database

---

## 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Sequelize |
| Authentication | JWT + bcrypt |
| AI | Google Gemini / DeepSeek |
| Testing | Postman |

---

## 📂 Project Structure

```text
src/
│
├── config/
├── controllers/
├── middlewares/
├── migrations/
├── models/
├── routes/
├── seeders/
├── services/
├── tools/
├── validators/
├── ai/
└── app.js
```

---

## ⚙️ Installation

```bash
git clone git@github.com:Ouhfi/fellahconnect-api.git

cd fellahconnect-api

npm install
```

---

## 🔧 Environment Variables

Create a `.env` file.

Example:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=fellahconnect
DB_USER=postgres
DB_PASSWORD=password

JWT_SECRET=your_secret

GEMINI_API_KEY=your_api_key
```

---

## 🗄 Database

Run migrations

```bash
npx sequelize-cli db:migrate
```

Run seeders

```bash
npx sequelize-cli db:seed:all
```

---

## ▶️ Run Project

```bash
npm run dev
```

---

## 🔐 Authentication

### Register

```
POST /auth/register
```

### Login

```
POST /auth/login
```

Returns

```
JWT Token
```

---

## 📌 Main Endpoints

### Farmers

```
GET /agriculteurs
POST /agriculteurs
PUT /agriculteurs/:id
DELETE /agriculteurs/:id
```

### Parcels

```
GET /parcelles
POST /parcelles
```

### Products

```
GET /produits
POST /produits
```

### Harvests

```
GET /recoltes
POST /recoltes
PUT /recoltes/:id
DELETE /recoltes/:id
```

### Market Prices

```
GET /prix-marche
POST /prix-marche
```

### Sale Offers

```
GET /offres
POST /offres
```

---

## 🤖 AI Agent

The AI assistant can:

- Compare market prices
- Find the best market
- Create harvests
- Create sale offers
- Answer questions in natural language
- Respect RBAC permissions
- Ask confirmation before write operations

---

## 📬 Example Conversation

```
👨‍🌾 Farmer:

I have 300 kg of tomatoes.

🤖 AI:

The best market today is Casablanca at 7 DH/kg.

Would you like me to create a sale offer?

👨‍🌾 Farmer:

Yes.

🤖 AI:

Done! Your sale offer has been successfully created.
```

---

## 👥 Team

| Name | Role |
|------|------|
| Member 1 | Tech Lead |
| Member 2 | Backend Developer |
| Member 3 | Database Engineer |
| Member 4 | Security & AI |

---

## 📄 License

This project was developed as part of a school project in collaboration with **FellahConnect**.
