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
    }),
    "languages": defineCollection({
        type: "data",
        schema: ({ image }) => z.object({
            id: z.string(),
            emoji: z.string(),
            icon: image(),
            direction: z.union([z.literal("ltr"), z.literal("rtl")]),
            nativeName: z.string(),
            translations: z.record(z.string(), z.string()),
        })
    })
};
