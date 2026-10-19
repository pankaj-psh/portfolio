    // @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://pankaj-psh.github.io/portfolio/
// Repo on GitHub must be named `portfolio` so this path matches.
// https://docs.astro.build/en/guides/deploy/github/
export default defineConfig({
	site: 'https://pankaj-psh.github.io',
	base: '/portfolio',
});
