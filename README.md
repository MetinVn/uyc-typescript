# Youtube Converter (React + TypeScript + Vite)

A modern web app for converting YouTube links to downloadable music, managing your music library, and more. Built with React, TypeScript, Vite, Zustand, and Firebase.

---

## Table of Contents

- [Project Overview](#project-overview)
- [How I worked on this project](#how-i-worked-on-this-project)
- [How to navigate this project](#how-to-navigate-this-project)
- [Why I built the project this way](#why-i-built-the-project-this-way)
- [If I had more time I would change this](#if-i-had-more-time-i-would-change-this)
- [Technology & Implementation Details](#technology--implementation-details)
- [Contributing](#contributing)

---

## Project Overview

This app allows users to convert YouTube videos to MP3/MP4, manage their converted music, rate and favorite songs, and maintain a personal music library. It features authentication, persistent storage, and a responsive UI.

---

## How I worked on this project

My initial goal for this project was simple: I wanted to create a tool for myself—a clean environment with no ads, no annoying reminders or popups, where I could easily convert and download my favorite music from YouTube.

When it came to the UI, I didn’t take inspiration from any specific website or app. I just built things my own way, picking colors, layouts, and animations as I went. In hindsight, this “DIY” approach led to some funny imperfections and made me realize I have a lot to improve when it comes to UX/UI design!

Throughout the project, I made sure to pause and think before adding new features or making changes. I tried to consider how each part would fit into the overall structure, and I spent time planning before building anything major. This helped me avoid unnecessary complexity and made it easier to connect the dots between different components and user flows.

---

## How to navigate this project

The project is organized for clarity and scalability. Here’s a quick guide to the structure and important files:

```
src/
│
├── app.tsx                  # App shell and main layout
├── main.tsx                 # Entry point, router setup
├── firebase.ts              # Firebase config and exports
├── index.css                # Global styles
│
├── components/              # All UI components
│   ├── reused-ui/           # Reusable UI elements (buttons, cards, forms, etc.)
│   │   ├── reused-music-card.tsx         # [MusicCard component](components/reused-ui/reused-music-card.tsx)
│   │   ├── reused-music-card-wrapper.tsx # [MusicCardWrapper component](components/reused-ui/reused-music-card-wrapper.tsx)
│   │   ├── reused-converted-song.tsx     # [ConvertedSongUI component](components/reused-ui/reused-converted-song.tsx)
│   │   ├── reused-select.tsx             # [CustomSelect component](components/reused-ui/reused-select.tsx)
│   │   └── ...                           # Other UI elements
│   ├── guest-ui/           # Components for guest users
│   ├── user-ui/            # Components for authenticated users
│   └── notifications.tsx   # [Notification system](components/notifications.tsx)
│
├── contexts/                # React context providers (e.g., user context)
│
├── hooks/                   # Custom React hooks
│
├── mock/                    # Mock data for development/testing
│
├── pages/                   # Top-level pages/routes
│   ├── home-page.tsx        # [Home page](pages/home-page.tsx)
│   ├── music-page.tsx       # [Music library page](pages/music-page.tsx)
│   ├── account-page.tsx     # [Account management page](pages/account-page.tsx)
│   ├── signin-page.tsx      # [Sign-in page](pages/signin-page.tsx)
│   ├── signup-page.tsx      # [Sign-up page](pages/signup-page.tsx)
│   └── reset-password-page.tsx # [Password reset page](pages/reset-password-page.tsx)
│
├── routes/                  # Route definitions
│
├── services/                # API and Firebase service logic
│
├── stores/                  # Zustand stores for state management
│   ├── user/                # User-specific stores (music list, user state)
│   └── shared/              # Shared/global stores (notifications, converted song, format)
│
├── types/                   # TypeScript types
│
├── utils/                   # Utility functions (e.g., YouTube parsing, formatting)
```

**Key files to check out:**

- [`src/components/reused-ui/reused-music-card-wrapper.tsx`](src/components/reused-ui/reused-music-card-wrapper.tsx): Main music card grid logic.
- [`src/pages/music-page.tsx`](src/pages/music-page.tsx): Music library page, uses the wrapper.
- [`src/stores/user/music-list.ts`](src/stores/user/music-list.ts): Zustand store for user music.
- [`src/utils/convert-to-mp3.ts`](src/utils/convert-to-mp3.ts): Handles YouTube to MP3 conversion logic.

---

## Why I built the project this way

I originally built this app with plain JavaScript, but as I learned TypeScript, I decided to migrate the project for better type safety and maintainability. The migration was a fresh start, and I realized the importance of planning: in the earlier version, lack of structure made it hard to add features or refactor code.

For this version, I spent time thinking about the architecture, component responsibilities, and user management. I mapped out the structure and data flow on paper before writing code, which helped me build more robust and maintainable components. I chose Zustand for state management due to its simplicity and scalability, and Firebase for authentication and database.

---

## If I had more time I would change this

If I had more time, I would:

- Build a custom backend server for link conversion, so users wouldn’t be limited by third-party API quotas or reliability.
- Add a music recommendation system to suggest songs based on users’ converted songs and ratings.
- Improve the planning and documentation even further, possibly adding more automated tests and CI/CD.
- Refine the UI/UX for even better accessibility and responsiveness.

---

## Technology & Implementation Details

This project leverages a modern React + TypeScript stack, with a focus on modularity, reusability, and smooth user experience. Here’s how the main technologies and patterns are used throughout the codebase:

- **React & TypeScript:**  
  The entire UI is built with React functional components and hooks, using TypeScript for type safety and maintainability. This ensures robust code and easier refactoring as the project grows.

- **Vite:**  
  Vite is used as the build tool for fast development and optimized production builds.

- **State Management with Zustand:**  
  All global state (such as the user's music list, notifications, and format selection) is managed using Zustand. This lightweight state management library allows for simple, scalable, and performant state logic without boilerplate.

- **Authentication & Persistence with Firebase:**  
  User authentication (email/password and Google sign-in) and persistent storage are handled via Firebase. The [`src/firebase.ts`](src/firebase.ts) file sets up the Firebase app, and related logic is abstracted in the `services/` folder.

- **Reusable Form Controllers & Validation:**  
  The `hooks/` folder contains custom hooks for form models and controllers (for example, `hooks-form-controllers/model/signin-form.ts` and `signup-form.ts`). These are reused across pages like [Sign In](pages/signin-page.tsx) and [Sign Up](pages/signup-page.tsx) to handle form state, validation, and error management in a consistent way.

- **Custom Notifications with Framer Motion:**  
  The notification system ([`src/components/notifications.tsx`](src/components/notifications.tsx)) uses Framer Motion for smooth entrance/exit animations, providing a modern and responsive user feedback experience.

- **UI Components & Animations:**  
  The `components/reused-ui/` folder contains all reusable UI elements, such as music cards, select dropdowns, and animated buttons. Many of these components use Framer Motion for subtle animations, enhancing the overall UX.

- **Routing:**  
  Routing is handled with React Router, with route definitions in [`src/routes/routes.ts`](src/routes/routes.ts) and page components in the `pages/` directory.

- **Utility Functions:**  
  The `utils/` folder contains helpers for tasks like parsing YouTube URLs, formatting durations and file sizes, and handling API requests.

- **Styling:**  
  Styling is managed with Tailwind CSS (see [`src/index.css`](src/index.css)), using custom CSS variables for theming and consistent design.

**Notable Patterns:**

- **Form logic is abstracted and reused** across authentication and account management pages, reducing duplication and making validation consistent.
- **Notifications and UI feedback** are animated for a polished feel.
- **State and logic are separated from UI** for easier testing and maintenance.

---

## Contributing

I’m open to contributions, suggestions, and improvements! If you’d like to contribute to this project:

1. **Fork** the repository.
2. **Clone** your fork and create a new branch for your feature or fix.
3. Make your changes and ensure everything works as expected.
4. Open a **pull request** with a clear description of your changes.

Feel free to open issues for bugs, feature requests, or questions. All constructive feedback is welcome—let’s make this project better together!
