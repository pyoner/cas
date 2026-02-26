# Agent Instructions for Content Addressable Storage (CAS)

Welcome! You are an agentic coding assistant operating in this repository. This file contains critical instructions, commands, and conventions you MUST follow when working on this project.

## 1. Environment & Tooling

### 1.1 Package Manager

- **CRITICAL**: Use `bun` for all package management and script execution. NEVER use `npm`, `yarn`, or `pnpm`.
- Add dependencies using `bun add <package>`.
- Run scripts using `bun run <script>`.

### 1.2 Core Stack

- **Framework**: SvelteKit with Svelte 5 (`@sveltejs/kit`, `svelte@5`).
- **Language**: TypeScript (`"strict": true`).
- **Styling**: PicoCSS (`@picocss/pico`).
- **Deployment target**: Cloudflare Workers / Pages (`@sveltejs/adapter-cloudflare`, `wrangler`).

## 2. Project Commands

When asked to perform tasks, use the following commands to ensure stability and correctness:

- **Development Server**: `bun run dev`
- **Build**: `bun run build`
- **Preview**: `bun run preview`
- **Type Checking**: `bun run check` (Runs `svelte-check` against tsconfig)
- **Linting**: `bun run lint` (Checks with Prettier and ESLint)
- **Formatting**: `bun run format` (Fixes formatting using Prettier)
- **Deploy**: `bun run deploy` (Builds and deploys via Wrangler)
- **Cloudflare Types Generation**: `bun run cf-typegen` or `bun run gen`

### 2.1 Testing

- **Single Test**: Run a single test file using `bun test path/to/file.test.ts`.
  _(Note: Default to `bun test` for utility/logic testing. If specialized browser testing is added later, Vitest/Playwright may be introduced)_.
- **All Tests**: Run `bun test` to execute the full suite.

## 3. Code Style Guidelines

Maintain consistency with the existing codebase by adhering strictly to these rules:

### 3.1 Formatting (Prettier)

- **Indentation**: Use Tabs (`useTabs: true`).
- **Quotes**: Use Single Quotes (`singleQuote: true`).
- **Trailing Commas**: None (`trailingComma: "none"`).
- **Line Width**: Max 100 characters (`printWidth: 100`).
- Always run `bun run format` after modifying files to ensure compliance.

### 3.2 TypeScript & Types

- Types must be strictly defined (`strict: true`). Avoid `any`; use `unknown` if necessary.
- Cloudflare environment bindings are typed in `src/worker-configuration.d.ts`. Ensure you run `bun run cf-typegen` if bindings in `wrangler.toml` change.
- Prefer `interface` for object shapes and `type` for unions/aliases.

### 3.3 Imports

- Group and order imports logically: Svelte/SvelteKit core first, external dependencies second, internal `$` aliases (e.g., `$lib/`) third, relative imports last.
- Take advantage of TypeScript's `rewriteRelativeImportExtensions` and `moduleResolution: "bundler"`.

### 3.4 Naming Conventions

- **Variables/Functions**: `camelCase`.
- **Classes/Types/Interfaces**: `PascalCase`.
- **Constants/Environment Variables**: `UPPER_SNAKE_CASE`.
- **Svelte Components**: `PascalCase.svelte` (e.g., `SubmitButton.svelte`).
- **SvelteKit Routes**: Follow standard SvelteKit conventions (`+page.svelte`, `+layout.server.ts`, etc.).

### 3.5 Error Handling

- Use standard `try/catch` blocks for asynchronous operations.
- In SvelteKit load functions (`+page.ts` / `+page.server.ts`), use SvelteKit's `error(status, message)` to throw structured HTTP errors.
- Handle Cloudflare Worker constraints gracefully (e.g., catch fetch errors, handle rate limits).

### 3.6 Svelte 5 Specifics

- Leverage Svelte 5 Runes (`$state`, `$derived`, `$effect`, `$props`) instead of old Svelte 4 reactivity models (`let x`, `$: x`, `export let x`).
- Keep components modular. If a component grows too large, extract logic into separate `.svelte.ts` files using shared runes or utility functions.

## 4. Svelte MCP Server Guidelines

You have access to the Svelte MCP server, which provides comprehensive Svelte 5 and SvelteKit documentation. Use these tools effectively:

### 4.1 `list-sections`

- Use this **FIRST** to discover all available documentation sections. It returns a structured list with titles, use_cases, and paths.
- When asked about Svelte or SvelteKit topics, **ALWAYS** use this tool at the start of the chat to find relevant sections.

### 4.2 `get-documentation`

- Retrieves full documentation content for specific sections. Accepts single or multiple sections.
- After calling `list-sections`, you **MUST** analyze the returned documentation sections (especially the `use_cases` field) and then use `get-documentation` to fetch **ALL** documentation sections relevant to the user's task.

### 4.3 `svelte-autofixer`

- Analyzes Svelte code and returns issues and suggestions.
- You **MUST** use this tool whenever writing Svelte code _before_ sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4.4 `playground-link`

- Generates a Svelte Playground link with the provided code.
- After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and **NEVER** if code was written to files in their project.
