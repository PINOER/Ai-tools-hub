# AI Tool Hub Backend

This is the API backend for the admin and user sites of AI Tools Hub.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL database

## 🛠️ Dev Setup

1. Clone the repository:

```bash
git clone https://github.com/prixite/ai-tool-hub-backend.git
cd ai-tool-hub-backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.sample .env
```

Edit the `.env` file with your configuration values.

4. Run docker services:

```bash
docker-compose up -d redis postgres
```

5. Generate Prisma client:

```bash
npm run postinstall
```

6. Run the migrations

```bash
npm run migrate-dev
```

7. Run the seed command

```bash
npm run seed
```

8. Run the seed command

```bash
npm run dev
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

### Using Docker

```bash
docker-compose up -d
```

## 📚 API Documentation

API documentation is available at `/docs` endpoint when the server is running.

## 📁 Project Structure

```
src/
├── config/        # Configuration files
├── controllers/   # Route controllers
├── docs/          # API documentation
├── middleware/    # Custom middleware
├── prisma/        # Database schema and migrations
├── routes/        # API routes
├── services/      # Business logic
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── validators/    # Request validation schemas
```

## 🔐 Security Features

- Helmet for security headers
- Rate limiting to prevent abuse
- CORS configuration
- JWT authentication
- Input validation
- Error handling middleware
