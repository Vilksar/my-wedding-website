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
        .reduce((accumulator, data) => ({ ...accumulator, [data.id]: data }), {} as { [key: string]: InferEntrySchema<"colorSchemes"> }),
    languages: (await getCollection("languages"))
        .filter(entry => ensureEntryId(entry))
        .map(entry => entry.data)
        .toSorted((data1, data2) => data1.id.localeCompare(data2.id))
        .reduce((accumulator, data) => ({ ...accumulator, [data.id]: data }), {} as { [key: string]: InferEntrySchema<"languages"> }),
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
 * Gets a language.
 * @returns The language.
 */
export function getLanguage(languageId: string): InferEntrySchema<"languages"> {
    // Get the language.
    const language = content.languages[languageId];
    // Check if there is no language.
    if (language === null || language === undefined) {
        // Throw an error.
        throw new Error(`A language with the ID "${languageId}" does not exist.`);
    }
    // Return the language.
    return language;
}

/**
 * Gets the color schemes.
 * @returns The color schemes.
 */
export function getColorSchemes(): InferEntrySchema<"colorSchemes">[] {
    // Return the color schemes.
    return Object.values(content.colorSchemes);
}

/**
 * Gets the languages.
 * @returns The languages.
 */
export function getLanguages(): InferEntrySchema<"languages">[] {
    // Return the color schemes.
    return Object.values(content.languages);
}

/**
 * Gets a translation.
 * @param languageId The language ID.
 * @param translationId The translation ID.
 * @param parameters The parameters.
 * @returns The translation.
 */
export function getTranslation(languageId: string, translationId: string, parameters?: string[]): string {
    // Get the translation.
    const translation = getLanguage(languageId).translations?.[translationId];
    // Check if there is no translation.
    if (translation === null || translation === undefined) {
        // Throw an error.
        throw new Error(`The translation with ID "${translationId}" for language with ID "${languageId}" does not exist.`);
    }
    // Return the translation.
    return parameters?.reduce((accumulator, parameter, index) => accumulator.replaceAll(`{${index}}`, parameter), translation) ?? translation;
}

/**
 * Gets the localized route for an URL, by replacing the language ID if it exists, or adding it if not.
 * @param url The URL.
 * @param oldLanguageId The old language ID.
 * @param newLanguageId The new language ID.
 * @returns The localized route.
 */
export function getLocalizedRoute(url: string, oldLanguageId: (string | undefined), newLanguageId: (string | undefined)): string {
    // Check if there is no old language ID and no new language ID.
    if ((oldLanguageId === null || oldLanguageId === undefined) && (newLanguageId === null || newLanguageId === undefined)) {
        // Return the URL.
        return url;
    }
    // Check if there is no old language ID.
    if (oldLanguageId === null || oldLanguageId === undefined) {
        // Return the URL with the language ID added.
        return url.replace(`/`, `/${newLanguageId}/`);
    }
    // Check if there is no new language ID.
    if (newLanguageId === null || newLanguageId === undefined) {
        // Return the URL with the language ID removed.
        return url.replace(`/${oldLanguageId}/`, `/`);
    }
    // Return the URL with the language ID replaced.
    return url.replace(`/${oldLanguageId}/`, `/${newLanguageId}/`);
}
