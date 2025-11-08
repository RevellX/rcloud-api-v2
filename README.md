# 🌐 REST API with TypeScript

This is a simple and modular RESTful API built with **TypeScript** and **Express.js** . It improved version of my other project, but offers only fraction of its functionality. For sake of simplicity, data is stored in json files.

---

## 📌 Features

- RESTful API using Express.js
- JSON request and response handling
- Structured routing and middleware
- Basic error handling and validation
- Modular and easy to extend

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- dotenv for environment variables
- nodemon for development

---

## 🚀 Getting Started

### 📥 Clone the Repository

```bash
git clone https://github.com/RevellX/r-cloud-api-v2.git
```

### 🛠 Install Dependencies

```bash
npm install
```

### 🔐 Set Up Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
JWT_SECRET="your_jwt_secret_here"
TOKEN_EXPIRE="7d"
```

### ▶️ Run the Server

```bash
node src/app.ts
```

### API Endpoints

Authentication

```http
POST    /v1/auth/login             # Authenticate by providing credentials
POST    /v1/auth/refresh           # Get refreshed access token
```

Duties managment for work

```http
GET    /v1/duties              # Get available duties
POST   /v1/duties              # Create new duty
PUT    /v1/duties/{id}         # Update existing duty by id
DELETE /v1/duties/{id}         # Delete existing duty by id

GET    /v1/dutyTypes           # Get assignable tasks
GET    /v1/dutyTypes/{id}      # Get assignable task by id
POST   /v1/dutyTypes           # Create new task
PUT    /v1/dutyTypes/{id}      # Update existing task by id
DELETE /v1/dutyTypes/{id}      # Delete existing task by id

GET    /v1/dutyWorkes           # Get duty worker
GET    /v1/dutyWorkes/{id}      # Get duty worker by id
POST   /v1/dutyWorkes           # Create new duty worker
PUT    /v1/dutyWorkes/{id}      # Update existing duty worker by id
DELETE /v1/dutyWorkes/{id}      # Delete existing duty worker by id
```
