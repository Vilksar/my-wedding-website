/**
 * Gets the color scheme after the page is loaded.
 * @returns The color scheme, or undefined.
 */
function getColorSchemeAfterLoad(): (string | undefined) {
    // Return the color scheme.
    return window.document.querySelector("html")?.getAttribute("data-color-scheme") ?? undefined;
}

/**
 * Sets the color scheme after the page is loaded.
 * @param colorScheme The color scheme.
 */
function setColorSchemeAfterLoad(colorScheme: string): void {
    // Set the current color scheme.
    window.document.querySelector<HTMLElement>("html")?.setAttribute("data-color-scheme", colorScheme);
    // Go over each color scheme button.
    window.document.querySelectorAll<HTMLButtonElement>(`button[data-color-scheme]`).forEach((colorSchemeButton) => {
        // Mark the button as inactive.
        colorSchemeButton.setAttribute("data-is-active", "false");
    });
    // Go over each matching color scheme button.
    window.document.querySelectorAll<HTMLButtonElement>(`button[data-color-scheme="${colorScheme}"]`).forEach((colorSchemeButton) => {
        // Mark the button as active.
        colorSchemeButton.setAttribute("data-is-active", "true");
    });
    // Try to store the color scheme to local storage.
    try {
        // Store the color scheme to local storage.
        window.localStorage.setItem("color-scheme", colorScheme);
    } catch (error) {
        // Get the error message, if it exists.
        const errorMessage: string = error instanceof Error ? error.message : "unknown error";
        // Log the error.
        console.log(`An error has occurred while trying to set the color scheme in local storage on button click: ${errorMessage}`)
    }
}

// Get and set the color scheme.
(() => {
    // Get the color scheme.
    const colorScheme: (string | undefined) = getColorSchemeAfterLoad();
    // Check if there is no color scheme.
    if (colorScheme === null || colorScheme === undefined) {
        // Return.
        return;
    }
    // Set the color scheme.
    setColorSchemeAfterLoad(colorScheme);
})();

// Go over each color scheme element.
window.document.querySelectorAll<HTMLDivElement>(`[data-component="color-schemes"]`).forEach((colorSchemeElement) => {
    // Go over each color scheme button.
    colorSchemeElement.querySelectorAll<HTMLButtonElement>(`button[data-color-scheme]`).forEach((colorSchemeButton) => {
        // Get the button color scheme.
        const buttonColorScheme: (string | null) = colorSchemeButton.getAttribute("data-color-scheme");
        // Check if there is no color scheme.
        if (buttonColorScheme === null || buttonColorScheme === undefined) {
            // Return.
            return;
        }
        // Add an event listener for clicking the color scheme button.
        colorSchemeButton.addEventListener("click", () => {
            // Get the current color scheme.
            const currentColorScheme: (string | undefined) = getColorSchemeAfterLoad();
            // Check if there is no current color scheme.
            if (currentColorScheme === null || currentColorScheme === undefined) {
                // Return.
                return;
            }
            // Check if the current color scheme is the same as the button color scheme.
            if (currentColorScheme === buttonColorScheme) {
                // Return.
                return;
            }
            // Set the color scheme.
            setColorSchemeAfterLoad(buttonColorScheme);
        });
    });
});
