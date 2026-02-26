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
		status="idle"
		file={null}
		previewUrl={null}
		onFileChange={handleFileChange}
		onReset={() => {}}
		onUpload={() => {}}
	/>
</section>

<Features />
