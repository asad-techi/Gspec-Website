# GSpec Company Landing Page

A futuristic, animated landing page for an AI solutions company — built with React, TypeScript, and Vite.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — dev server and bundler
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — page and scroll animations
- **Three.js / React Three Fiber** — 3D robot model in the hero
- **Contentful** — headless CMS for blog posts
- **React Router DOM** — client-side routing
- **shadcn/ui** (Radix UI) — accessible UI components

## Pages & Sections

### Single-page sections (home)
| Section | Description |
|---|---|
| Hero | Animated intro with 3D robot and scroll parallax |
| Services | AI service offerings with modal detail cards |
| Testimonials | Client feedback carousel |
| About | Company background |
| Mission | Core mission statement |
| Journey | Company timeline |
| Contact | Contact form |

### Routes
- `/` — Main landing page
- `/blogs` — Blog listing (fetched from Contentful)
- `/blog/:slug` — Individual blog post
- `/mission` — Dedicated mission page

## Getting Started

### Prerequisites
- Node.js 18+
- A [Contentful](https://www.contentful.com/) account with a space set up for blog posts

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root (see `.env.example` for reference):

```env
VITE_CONTENTFUL_SPACE_ID=your_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token
```

> Never commit your `.env` file. It is already excluded via `.gitignore`.

### Development

```bash
npm run dev
```


## Project Structure

```
src/
├── components/       # Shared components (Header, Footer, NeuralLoader, Robot...)
├── sections/         # Home page sections (Hero, Services, About...)
├── pages/            # Route-level pages (BlogsPage, BlogPostPage, MissionPage)
├── lib/              # Utilities and Contentful client
├── hooks/            # Custom React hooks
├── App.tsx           # Root app with layout and loader
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Environment Variables Reference

| Variable | Description |
|---|---|
| `VITE_CONTENTFUL_SPACE_ID` | Your Contentful space ID |
| `VITE_CONTENTFUL_ACCESS_TOKEN` | Contentful Content Delivery API token |
