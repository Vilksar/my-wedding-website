// Import the Astro scripts.
import type { ImageMetadata } from "astro";
import type { InferEntrySchema } from "astro:content";
import { getCollection } from "astro:content";

// Import the project scripts.
import { constants } from "../content/config";

/**
 * Loads the logo.
 * @returns The logo.
 */
async function loadLogo(): Promise<string> {
    // Load the logo.
    const { default: logo }: { default: string } = await import(`../../public/favicon.svg?raw`);
    // Check if there is no logo.
    if (logo === null || logo === undefined) {
        // Throw an error.
        throw new Error(`The logo does not exist.`);
    }
    // Return the logo.
    return logo;
}

/**
 * Loads the icon IDs.
 * @returns The icon IDs.
 */
function loadIconIds(): string[] {
    // Define the path regular expression.
    const pathRegExp = /^\.\.\/assets\/icons\/([\w\d\-]+)\.svg$/g;
    // Define the icon IDs.
    const iconIds = [];
    // Load the paths.
    const paths = Object.keys(import.meta.glob("../assets/icons/*.svg"));
    // Go over each path.
    for (const path of paths) {
        // Get the match against the path regular expression.
        const match = [...path.matchAll(pathRegExp)][0];
        // Check if there is no match.
        if (match === null || match === undefined) {
            // Continue.
            continue;
        }
        // Get the capture within the match.
        const capture = match[1];
        // Check if there is no capture.
        if (capture === null || capture === undefined) {
            // Continue.
            continue;
        }
        // Add the capture to the icon IDs.
        iconIds.push(capture);
    }
    // Return the icon IDs.
    return iconIds;
}

/**
 * Loads an icon by ID.
 * @param iconId The icon ID.
 * @returns The icon.
 */
async function loadIconById(iconId: string): Promise<string> {
    // Get the icon.
    const { default: icon }: { default: string } = await import(`../assets/icons/${iconId}.svg?raw`);
    // Check if there is no icon.
    if (icon === null || icon === undefined) {
        // Throw an error.
        throw new Error(`The icon with the ID "${iconId}" does not exist.`);
    }
    // Return the icon.
    return icon;
}

/**
 * Loads the image IDs.
 * @returns The image IDs.
 */
function loadImageIds(): string[] {
    // Define the path regular expression.
    const pathRegExp = /^\.\.\/assets\/images\/([\w\d\-]+)\.webp$/g;
    // Define the image IDs.
    const imageIds = [];
    // Load the paths.
    const paths = Object.keys(import.meta.glob("../assets/images/*.webp"));
    // Go over each path.
    for (const path of paths) {
        // Get the match against the path regular expression.
        const match = [...path.matchAll(pathRegExp)][0];
        // Check if there is no match.
        if (match === null || match === undefined) {
            // Continue.
            continue;
        }
        // Get the capture within the match.
        const capture = match[1];
        // Check if there is no capture.
        if (capture === null || capture === undefined) {
            // Continue.
            continue;
        }
        // Add the capture to the image IDs.
        imageIds.push(capture);
    }
    // Return the image IDs.
    return imageIds;
}

/**
 * Loads an image by ID.
 * @param imageId The image ID.
 * @returns The image.
 */
async function loadImageById(imageId: string): Promise<ImageMetadata> {
    // Load the image.
    const { default: image }: { default: ImageMetadata } = await import(`../assets/images/${imageId}.webp`);
    // Check if there is no image.
    if (image === null || image === undefined) {
        // Throw an error.
        throw new Error(`The image with the ID "${imageId}" does not exist.`);
    }
    // Return the image.
    return image;
}

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
 * Represents the logo.
 */
const logo = await loadLogo();

/**
 * Represents the assets.
 */
const assets = {
    icons: await loadIconIds()
        .reduce(async (accumulator, iconId) => ({
            ...(await accumulator), [iconId]: await loadIconById(iconId)
        }), Promise.resolve({} as { [key: string]: string })),
    images: await loadImageIds()
        .reduce(async (accumulator, imageId) => ({
            ...(await accumulator), [imageId]: await loadImageById(imageId)
        }), Promise.resolve({} as { [key: string]: ImageMetadata }))
};

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
 * Gets an icon.
 * @returns The icon.
 */
export function getIcon(iconId: string): string {
    // Get the icon.
    const icon = assets.icons[iconId];
    // Check if there is no icon.
    if (icon === null || icon === undefined) {
        // Throw an error.
        throw new Error(`An icon with the ID "${iconId}" does not exist.`);
    }
    // Return the icon.
    return icon;
}

/**
 * Gets an icon.
 * @returns The icon.
 */
export function getImage(imageId: string): ImageMetadata {
    // Get the image.
    const image = assets.images[imageId];
    // Check if there is no image.
    if (image === null || image === undefined) {
        // Throw an error.
        throw new Error(`An image with the ID "${imageId}" does not exist.`);
    }
    // Return the image.
    return image;
}

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

/**
 * Gets the application logo.
 * @returns The application logo.
 */
export function getAppLogo(): string {
    // Return the logo.
    return logo;
}

/**
 * Gets the application title.
 * @param languageId The language ID.
 * @returns The application title.
 */
export function getAppTitle(languageId: (string | undefined)) {
    // Check if there is no language ID provided.
    if (languageId === null || languageId === undefined || languageId === "") {
        // Return the default application title.
        return constants["./app/title"];
    }
    // Return the translated application title.
    return getTranslation(languageId, "./app/title")
}
