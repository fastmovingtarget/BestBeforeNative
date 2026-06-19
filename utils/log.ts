export default function log(message: string, level: "info" | "warn" | "error" | "debug" = "info") {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}] ${message}`);
}