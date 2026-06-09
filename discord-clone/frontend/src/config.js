const rawApiUrl = import.meta.env.VITE_API_URL || "";

// Ensure API_URL always ends with a single trailing slash
export const API_URL = rawApiUrl ? (rawApiUrl.endsWith("/") ? rawApiUrl : `${rawApiUrl}/`) : "/";
