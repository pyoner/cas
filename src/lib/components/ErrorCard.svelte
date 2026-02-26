<script lang="ts">
	let {
		message,
		showReset = true,
		onReset
	}: {
		message: string | null;
		showReset?: boolean;
		onReset: () => void;
	} = $props();
</script>

<article class="error">
	<header>Error</header>
	<p>{message}</p>
	{#if showReset}
		<footer>
			<button class="outline" onclick={onReset}>Try Again</button>
		</footer>
	{/if}
</article>

<style>
	article.error {
		border-color: var(--pico-del-color);
	}

	article.error header {
		background-color: var(--pico-del-color);
		color: var(--pico-primary-inverse);
	}
</style>
