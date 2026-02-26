<script lang="ts">
	import type { UploadResultWithUrl } from '$lib/types';

	let {
		result,
		onReset
	}: {
		result: UploadResultWithUrl;
		onReset: () => void;
	} = $props();

	let copied = $state(false);

	async function copyLink() {
		if (result?.url) {
			const fullUrl = new URL(result.url, window.location.origin).toString();
			await navigator.clipboard.writeText(fullUrl);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}
</script>

<article class="success">
	<header>
		{result.existing ? 'File Ready!' : 'Upload Complete!'}
	</header>
	<div class="result-details">
		<p><strong>Hash:</strong> <code>{result.hash}</code></p>
		<p><strong>Link:</strong></p>
		<div class="link-group">
			<input
				type="text"
				value={new URL(result.url, window.location?.origin || 'http://localhost').toString()}
				readonly
			/>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href={result.url} target="_blank" rel="noopener noreferrer" role="button" class="outline">
				Open
			</a>
			<button onclick={copyLink} class={copied ? 'success-button' : ''}>
				{copied ? '✅ Copied!' : 'Copy'}
			</button>
		</div>
	</div>
	<footer>
		<button class="outline" onclick={onReset}>Upload Another File</button>
	</footer>
</article>

<style>
	.link-group {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.link-group input {
		margin-bottom: 0;
		flex: 1;
	}

	.link-group button,
	.link-group a {
		margin-bottom: 0;
		width: auto;
		white-space: nowrap;
	}

	.success-button {
		background-color: var(--pico-ins-color);
		border-color: var(--pico-ins-color);
		color: var(--pico-primary-inverse);
	}

	article.success {
		border-color: var(--pico-ins-color);
	}

	article.success header {
		background-color: var(--pico-ins-color);
		color: var(--pico-primary-inverse);
	}
</style>
