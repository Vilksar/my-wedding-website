// Import the Astro configuration.
import { defineConfig } from 'astro/config';

// Import the configurations for the Astro integrations.
import tailwind from "@astrojs/tailwind";

// Define and export the Astro configuration.
export default defineConfig({
    integrations: [
        tailwind()
    ]
});
