# VastuAntara

Official repository for the VastuAntara website – developed and maintained by SanjTiksha. Includes frontend, backend, and assets for deployment.

## Frontend Overview

Modern React + Vite single-page application for VastuAntara’s bilingual marketing site and admin panel. The project consumes Firebase (Firestore + Auth) and Cloudinary directly from the browser to power a fully dynamic, serverless experience.

## Tech Stack

- React 19 with TypeScript + Vite
- Tailwind CSS with custom brand tokens (Maroon, Gold, White)
- React Router for routing
- Firebase (Auth + Firestore) for content, messaging, and admin authentication
- Cloudinary for asset delivery and uploads
- Axios, clsx, and supporting utilities

## Getting Started

```bash
npm install
npm run dev     # start local dev server
npm run build   # generate production build
npm run preview # preview production build locally
```

Create a `.env` file based on `.env.example` with the Firebase, Cloudinary, and site configuration values before running the app.

## Project Structure

- `/src/components` – shared UI (Hero banner, cards, forms, admin guards, etc.)
- `/src/pages` – routed pages for marketing site and admin dashboard
- `/src/hooks` – Firebase data hooks (`useFirestoreCollection`, `useFirestoreDoc`, `useAuth`)
- `/src/lib` – Firebase and Cloudinary clients, helpers, and constants
- `/src/styles/globals.css` – Tailwind directives, brand tokens, global utility classes

All content is retrieved from Firestore collections and Cloudinary assets configured via the admin panel. Firebase Auth guards the admin routes to enable secure content management.
