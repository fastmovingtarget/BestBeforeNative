
/**
 * Logs a message to the console with a timestamp and specified log level.
 * @param {string} message - The message to log.
 * @param {"info" | "warn" | "error" | "debug"} [level="info"] - The log level (default is "info").
 * @returns {void} No return value.
 */
export default function log(message: string, level: "info" | "warn" | "error" | "debug" = "info") {
    const timestamp = new Date();
    const timeStampDateString = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1).toString().padStart(2, '0')}-${timestamp.getDate().toString().padStart(2, '0')}`; 
    const timeStampTimeString = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}:${timestamp.getSeconds().toString().padStart(2, '0')}.${timestamp.getMilliseconds().toString().padStart(3, '0')}`;
    const timeStampString = `${timeStampDateString} ${timeStampTimeString}`;
    console[level](`${timeStampString}: ${message}`);
}