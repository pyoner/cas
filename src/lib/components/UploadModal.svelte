<script lang="ts">
	import type { createUploader } from '$lib/uploader.svelte';
	import Dropzone from './Dropzone.svelte';
	import SuccessCard from './SuccessCard.svelte';
	import ErrorCard from './ErrorCard.svelte';

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
</script>

<dialog {open}>
	<article>
		<header>
			<button aria-label="Close" rel="prev" onclick={handleClose}></button>
			<p>
				<strong>Upload File</strong>
			</p>
		</header>

		<div class="modal-content">
			{#if uploader.status === 'idle' || uploader.status === 'checking' || uploader.status === 'ready' || uploader.status === 'uploading' || (uploader.status === 'error' && !uploader.result)}
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
				<ErrorCard
					message={uploader.errorMessage}
					showReset={!uploader.file}
					onReset={() => uploader.reset()}
				/>
			{/if}

			{#if uploader.status === 'success' && uploader.result}
				<SuccessCard result={uploader.result} onReset={() => uploader.reset()} />
			{/if}
		</div>

		<footer>
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

	footer {
		display: flex;
		justify-content: flex-end;
	}

	footer button {
		margin-bottom: 0;
		width: auto;
	}
</style>
