export interface UploadResult {
	hash: string;
	filename: string;
	existing: boolean;
	error?: string;
}

export interface UploadResultWithUrl extends UploadResult {
	url: string;
}
