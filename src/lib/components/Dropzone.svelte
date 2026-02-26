<script lang="ts">
	import type { AppStatus } from '$lib/uploader.svelte';

	let {
		status,
		file,
		previewUrl,
		onFileChange,
		onReset,
		onUpload
	}: {
		status: AppStatus;
		file: File | null;
		previewUrl: string | null;
		onFileChange: (file: File | null) => void;
		onReset: () => void;
		onUpload: () => void;
	} = $props();

	let isDragging = $state(false);

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (status === 'idle' || status === 'error') {
			isDragging = true;
		}
	}

	function handleDragLeave() {
		isDragging = false;
	}

	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if ((status === 'idle' || status === 'error') && e.dataTransfer?.files?.length) {
			onFileChange(e.dataTransfer.files[0]);
		}
	}

	function handleInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		onFileChange(target.files?.[0] || null);
	}
</script>

<article
	class="dropzone {isDragging ? 'dragging' : ''}"
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	role="region"
	aria-label="File Upload Dropzone"
>
	{#if status === 'idle' || (status === 'error' && !file)}
		<div class="drop-content">
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
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
				<polyline points="17 8 12 3 7 8"></polyline>
				<line x1="12" y1="3" x2="12" y2="15"></line>
			</svg>
			<p>Drag & drop a file here, or click to select</p>
			<input
				type="file"
				onchange={handleInputChange}
				accept="*/*"
				aria-invalid={status === 'error' ? 'true' : undefined}
				title="File Input"
			/>
		</div>
	{:else if file}
		<div class="file-details">
			{#if previewUrl}
				<img src={previewUrl} alt="Preview" class="preview-image" />
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
				<strong>{file.name}</strong>
				<small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
			</div>

			{#if status !== 'uploading'}
				<button
					class="outline secondary outline-button"
					onclick={onReset}
					title="Remove file"
					aria-label="Remove file"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"
						></line></svg
					>
				</button>
			{/if}
		</div>

		{#if status === 'checking'}
			<progress></progress>
			<small>Checking file...</small>
		{/if}
	{/if}
</article>

{#if status === 'ready' || status === 'uploading'}
	<button
		onclick={onUpload}
		disabled={status === 'uploading'}
		aria-busy={status === 'uploading' ? 'true' : 'false'}
	>
		{status === 'uploading' ? 'Uploading...' : 'Upload File'}
	</button>
{/if}

<style>
	.dropzone {
		position: relative;
		border: 2px dashed var(--pico-muted-border-color);
		border-radius: var(--pico-border-radius);
		padding: 2rem;
		text-align: center;
		transition: all 0.2s ease;
		background-color: var(--pico-form-element-background-color);
		margin-bottom: var(--pico-spacing);
	}

	.dropzone.dragging {
		border-color: var(--pico-primary);
		background-color: var(--pico-primary-background);
	}

	.drop-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		color: var(--pico-muted-color);
	}

	.drop-content input[type='file'] {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
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

	.outline-button {
		width: auto;
		padding: 0.5rem;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
