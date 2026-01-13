# AI Tools Hub

A comprehensive AI tools platform consisting of three main components: Backend API, Admin Dashboard, and Web Frontend.

## Project Structure

```
Ai-tools-hub/
├── backend/     # Backend API (Node.js/Express)
├── admin/       # Admin Dashboard (React + Vite)
└── web/         # Public Web Frontend (Next.js)
```

## Components

### Backend (`/backend`)
The backend API service built with Node.js. Handles all data processing, authentication, and API endpoints.

- **Tech Stack**: Node.js, Express, TypeScript
- **Features**: RESTful API, Authentication, Database integration

### Admin Dashboard (`/admin`)
Administrative interface for managing AI tools, users, and content.

- **Tech Stack**: React, Vite, TypeScript, TailwindCSS
- **Features**: Tool management, User management, Content moderation

### Web Frontend (`/web`)
Public-facing website for browsing and discovering AI tools.

- **Tech Stack**: Next.js, React, TypeScript
- **Features**: AI tool directory, Search, Categories, User submissions

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Database (as specified in backend configuration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ma4kos/Ai-tools-hub.git
   cd Ai-tools-hub
   ```

2. **Setup Backend**
   ```bash
   cd backend
   cp .env.sample .env
   npm install
   npm run dev
   ```

3. **Setup Admin Dashboard**
   ```bash
   cd admin
   cp env.example .env
   npm install
   npm run dev
   ```

4. **Setup Web Frontend**
   ```bash
   cd web
   cp env.example .env
   npm install
   npm run dev
   ```

## Environment Variables

Each component has its own environment configuration:
- `backend/.env.sample` - Backend configuration
- `admin/env.example` - Admin dashboard configuration
- `web/env.example` - Web frontend configuration

## License

This project is proprietary. All rights reserved.

## Contributing

Please read the contribution guidelines in each component's directory before submitting pull requests.
