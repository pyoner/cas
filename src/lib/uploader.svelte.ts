import { computeHash, MAX_FILE_SIZE } from '$lib/hash';
import type { UploadResult, UploadResultWithUrl } from '$lib/types';

export type AppStatus = 'idle' | 'checking' | 'ready' | 'uploading' | 'success' | 'error';

export function createUploader() {
	let status = $state<AppStatus>('idle');

	let file = $state<File | null>(null);
	let result = $state<UploadResultWithUrl | null>(null);
	let errorMessage = $state<string | null>(null);
	let computedHash = $state('');

	let previewUrl = $state<string | null>(null);

	async function upload() {
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
			// The HEAD request is an optimization check, not strictly required.
			// If it fails (e.g. network error), allow upload anyway - the server
			// will handle duplicates via hash comparison during POST.
			status = 'ready';
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
		status = 'idle';
	}

	return {
		get status() {
			return status;
		},
		get file() {
			return file;
		},
		get result() {
			return result;
		},
		get errorMessage() {
			return errorMessage;
		},
		get computedHash() {
			return computedHash;
		},
		get previewUrl() {
			return previewUrl;
		},
		upload,
		processFile,
		reset
	};
}
