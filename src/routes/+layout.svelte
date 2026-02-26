<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import logo from '$lib/assets/logo.svg';
	import { resolve } from '$app/paths';
	import '@picocss/pico/css/pico.min.css';
	import { theme } from '$lib/theme.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Content Addressable Storage | CAS</title>
	<meta name="description" content="Secure and Fast File Storage Built on Cloudflare R2." />
</svelte:head>

<header class="container">
	<nav>
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
				<a href="https://github.com/pyoner/cas" target="_blank" rel="noopener noreferrer">GitHub</a>
			</li>
			<li>
				<a
					href="#theme"
					onclick={(e) => {
						e.preventDefault();
						theme.toggle();
					}}
					aria-label="Toggle theme"
				>
					{#if theme.value === 'light'}
						☀️
					{:else}
						🌙
					{/if}
				</a>
			</li>
		</ul>
	</nav>
</header>

<main class="container">
	{@render children()}
</main>

<footer class="container">
	<p>
		&copy; 2026 <a href="https://github.com/pyoner/cas" target="_blank" rel="noopener noreferrer"
			>GitHub</a
		>
	</p>
</footer>

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	footer {
		margin-top: auto;
	}

	nav a[href='#theme'] {
		text-decoration: none;
	}
</style>
