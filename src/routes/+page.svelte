<script lang="ts">
	import { computeHash, MAX_FILE_SIZE } from '$lib/hash';
	import type { UploadResult, UploadResultWithUrl } from '$lib/types';

	type AppStatus = 'idle' | 'checking' | 'ready' | 'uploading' | 'success' | 'error';
	let status = $state<AppStatus>('idle');

	let file: File | null = $state(null);
	let result: UploadResultWithUrl | null = $state(null);
	let errorMessage = $state<string | null>(null);
	let computedHash = $state('');

	// UI states
	let isDragging = $state(false);
	let copied = $state(false);
	let previewUrl: string | null = $state(null);

	async function handleUpload() {
		if (!file || status !== 'ready') return;

		status = 'uploading';
		errorMessage = null;

		try {
			const hash = computedHash || (await computeHash(await file.arrayBuffer()));
			const formData = new FormData();
			formData.append('file', file);
			formData.append('hash', hash);
			formData.append('filename', file.name);
			formData.append('contentType', file.type || 'application/octet-stream');

			const response = await fetch('/api/file', {
				method: 'POST',
				body: formData
			});

			const data = (await response.json()) as UploadResult;

			if (!response.ok) {
				errorMessage = data.error || 'Upload failed';
				status = 'error';
				return;
			}

			result = {
				...data,
				url: `/api/file?hash=${data.hash}`
			};
			status = 'success';
		} catch {
			errorMessage = 'Upload failed. Please try again.';
			status = 'error';
		}
	}

	async function processFile(newFile: File | null) {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			previewUrl = null;
		}

		file = newFile;
		result = null;
		errorMessage = null;
		computedHash = '';
		copied = false;

		if (!file) {
			status = 'idle';
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			errorMessage = `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`;
			status = 'error';
			return;
		}

		if (file.type.startsWith('image/')) {
			previewUrl = URL.createObjectURL(file);
		}

		status = 'checking';
		const hash = await computeHash(await file.arrayBuffer());
		computedHash = hash;

		try {
			const res = await fetch(`/api/file?hash=${hash}`, { method: 'HEAD' });
			const fileExists = res.ok;

			if (fileExists) {
				result = {
					hash,
					filename: file.name,
					existing: true,
					url: `/api/file?hash=${hash}`
				};
				status = 'success';
			} else {
				status = 'ready';
			}
		} catch {
			// If HEAD fails, assume it doesn't exist and let the upload try
			status = 'ready';
		}
	}

	async function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		await processFile(target.files?.[0] || null);
	}

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
			await processFile(e.dataTransfer.files[0]);
		}
	}

	async function copyLink() {
		if (result?.url) {
			// Resolve full URL
			const fullUrl = new URL(result.url, window.location.origin).toString();
			await navigator.clipboard.writeText(fullUrl);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}

	function reset() {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			previewUrl = null;
		}
		file = null;
		result = null;
		errorMessage = null;
		computedHash = '';
		copied = false;
		status = 'idle';
	}
</script>

<section>
	<hgroup>
		<h1>Content Addressable Storage</h1>
		<p>Upload files to Cloudflare R2 and get shareable links.</p>
	</hgroup>

	{#if status === 'idle' || status === 'checking' || status === 'ready' || status === 'uploading' || (status === 'error' && !result)}
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
						onchange={handleFileChange}
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
							onclick={reset}
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
				onclick={handleUpload}
				disabled={status === 'uploading'}
				aria-busy={status === 'uploading' ? 'true' : 'false'}
			>
				{status === 'uploading' ? 'Uploading...' : 'Upload File'}
			</button>
		{/if}
	{/if}

	{#if status === 'error'}
		<article class="error">
			<header>Error</header>
			<p>{errorMessage}</p>
			{#if !file}
				<footer>
					<button class="outline" onclick={reset}>Try Again</button>
				</footer>
			{/if}
		</article>
	{/if}

	{#if status === 'success' && result}
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
					<a
						href={result.url}
						target="_blank"
						rel="noopener noreferrer"
						role="button"
						class="outline"
					>
						Open
					</a>
					<button onclick={copyLink} class={copied ? 'success-button' : ''}>
						{copied ? '✅ Copied!' : 'Copy'}
					</button>
				</div>
			</div>
			<footer>
				<button class="outline" onclick={reset}>Upload Another File</button>
			</footer>
		</article>
	{/if}
</section>

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

	article.error {
		border-color: var(--pico-del-color);
	}

	article.error header {
		background-color: var(--pico-del-color);
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
