# NoteHub - Private Notes Management System

A modern, secure web application for managing private notes, built with
**Next.js 16**, **Zustand**, and **TanStack Query**. This project demonstrates
advanced authentication flows, including server-side session management and
automatic token refreshing using Next.js Middleware.

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://09-auth-one-roan.vercel.app/)

## 🚀 Key Features

- **Secure Authentication**: Full registration and login flow with JWT storage.
- **Advanced Middleware (The "Proxy" Logic)**:
  - Server-side route protection for private (`/profile`, `/notes`) and public
    routes.
  - Automatic session validation and silent token refresh using Refresh Tokens.
  - Seamless cookie synchronization between client and server.
- **Notes Management (CRUD)**: Create, Read, Update, and Delete notes with
  real-time state updates.
- **Smart Filtering**: Search through notes and filter by tags with integrated
  **debouncing** for optimized API calls.
- **Data Synchronization**: Managed via TanStack Query for caching and
  optimistic UI updates.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) &
  [Axios](https://axios-http.com/)
- **Forms & Validation**:
  [Native React Forms](https://react.dev/reference/react-dom/components/form) &
  [Yup](https://github.com/jquense/yup)
- **Authentication Helpers**: `cookie`, `next/headers`
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🏗 Architecture Highlights

One of the core challenges of this project was implementing a robust **Proxy
Middleware**. This layer intercepts requests to:

1.  Check for the existence of an `accessToken`.
2.  Attempt a background session refresh if the `accessToken` is missing but a
    `refreshToken` exists.
3.  Directly inject updated cookies into the request/response headers to ensure
    the Server Components always have the latest auth state.

## ⚙️ Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/OksanaVakuliak/09-auth.git](https://github.com/OksanaVakuliak/09-auth.git)
    cd 09-auth
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:** Create a `.env.local` file in the root directory:

    ```env
    NEXT_PUBLIC_API_URL=[http://localhost:3000](http://localhost:3000)
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see
    the result.

## 📂 Project Structure

- `/app`: Next.js App Router (Auth routes, Private routes, Layouts).
- `/lib/api`: Axios instances for both Client and Server-side fetching.
- `/lib/store`: Zustand stores for global authentication state.
- `proxy.ts`: Core logic for route guarding and token management.

---

Developed as part of the GoIT educational program to demonstrate proficiency in
modern Frontend architecture.
