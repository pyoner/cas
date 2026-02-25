<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '@picocss/pico/css/pico.min.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header>
	<nav>
		<!-- Navbar can be added here -->
	</nav>
</header>

<main class="container">
	{@render children()}
</main>

<footer>
	<!-- Footer can be added here -->
</footer>
