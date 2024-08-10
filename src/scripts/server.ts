// Import the Astro scripts.
import type { InferEntrySchema } from "astro:content";
import { getCollection } from "astro:content";

/**
 * Ensures that an entry has a consistent ID.
 * @param entry The entry.
 * @returns True if the entry has a consistent ID.
 */
function ensureEntryId(entry: { id: string, collection: string, data: { id: string } }): boolean {
    // Check if the entry ID is different from the entry data ID.
    if (entry.id !== entry.data.id) {
        // Throw an error.
        throw new Error(`The entry with the ID "${entry.data.id}" has an inconsistent data ID "${entry.data.id}" in the collection "${entry.collection}".`);
    }
    // Return true.
    return true;
}

/**
 * Represents the content.
 */
const content = {
    colorSchemes: (await getCollection("colorSchemes"))
        .filter(entry => ensureEntryId(entry))
        .map(entry => entry.data)
        .toSorted((data1, data2) => data1.index - data2.index)
        .reduce((accumulator, data) => ({ ...accumulator, [data.id]: data }), {} as { [key: string]: InferEntrySchema<"colorSchemes"> })
};

/**
 * Gets a color scheme.
 * @returns The color scheme.
 */
export function getColorScheme(colorSchemeId: string): InferEntrySchema<"colorSchemes"> {
    // Get the color scheme.
    const colorScheme = content.colorSchemes[colorSchemeId];
    // Check if there is no color scheme.
    if (colorScheme === null || colorScheme === undefined) {
        // Throw an error.
        throw new Error(`A color scheme with the ID "${colorSchemeId}" does not exist.`);
    }
    // Return the color scheme.
    return colorScheme;
}

/**
 * Gets the color schemes.
 * @returns The color schemes.
 */
export function getColorSchemes(): InferEntrySchema<"colorSchemes">[] {
    // Return the color schemes.
    return Object.values(content.colorSchemes);
}
