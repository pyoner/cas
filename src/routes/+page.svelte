<script lang="ts">
	import { resolve } from '$app/paths';

	interface UploadResult {
		hash: string;
		filename: string;
		existing: boolean;
		error?: string;
	}

	let file: File | null = $state(null);
	let uploading = $state(false);
	let result: (UploadResult & { url: string }) | null = $state(null);
	let error = $state<string | null>(null);

	const MAX_SIZE = 100 * 1024 * 1024;

	async function computeHash(file: File): Promise<string> {
		const buffer = await file.arrayBuffer();
		const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	}

	async function handleUpload() {
		if (!file) return;

		if (file.size > MAX_SIZE) {
			error = 'File too large. Maximum size is 100MB';
			return;
		}

		uploading = true;
		error = null;
		result = null;

		try {
			const hash = await computeHash(file);
			const formData = new FormData();
			formData.append('file', file);
			formData.append('hash', hash);
			formData.append('filename', file.name);
			formData.append('contentType', file.type || 'application/octet-stream');

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			const data: UploadResult = await response.json();

			if (!response.ok) {
				error = data.error || 'Upload failed';
				return;
			}

			result = {
				...data,
				url: `/file/${data.hash}`
			};
		} catch {
			error = 'Upload failed. Please try again.';
		} finally {
			uploading = false;
		}
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		file = target.files?.[0] || null;
		result = null;
		error = null;
	}
</script>

<main>
	<h1>Content Addressable Storage</h1>
	<p>Upload files to Cloudflare R2 and get shareable links.</p>

	<div class="upload-form">
		<input type="file" onchange={handleFileChange} accept="*/*" />

		{#if file}
			<p class="file-info">
				{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
			</p>
		{/if}

		<button onclick={handleUpload} disabled={!file || uploading}>
			{uploading ? 'Uploading...' : 'Upload'}
		</button>
	</div>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	{#if result}
		<div class="result">
			<p class="success">
				{result.existing ? 'File already exists!' : 'Upload complete!'}
			</p>
			<p>Hash: {result.hash}</p>
			<a
				href={resolve('/file/[hash]', { hash: result.hash })}
				target="_blank"
				rel="noopener noreferrer"
			>
				{result.url}
			</a>
			<button onclick={() => navigator.clipboard.writeText(result!.url)}> Copy Link </button>
		</div>
	{/if}
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, sans-serif;
	}

	h1 {
		margin-bottom: 0.5rem;
	}

	.upload-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 2rem 0;
	}

	input[type='file'] {
		padding: 0.5rem;
	}

	.file-info {
		font-size: 0.9rem;
		color: #666;
	}

	button {
		padding: 0.75rem 1.5rem;
		background: #0070f3;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}

	button:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.error {
		color: #dc2626;
	}

	.success {
		color: #16a34a;
		font-weight: bold;
	}

	.result {
		margin-top: 2rem;
		padding: 1rem;
		background: #f5f5f5;
		border-radius: 8px;
	}

	.result a {
		display: block;
		margin: 1rem 0;
		word-break: break-all;
	}
</style>
