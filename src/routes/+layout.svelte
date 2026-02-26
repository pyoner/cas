<script lang="ts">
	import logo from '$lib/assets/logo.svg';
	import { resolve } from '$app/paths';
	import '@picocss/pico/css/pico.min.css';
	import { ThemeToggle } from '$lib/components';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={logo} />
	<title>Content Addressable Storage | CAS</title>
	<meta name="description" content="Secure and Fast File Storage Built on Cloudflare R2." />
</svelte:head>

<header>
	<nav class="container">
		<ul>
			<li>
				<a
					href={resolve('/')}
					style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none;"
				>
					<img src={logo} alt="CAS Logo" width="32" height="32" />
					<strong>CAS</strong>
				</a>
			</li>
		</ul>
		<ul>
			<li><a href={resolve('/')}>Home</a></li>
			<li><a href={resolve('/about')}>About</a></li>
			<li>
				<ThemeToggle />
			</li>
		</ul>
	</nav>
</header>

<main class="container">
	{@render children()}
</main>

<footer>
	<div class="container footer-content">
		<p>
			&copy; 2026 Built by <a href="https://x.com/pyoner" target="_blank" rel="noopener noreferrer"
				>pyoner</a
			>
		</p>
		<nav class="footer-socials">
			<ul>
				<li>
					<a
						href="https://github.com/pyoner/cas"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.292 24 17.792 24 12.497c0-6.627-5.373-12-12-12"
							/>
						</svg>
					</a>
				</li>
				<li>
					<a
						href="https://x.com/pyoner"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="X (formerly Twitter)"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z"
							/>
						</svg>
					</a>
				</li>
			</ul>
		</nav>
	</div>
</footer>

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	header {
		border-bottom: 1px solid var(--pico-muted-border-color);
		margin-bottom: var(--pico-block-spacing-vertical);
	}

	main {
		flex: 1;
	}

	footer {
		border-top: 1px solid var(--pico-muted-border-color);
		margin-top: var(--pico-block-spacing-vertical);
		padding: var(--pico-block-spacing-vertical) 0;
	}

	.footer-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	footer p {
		margin-bottom: 0;
	}

	.footer-socials ul {
		margin-bottom: 0;
		padding: 0;
		display: flex;
		list-style: none;
		gap: 1rem;
	}

	.footer-socials a {
		color: var(--pico-muted-color);
		transition: color 0.2s ease;
	}

	.footer-socials a:hover {
		color: var(--pico-primary);
	}
</style>
