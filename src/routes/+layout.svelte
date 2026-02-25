<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';
	import '@picocss/pico/css/pico.min.css';
	import { theme } from '$lib/theme.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="container">
	<nav>
		<ul>
			<li><a href={resolve('/')}>Home</a></li>
			<li><a href={resolve('/about')}>About</a></li>
			<li>
				<a href="https://github.com/pyoner/cas" target="_blank" rel="noopener noreferrer">GitHub</a>
			</li>
			<li style="margin-left: auto;">
				<button onclick={() => theme.toggle()} aria-label="Toggle theme">
					{#if theme.value === 'light'}
						☀️
					{:else}
						🌙
					{/if}
				</button>
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
