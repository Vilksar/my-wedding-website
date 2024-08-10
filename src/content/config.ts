// Import the node modules.
import { z, defineCollection } from 'astro:content';

/**
 * Represents the collections.
 */
export const collections = {
    "colorSchemes": defineCollection({
        type: "data",
        schema: ({ image }) => z.object({
            id: z.string(),
            emoji: z.string(),
            icon: image(),
            index: z.number()
        })
    })
};
