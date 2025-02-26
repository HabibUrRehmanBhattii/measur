# Measur Project Guidelines

## Development Commands
- `npm run dev` - Start dev server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests in watch mode
- `npm run test:ci` - Run Jest tests for CI
- `npm run cypress` - Open Cypress for E2E testing
- `npm run e2e` - Run E2E tests in headed mode

## Code Style
- **TypeScript**: Strict mode enabled, use explicit typing (no `any`)
- **Imports**: Group imports in this order with blank lines between groups:
  1. React/Next.js imports
  2. Third-party libraries
  3. Local components/utilities (use path aliases)
- **Components**: Use functional components with explicit return types
- **Naming**: PascalCase for components, camelCase for functions/variables, UPPER_CASE for constants
- **Error Handling**: Use try/catch with structured error responses (see submitMeasurement/route.ts)
- **State Management**: Use Zustand for global state, React hooks for local state
- **CSS**: Use Tailwind utility classes with consistent spacing
- **API Routes**: Return structured NextResponse objects with appropriate status codes
- **Animation**: Use Framer Motion for transitions and GSAP for complex animations
- **Caching**: Use apiCache utility for API routes, implement proper Cache-Control headers
- **Forms**: Use useMeasurementForm hook for consistent form handling

## Project Structure
- `/app` - Next.js App Router structure
- `/app/api` - API routes
- `/app/components` - Shared components
- `/app/hooks` - Custom React hooks
- `/app/store` - Zustand store
- `/app/utils` - Utility functions
- `/public` - Static assets
- `/public/images` - Measurement reference images
- `/__tests__` - Jest tests
- `/cypress` - Cypress E2E tests

## Architecture
- Use connection pooling for database/API calls (see sheets.ts)
- Implement proper caching for API routes and external calls
- Follow RESTful principles for API design
- Use Edge runtime for API routes when possible
- Leverage the App Router for better client/server code separation

Use path aliases (@/*) for imports from project root.