<script lang="ts">
	import type { createUploader } from '$lib/uploader.svelte';

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
			<button aria-label="Close" onclick={handleClose} disabled={uploader.status === 'uploading'}
			></button>
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
			{#if uploader.file && uploader.status !== 'success'}
				<div class="file-details">
					{#if uploader.previewUrl}
						<img src={uploader.previewUrl} alt="Preview" class="preview-image" />
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
							<polyline points="14 2 14 8 20 8"></polyline>
							<line x1="16" y1="13" x2="8" y2="13"></line>
							<line x1="16" y1="17" x2="8" y2="17"></line>
							<polyline points="10 9 9 9 8 9"></polyline>
						</svg>
					{/if}
					<div class="file-info">
						<strong>{uploader.file.name}</strong>
						<small>{(uploader.file.size / 1024 / 1024).toFixed(2)} MB</small>
					</div>
				</div>

				{#if uploader.status === 'checking'}
					<progress></progress>
					<small>Checking file...</small>
				{/if}

				{#if uploader.status === 'uploading'}
					<progress></progress>
					<small>Uploading...</small>
				{/if}
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
			{#if uploader.status === 'ready' || uploader.status === 'uploading'}
				<button
					onclick={() => uploader.upload()}
					disabled={uploader.status === 'uploading'}
					aria-busy={uploader.status === 'uploading' ? 'true' : 'false'}
				>
					{uploader.status === 'uploading' ? 'Uploading...' : 'Upload File'}
				</button>
			{/if}
			{#if uploader.status === 'success' && uploader.result}
				<button onclick={copyLink} class={copied ? 'success-button' : 'outline'}>
					{copied ? '✅ Copied!' : 'Copy Link'}
				</button>
			{/if}
			<button
				class="secondary outline"
				onclick={handleClose}
				disabled={uploader.status === 'uploading'}>Close</button
			>
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

	.file-details {
		display: flex;
		align-items: center;
		gap: 1rem;
		text-align: left;
		margin-bottom: 1rem;
	}

	.preview-image {
		width: 48px;
		height: 48px;
		object-fit: cover;
		border-radius: var(--pico-border-radius);
	}

	.file-info {
		flex: 1;
		display: flex;
		flex-direction: column;
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
