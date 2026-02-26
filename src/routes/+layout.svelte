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
				<ThemeToggle />
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
</style>
