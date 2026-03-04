# Contributing to CalenBook

Thank you for your interest in contributing! 🎉

## Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/calenbook.git
   cd calenbook
   ```
3. **Install** dependencies (from root):
   ```bash
   npm install
   ```
4. **Copy** environment variables:
   ```bash
   # In apps/web/
   cp .env.example .env
   ```
5. **Configure** Supabase (see [Technical Guide](docs/architecture.md))
6. **Start** development:
   ```bash
   npm run dev
   ```

## Development Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your changes
3. Ensure code quality:
   ```bash
   npm run lint
   npm run format:check
   npm run type-check
   ```
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add booking confirmation page
   fix: resolve timezone offset in availability
   docs: update Google Cloud setup guide
   ```
5. Push and open a Pull Request

## Commit Convention

| Prefix      | Use for                     |
| ----------- | --------------------------- |
| `feat:`     | New feature                 |
| `fix:`      | Bug fix                     |
| `docs:`     | Documentation only          |
| `style:`    | Formatting, no code change  |
| `refactor:` | Code change, no new feature |
| `test:`     | Adding tests                |
| `chore:`    | Build process, dependencies |

## Project Structure

```
apps/web        → Next.js frontend
apps/supabase   → Database migrations and Edge Functions
packages/shared → Shared types, schemas, and utilities
docs/           → Detailed Documentation & Guides
```

## Code Style

- **TypeScript** in strict mode
- **Prettier** for formatting (auto on save recommended)
- **ESLint** for linting
- No `any` types allowed
- Prefer `const` over `let`
- Use meaningful variable names

## Need Help?

Check the [README.md](README.md) for overview or open an issue describing what you want to work on.
