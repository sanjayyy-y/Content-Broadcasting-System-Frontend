# Content Broadcasting System Frontend

A role-based Next.js frontend for educational content broadcasting. Teachers upload image-based subject content, principals approve or reject submissions, and public viewers can watch a live teacher feed without authentication.

## Tech Stack

- Next.js 14 App Router
- JavaScript ES6+
- Tailwind CSS and shadcn-style UI components
- React Hook Form and Zod
- Axios
- React Context with `useReducer`
- Mock JWT stored in `localStorage`

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo Credentials

- Teacher: `teacher@demo.com` / `123456`
- Teacher 2: `teacher2@demo.com` / `123456`
- Principal: `principal@demo.com` / `123456`

## Folder Structure

```txt
src/
  app/
  components/
  context/
  hooks/
  lib/
  services/
  middleware.js
```

Teacher routes live at `/dashboard`, `/upload`, and `/my-content`. Principal routes live at `/principal/dashboard`, `/principal/approvals`, and `/principal/all-content`. Public live feeds are available at `/live/[teacherId]`.

## Deployment

Deployment link: `TBD`
