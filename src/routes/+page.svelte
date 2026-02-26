<script lang="ts">
	import { createUploader } from '$lib/uploader.svelte';
	import { Dropzone, Features, Hero, UploadModal } from '$lib/components';

	const uploader = createUploader();
	let isModalOpen = $state(false);

	function handleFileChange(file: File | null) {
		if (file) {
			uploader.processFile(file);
			isModalOpen = true;
		}
	}
</script>

<Hero />

<UploadModal bind:open={isModalOpen} {uploader} />

<section id="upload">
	<Dropzone
		status={uploader.status}
		file={uploader.file}
		previewUrl={uploader.previewUrl}
		onFileChange={handleFileChange}
		onReset={() => uploader.reset()}
		onUpload={() => uploader.upload()}
	/>

	{#if uploader.status !== 'idle'}
		<div class="upload-trigger">
			<button class="outline" onclick={() => (isModalOpen = true)}>
				{uploader.status === 'success' ? 'View Result' : 'Continue Upload'}
			</button>
			<button class="outline secondary" onclick={() => uploader.reset()}>
				Reset and Upload New
			</button>
		</div>
	{/if}
</section>

<Features />

<style>
	.upload-trigger {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: var(--pico-spacing);
	}

	.upload-trigger button {
		width: auto;
		margin-bottom: 0;
	}
</style>
