# Project Summary: new-blog-app

This is a **backend blog application** built with **Express.js** and **TypeScript**. It serves as an API for a blogging platform.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Better Auth
- **Email:** Nodemailer

## 📂 Project Structure

### Root Directory
- **`src/`**: Source code.
- **`prisma/`**: Database schema and migrations.
- **`generated/`**: Likely generated Prisma client or images.

### Source Code (`src/`)
- **`server.ts`**: The application entry point. It connects to the PostgreSQL database via Prisma and starts the server on port 3000 (default).
- **`app.ts`**: The main Express application setup.
    - Configures **CORS**.
    - Sets up **Better Auth** middleware at `/api/auth/*`.
    - Mounts the `postRouter` at `/posts`.
- **`modules/`**: Contains feature-specific logic.
    - **`post/`**: Handles features related to blog posts.
- **`lib/`**: Shared libraries/utilities.
    - **`prisma.ts`**: Prisma client instance.
    - **`auth.ts`**: Better Auth configuration.

## 🗄️ Database Schema (Prisma)

### Main Models
- **`Post`**: Represents a blog post.
    - Fields: `title`, `content`, `thumbnail`, `isFeatured`, `status` (DRAFT, PUBLISHED, ARCHIVED), `tags`, `views`.
    - Relations: Belongs to an `authorId`, has many `Comment`s.
- **`Comment`**: Comments on posts.
    - Support for nested replies (parent/child comments).
- **`User`**: System users.
    - Standard fields (`name`, `email`, `image`, `role`, `phone`).
    - Linked to Better Auth tables (`Session`, `Account`, `Verification`).

## 🔐 Authentication
Authentication is managed by **Better Auth**, integrated directly into the Express app. It handles sessions, accounts, and verifications.

## 🚀 Key Features
- **Blog Posts**: Create, read, update, delete, and manage posts with statuses (Draft/Published).
- **Comments**: Threaded commenting system.
- **User Management**: Authentication and roles (default "user").

## 🛡️ Middleware

### Authentication (`src/middleware/auth.ts`)
- **`auth`**: Custom middleware wrapping Better Auth.
    - verifying session existence.
    - verifying email verification status.
    - Attaches `user` object to `req` (id, email, name, role).
    - Supports Role-Based Access Control (RBAC) with `UserRole` (USER, ADMIN).

## 🔄 Recent Updates
- **`Post` Module**:
    - `createPost` is now secured with `auth(UserRole.USER, UserRole.ADMIN)`.
    - Automatically assigns `userId` from the authenticated session to the post.
