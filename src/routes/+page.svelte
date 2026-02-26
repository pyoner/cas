<script lang="ts">
	import { Features, Hero, UploadModal } from '$lib/components';

	let isModalOpen = $state(false);
</script>

<Hero>
	<button onclick={() => (isModalOpen = true)}>Start Uploading</button>
</Hero>

<UploadModal bind:open={isModalOpen} />

<Features />
