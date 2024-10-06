/**
 * Gets the color scheme before the page is loaded.
 * @returns The color scheme.
 */
const getColorSchemeBeforeLoad = () => {
    // Define a function to return the color scheme from local storage.
    const getFromLocalStorage = () => {
        // Check if there is no local storage.
        if (window.localStorage === null || window.localStorage === undefined) {
            // Return undefined.
            return undefined;
        }
        // Get the color scheme from local storage.
        const colorSchemeFromLocalStorage = window.localStorage.getItem("color-scheme");
        // Check if there is no color scheme from local storage.
        if (colorSchemeFromLocalStorage === null || colorSchemeFromLocalStorage === undefined) {
            // Return undefined.
            return undefined;
        }
        // Check if the color scheme from local storage is invalid.
        if (!["light", "dark"].includes(colorSchemeFromLocalStorage)) {
            // Return undefined.
            return undefined;
        }
        // Return the color scheme from local storage.
        return colorSchemeFromLocalStorage;
    }
    // Define a function to return the color scheme from system.
    const getFromSystem = () => {
        // Overwrite and return the color scheme from system.
        return false && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };
    // Get the color scheme from local storage.
    const colorSchemeFromLocalStorage = getFromLocalStorage();
    // Check if there is a color scheme from local storage.
    if (colorSchemeFromLocalStorage !== null && colorSchemeFromLocalStorage !== undefined) {
        // Return the color scheme from local storage.
        return colorSchemeFromLocalStorage;
    }
    // Return the color scheme from system.
    return getFromSystem();
};

/**
 * Sets the color scheme before the page is loaded.
 * @param colorScheme The color scheme.
 */
const setColorSchemeBeforeLoad = (colorScheme) => {
    // Set the color scheme.
    window.document.querySelector("html")?.setAttribute("data-color-scheme", colorScheme);
    // Try to store the color scheme to local storage.
    try {
        // Store the color scheme to local storage.
        window.localStorage.setItem("color-scheme", colorScheme);
    } catch (error) {
        // Get the error message, if it exists.
        const errorMessage = error instanceof Error ? error.message : "unknown error";
        // Log the error.
        console.log(`An error has occurred while trying to set the color scheme in local storage on initialization: ${errorMessage}`)
    }
};

// Get the color scheme.
const colorScheme = getColorSchemeBeforeLoad();

// Set the color scheme.
setColorSchemeBeforeLoad(colorScheme);
