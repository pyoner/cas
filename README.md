# Content Addressable Storage

A file storage service built with SvelteKit and Cloudflare R2 that uses SHA-256 hashing for content-addressable storage.

## Features

- Upload files and get shareable links
- SHA-256 content addressing (same content = same hash)
- File deduplication (identical files are stored once)
- Preserves original filename and content type
- 100MB file size limit

## How it works

Files are hashed using SHA-256. The hash becomes the storage key, enabling deduplication - if you upload the same file twice, you'll get the same shareable link.

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
bun x sv create --template minimal --types ts --add prettier eslint sveltekit-adapter="adapter:cloudflare+cfTarget:workers" mcp="ide:opencode+setup:local" --install bun content-addressable-storage
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
