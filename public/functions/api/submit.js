/**
 * Runs the code on each GET request at "/api/submit".
 * @param context The context.
 * @returns The response.
 */
export async function onRequestGet(context) {
    // Log the context.
    console.log(JSON.stringify(context));
    // Return a response.
    return new Response("Hello!");
}
