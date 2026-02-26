<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<section class="hero">
	<hgroup>
		<h1>Content Addressable Storage</h1>
		<p>
			The modern way to store and share files. Secure, fast, and deduplicated by design using
			SHA-256 hashing and Cloudflare R2.
		</p>
	</hgroup>
	{#if children}
		<div class="hero-actions">
			{@render children()}
		</div>
	{/if}
</section>

<style>
	.hero {
		text-align: center;
		padding: var(--pico-block-spacing-vertical) 0;
	}

	.hero-actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 2rem;
	}

	.hero-actions :global(button) {
		width: auto;
		margin-bottom: 0;
	}

	h1 {
		--pico-font-weight: 800;
		font-size: 3rem;
		margin-bottom: 0.5rem;
	}

	p {
		font-size: 1.25rem;
		color: var(--pico-muted-color);
		max-width: 40rem;
		margin-left: auto;
		margin-right: auto;
	}

	@media (min-width: 992px) {
		h1 {
			font-size: 4rem;
		}
	}
</style>
