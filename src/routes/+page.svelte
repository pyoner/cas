<script lang="ts">
	import { createUploader } from '$lib/uploader.svelte';
	import { Dropzone, SuccessCard, ErrorCard } from '$lib/components';

	const uploader = createUploader();
</script>

<section>
	<hgroup>
		<h1>Content Addressable Storage</h1>
		<p>Secure and Fast File Storage Built on Cloudflare R2.</p>
	</hgroup>

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
</section>
