# Contributing to LokTantra

Thank you for your interest in contributing to LokTantra! We welcome contributions from developers, researchers, designers, and domain experts. 

Please follow these guidelines to ensure a smooth collaboration.

## 1. Core Principles

Before writing any code or documentation, ensure your contribution adheres to our core principles:
- **Absolute Political Neutrality**: Do not inject personal or political opinions into the codebase, documentation, or seed data.
- **Source Verifiability**: All data must be cited from official sources (e.g., ECI, Supreme Court, Parliament of India).
- **Accessibility**: UI changes must support screen readers and meet WCAG 2.1 AA standards.

## 2. Development Workflow

1. **Fork the Repository**: Create your own fork and clone it locally.
2. **Create a Branch**: Use a descriptive branch name based on the issue type.
   - `feat/feature-name`
   - `fix/bug-name`
   - `docs/doc-update`
   - `refactor/component-name`
3. **Write Code**: Ensure your code follows the coding standards below.
4. **Test Your Changes**: Verify that the application builds successfully and passes all linter checks.
5. **Open a Pull Request**: Submit a PR to the `main` branch with a clear description of the changes.

## 3. Coding Standards

### TypeScript
- Enable **strict mode** for all new code.
- Avoid the use of `any`. Define explicit interfaces or types in `src/types/`.
- Use the `@/` path alias for all internal imports.

### React & Next.js
- **Server Components First**: Default to Next.js Server Components for data fetching. Only use `"use client"` when interactivity (hooks, state) is strictly necessary.
- **Component Composition**: Keep page files thin. Extract heavy UI logic into components inside `src/components/`.
- **Zustand for State**: Use Zustand domain slices (e.g., `useFilterStore`, `useGraphStore`) for global client state. Do not use React Context unless absolutely required.

### Styling (Tailwind CSS)
- Use utility classes over custom CSS wherever possible.
- When creating reusable patterns, use the `cn()` utility (`clsx` + `tailwind-merge`).
- Follow the custom tri-color theme tokens defined in `tailwind.config.ts` (`saffron`, `navy`, `chakra`).

### Backend Services
- **Service Layer**: Do not query Prisma directly from API routes or pages. Always use the service layer (`src/lib/services/`).
- **Validation**: All API inputs must be validated using Zod schemas (`src/lib/validators/`).
- **Error Handling**: Use typed custom errors and handle them gracefully with standard HTTP status codes.

## 4. Submitting a Pull Request

Your pull request must include:
1. **Summary of Changes**: What does this PR do?
2. **Linked Issue**: Mention the issue number (e.g., `Closes #42`).
3. **Verification**: How did you test this change? 
4. **Screenshots**: If the PR includes visual changes, please attach screenshots.

## 5. Environment Setup

See the [README.md](README.md) for detailed instructions on spinning up the Docker Compose stack (PostgreSQL, Neo4j, Redis, ElasticSearch) and seeding the database.

## 6. Code of Conduct

Be respectful, constructive, and collaborative. Any form of harassment, discrimination, or abusive behavior will not be tolerated.
