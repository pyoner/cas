<script lang="ts">
	import { computeHash, MAX_FILE_SIZE } from '$lib/hash';
	import type { UploadResult, UploadResultWithUrl } from '$lib/types';

	let file: File | null = $state(null);
	let uploading = $state(false);
	let result: UploadResultWithUrl | null = $state(null);
	let error = $state<string | null>(null);
	let fileExists = $state(false);
	let checking = $state(false);
	let computedHash = $state('');

	async function handleUpload() {
		if (!file) return;

		if (file.size > MAX_FILE_SIZE) {
			error = 'File too large. Maximum size is 100MB';
			return;
		}

		uploading = true;
		error = null;
		result = null;

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
				error = data.error || 'Upload failed';
				return;
			}

			result = {
				...data,
				url: `/api/file?hash=${data.hash}`
			};
		} catch {
			error = 'Upload failed. Please try again.';
		} finally {
			uploading = false;
		}
	}

	async function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		file = target.files?.[0] || null;
		result = null;
		error = null;
		fileExists = false;
		computedHash = '';

		if (file) {
			checking = true;
			const hash = await computeHash(await file.arrayBuffer());
			computedHash = hash;

			try {
				const res = await fetch(`/api/file?hash=${hash}`, { method: 'HEAD' });
				fileExists = res.ok;

				if (fileExists) {
					result = {
						hash,
						filename: file.name,
						existing: true,
						url: `/api/file?hash=${hash}`
					};
				}
			} catch {
				fileExists = false;
			} finally {
				checking = false;
			}
		}
	}
</script>

<section>
	<h1>Content Addressable Storage</h1>
	<p>Upload files to Cloudflare R2 and get shareable links.</p>

	<div>
		<input type="file" onchange={handleFileChange} accept="*/*" />

		{#if file}
			<p>
				{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
				{#if checking}
					<span>Checking...</span>
				{:else if fileExists}
					<span>File already exists!</span>
				{/if}
			</p>
		{/if}

		<button onclick={handleUpload} disabled={!file || uploading || fileExists}>
			{uploading ? 'Uploading...' : fileExists ? 'File exists' : 'Upload'}
		</button>
	</div>

	{#if error}
		<p>{error}</p>
	{/if}

	{#if result}
		<div>
			<p>
				{result.existing ? 'File already exists!' : 'Upload complete!'}
			</p>
			<p>Hash: {result.hash}</p>
			<a href={result.url} target="_blank" rel="noopener noreferrer">
				{result.url}
			</a>
			<button onclick={() => navigator.clipboard.writeText(result!.url)}> Copy Link </button>
		</div>
	{/if}
</section>
