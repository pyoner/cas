<script lang="ts">
	import type { createUploader } from '$lib/uploader.svelte';
	import Dropzone from './Dropzone.svelte';

	let {
		open = $bindable(false),
		uploader
	}: {
		open: boolean;
		uploader: ReturnType<typeof createUploader>;
	} = $props();

	function handleClose() {
		open = false;
	}

	let copied = $state(false);

	async function copyLink() {
		if (uploader.result?.url) {
			const fullUrl = new URL(uploader.result.url, window.location.origin).toString();
			await navigator.clipboard.writeText(fullUrl);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}
</script>

<dialog {open}>
	<article>
		<header>
			<button aria-label="Close" rel="prev" onclick={handleClose}></button>
			<p>
				<strong>
					{#if uploader.status === 'success' && uploader.result}
						{uploader.result.existing ? 'File Ready!' : 'Upload Complete!'}
					{:else if uploader.status === 'error'}
						Upload Error
					{:else}
						Upload File
					{/if}
				</strong>
			</p>
		</header>

		<div class="modal-content">
			{#if uploader.status === 'idle' || uploader.status === 'checking' || uploader.status === 'ready' || uploader.status === 'uploading' || (uploader.status === 'error' && !uploader.file)}
				<Dropzone
					status={uploader.status}
					file={uploader.file}
					previewUrl={uploader.previewUrl}
					onFileChange={(file) => uploader.processFile(file)}
					onReset={() => uploader.reset()}
					onUpload={() => uploader.upload()}
				/>
			{/if}

			{#if uploader.status === 'error'}
				<div class="error-content">
					<p>{uploader.errorMessage}</p>
				</div>
			{/if}

			{#if uploader.status === 'success' && uploader.result}
				<div class="result-details">
					<p><strong>Link:</strong></p>
					<div class="link-group">
						<input
							type="text"
							value={new URL(
								uploader.result.url,
								window.location?.origin || 'http://localhost'
							).toString()}
							readonly
						/>
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a
							href={uploader.result.url}
							target="_blank"
							rel="noopener noreferrer"
							role="button"
							class="outline"
						>
							Open
						</a>
					</div>
				</div>
			{/if}
		</div>

		<footer>
			{#if uploader.status === 'error' && !uploader.file}
				<button class="outline" onclick={() => uploader.reset()}>Try Again</button>
			{/if}
			{#if uploader.status === 'success' && uploader.result}
				<button onclick={copyLink} class={copied ? 'success-button' : 'outline'}>
					{copied ? '✅ Copied!' : 'Copy Link'}
				</button>
			{/if}
			<button class="secondary outline" onclick={handleClose}>Close</button>
		</footer>
	</article>
</dialog>

<style>
	article {
		width: 100%;
		max-width: 600px;
	}

	.modal-content {
		padding: var(--pico-block-spacing-vertical) 0;
	}

	.error-content p {
		color: var(--pico-del-color);
		margin-bottom: 0;
	}

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

	footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	footer button {
		margin-bottom: 0;
		width: auto;
	}
</style>
