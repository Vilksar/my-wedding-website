// Import the Tailwind plugin.
import plugin from "tailwindcss/plugin";

// Define and export the Tailwind configuration.
/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"
	],
	theme: {
		extend: {}
	},
	plugins: [
		plugin(function({addVariant}) {
			addVariant(`light`, `html[data-color-scheme="light"] &`);
			addVariant(`dark`, `html[data-color-scheme="dark"] &`);
		})
	]
}
