# Vehicle Tracking Client

Real-time vehicle tracking dashboard built with React, TypeScript, and Vite.

## Tech Stack

- React 18.3+ with TypeScript
- Vite for development and building
- Redux Toolkit for state management
- Mapbox GL for interactive maps
- Socket.IO for real-time updates
- SCSS modules for styling

## Folder Structure

```
src/
├── components/          # React components
│   ├── leftPanel/      # Vehicle list and details panel
│   ├── mapPanel/       # Map visualization component
│   └── vehicleDetails/ # Vehicle information display
├── css/                # SCSS module styles
├── hooks/              # Custom React hooks
├── models/             # TypeScript interfaces
├── store/              # Redux store configuration
│   └── slices/         # Redux slices
├── utilities/          # Helper functions and constants
└── assets/             # Static assets (icons, images)
```

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173)

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - Code linting
- `npm run preview` - Preview build

## Features

- Real-time vehicle location tracking
- Interactive map with Mapbox GL
- Vehicle status monitoring (speed, angle, status)
- WebSocket integration for live updates
