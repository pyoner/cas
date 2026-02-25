<script lang="ts">
</script>

<section>
	<h2>Description</h2>
	<p>
		A simple file storage service that uses content-addressable storage. Files are stored in
		Cloudflare R2 and identified by their content hash, enabling automatic deduplication.
	</p>
</section>

<section>
	<h2>Features</h2>
	<ul>
		<li>File upload to Cloudflare R2</li>
		<li>Content-addressable storage (automatic deduplication)</li>
		<li>Duplicate file detection</li>
		<li>Shareable links</li>
		<li>Copy link to clipboard</li>
		<li>Max file size: 100MB</li>
		<li>Dark/Light theme support</li>
	</ul>
</section>

<section>
	<h2>Tech Stack</h2>
	<ul>
		<li>SvelteKit</li>
		<li>Svelte 5</li>
		<li>TypeScript</li>
		<li>Cloudflare Workers & R2</li>
		<li>Pico CSS</li>
		<li>Bun</li>
		<li>Vite</li>
	</ul>
</section>
