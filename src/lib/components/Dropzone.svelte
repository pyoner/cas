<script lang="ts">
	let {
		onFileChange
	}: {
		onFileChange: (file: File | null) => void;
	} = $props();

	let isDragging = $state(false);

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (e.dataTransfer?.files?.length) {
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
		<input type="file" onchange={handleInputChange} accept="*/*" title="File Input" />
	</div>
</article>

<style>
	.dropzone {
		position: relative;
		border: 2px dashed var(--pico-muted-border-color);
		border-radius: var(--pico-border-radius);
		padding: 3rem 2rem;
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
</style>
