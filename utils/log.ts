
/**
 * Logs a message to the console with a timestamp and specified log level.
 * @param {string} message - The message to log.
 * @param {"info" | "warn" | "error" | "debug"} [level="info"] - The log level (default is "info").
 * @returns {void} No return value.
 */
export default function log(message: string, level: "info" | "warn" | "error" | "debug" = "info") {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}] ${message}`);
}