# AGENTS.md

## Build Commands
- `pnpm dev` - Start dev server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm start` - Start production server

## Code Style
- Use TypeScript strict mode
- Import order: React → Next.js → Third-party → Local → Relative
- Use `@/` alias for imports
- PascalCase for components, camelCase for functions/variables
- Use shadcn/ui components and patterns
- Follow Tailwind CSS utility-first approach
- Use `cn()` from `@/lib/utils` for conditional classes
- Error boundaries for components, try-catch for async operations