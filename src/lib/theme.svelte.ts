import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

class ThemeState {
	value = $state<Theme>('light');

	constructor() {
		if (browser) {
			const saved = localStorage.getItem('theme') as Theme | null;
			if (saved === 'light' || saved === 'dark') {
				this.value = saved;
			} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				this.value = 'dark';
			}

			// Initialize DOM on first load if necessary
			document.documentElement.setAttribute('data-theme', this.value);
		}
	}

	toggle() {
		this.value = this.value === 'light' ? 'dark' : 'light';

		if (browser) {
			document.documentElement.setAttribute('data-theme', this.value);
			localStorage.setItem('theme', this.value);
		}
	}
}

export const theme = new ThemeState();
