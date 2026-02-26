<script lang="ts">
	import { theme } from '$lib/theme.svelte';
</script>

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

<style>
	a {
		text-decoration: none;
	}
</style>
