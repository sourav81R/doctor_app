# Mukti Medical Appointment App

Frontend-only medical appointment website built with React, Vite, Tailwind CSS, and React Router.

The project includes:

- a landing page with hero, service highlights, department cards, stats, doctors, and appointment CTA sections
- an about page with multiple promotional and FAQ-style sections
- a services page with service cards and image-based content blocks
- a contact page with an appointment form and PDF export using `jsPDF`
- a simple admin/demo page that loads placeholder user data from `jsonplaceholder.typicode.com`

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS 4
- React Router DOM 7
- `jsPDF` for appointment PDF generation
- `axios` for demo API fetching on the admin page
- `react-icons`, `lucide-react`, `react-countup`, `react-intersection-observer`

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/about` | About page |
| `/services` | Services page |
| `/contact` | Contact page with appointment form and PDF download |
| `/myadmin` | Demo admin dashboard |
| `/abc` | Standalone appointment form demo |
| `*` | Error page |

## Key Features

### Home page

- hero banner with branded background and doctor image
- specialization cards
- interactive departments section
- animated statistics counters
- doctor showcase
- appointment call-to-action section

### Contact page

- appointment form with:
  - first name
  - last name
  - date of birth
  - gender
  - contact number
  - doctor selection
  - address
  - message
- PDF generation powered by `jsPDF`
- embedded Google Maps iframe

### Admin page

- fetches sample users from `https://jsonplaceholder.typicode.com/users`
- basic filter/search UI
- sidebar/dashboard layout

## Project Structure

```text
src/
  assets/         Static images used by the UI and PDF flow
  Components/     Home page and reusable sections
  Pages/          Route-level page components
  App.jsx         Router setup
  main.jsx        React entry point
  index.css       Global styles and Tailwind import
```

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5174
```

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Lint the codebase

```bash
npm run lint
```

## Current Notes

- The project is currently frontend-only. There is no real authentication, appointment persistence, or backend API.
- The admin page is a demo view and depends on placeholder external data.
- Several sections use hardcoded content and externally hosted images.
- The PDF generation logic exists, but the layout/content has been edited multiple times and should be reviewed if you want a final prescription-style export.
- The production build currently succeeds, but Vite reports a large bundle-size warning.
- There are no automated tests in the repository.

## Main Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.13.0",
  "tailwindcss": "^4.1.18",
  "@tailwindcss/vite": "^4.1.18",
  "axios": "^1.13.5",
  "jspdf": "^4.1.0"
}
```

## Suggested Next Improvements

- connect the appointment flow to a real backend
- store submitted appointments
- clean up PDF template logic and finalize one consistent export format
- replace placeholder/demo content with real clinic data
- optimize bundle size and large images
- add form validation and user feedback states
- add automated tests
