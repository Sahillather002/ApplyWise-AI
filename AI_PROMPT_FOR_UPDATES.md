# AI Prompt: Complete ApplyWise AI Startup Project

```
You are a senior full-stack developer helping to complete the ApplyWise AI startup project. 
This is a React + TypeScript application that uses Google Gemini AI to assist with job applications.

CURRENT STATE:
- Frontend is 80% complete with all major UI components built
- Uses React 19, TypeScript, Vite, Tailwind CSS
- Integrates with Google Gemini AI for form analysis, resume parsing, essay rewriting, video generation
- Stores data in localStorage (needs migration to backend)
- Missing: environment config, error handling, testing, security hardening, browser extension setup

PRIORITY TASKS (in order):

1. SETUP & CONFIGURATION
   - Create .env.local.example with GEMINI_API_KEY placeholder
   - Create .gitignore to exclude .env*, node_modules, dist, .DS_Store
   - Create index.css file with base styles (currently referenced but missing)
   - Add ESLint + Prettier configuration
   - Create manifest.json for browser extension (Chrome/Edge/Firefox)
   - Add package.json scripts for linting, formatting, type-checking

2. ERROR HANDLING & VALIDATION
   - Create ErrorBoundary component for React error catching
   - Add try-catch blocks with user-friendly error messages in all API calls
   - Implement retry logic with exponential backoff for failed API calls
   - Add loading skeletons/spinners for async operations
   - Create Toast/Notification system for user feedback
   - Validate API responses before using them
   - Handle network failures gracefully

3. SECURITY IMPROVEMENTS
   - Move API key handling to environment variables (already done, but verify)
   - Encrypt sensitive data in localStorage (use crypto-js or similar)
   - Add input sanitization for user-generated content
   - Implement rate limiting on client-side (prevent API abuse)
   - Add Content Security Policy headers
   - Sanitize HTML content to prevent XSS attacks

4. PERFORMANCE OPTIMIZATION
   - Implement React.lazy() for route-based code splitting
   - Add Suspense boundaries for lazy-loaded components
   - Optimize images (use WebP format, lazy loading)
   - Bundle Tailwind CSS instead of CDN (better performance)
   - Add service worker for offline support
   - Implement virtual scrolling for long lists (application history)
   - Memoize expensive computations with useMemo/useCallback

5. TESTING INFRASTRUCTURE
   - Set up Vitest for unit testing
   - Add React Testing Library for component tests
   - Create test utilities and mocks
   - Write tests for critical paths:
     * Form field detection
     * AI suggestion generation
     * Resume parsing
     * Vault storage/retrieval
   - Add test coverage reporting

6. BROWSER EXTENSION SETUP
   - Create manifest.json (v3) with proper permissions
   - Add content script to inject into job application pages
   - Create background service worker for extension logic
   - Add popup HTML/CSS for extension popup
   - Handle cross-origin requests (CORS)
   - Add extension icons (16x16, 48x48, 128x128)
   - Test extension in Chrome/Edge/Firefox

7. BACKEND INTEGRATION (Optional but Recommended)
   - Create Node.js/Express backend API
   - Set up PostgreSQL/MongoDB database
   - Implement user authentication (JWT tokens)
   - Create API endpoints:
     * POST /api/analyze-form
     * POST /api/parse-resume
     * POST /api/rewrite-essay
     * GET/POST /api/user-profile
     * GET/POST /api/application-history
   - Proxy Gemini API calls through backend (hide API keys)
   - Add rate limiting on backend
   - Implement data encryption at rest

8. ACCESSIBILITY IMPROVEMENTS
   - Add ARIA labels to all interactive elements
   - Implement keyboard navigation (Tab, Enter, Escape)
   - Add focus indicators
   - Ensure color contrast meets WCAG AA standards
   - Add skip navigation links
   - Test with screen readers (NVDA/JAWS)

9. DOCUMENTATION
   - Create comprehensive README.md with:
     * Installation instructions
     * Environment setup
     * Development workflow
     * Deployment guide
   - Add JSDoc comments to all functions/components
   - Create API documentation
   - Add architecture decision records (ADRs)
   - Create user guide/documentation

10. DEPLOYMENT & CI/CD
    - Set up GitHub Actions for:
      * Linting and type checking
      * Running tests
      * Building production bundle
      * Deploying to hosting (Vercel/Netlify)
    - Create production build optimization
    - Set up environment variables in hosting platform
    - Configure custom domain
    - Add analytics (Google Analytics or privacy-friendly alternative)

TECHNICAL REQUIREMENTS:
- Maintain TypeScript strict mode
- Follow React best practices (hooks, functional components)
- Use Tailwind CSS for styling (no inline styles)
- Keep code DRY and maintainable
- Add proper TypeScript types (no 'any' types)
- Follow semantic HTML structure
- Ensure mobile responsiveness

CONSTRAINTS:
- Must work with existing codebase structure
- Don't break existing functionality
- Maintain backward compatibility with localStorage data
- Keep bundle size reasonable (< 500KB initial load)

OUTPUT:
For each task, provide:
1. Code changes (files to create/modify)
2. Configuration updates
3. Testing approach
4. Migration strategy (if needed)

Start with tasks 1-3 (highest priority) and provide complete implementation.
```

