export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2025-10-01";

/** false → the site runs on the local demo seed and /studio shows setup steps. */
export const sanityConfigured = /^[a-z0-9]{6,}$/.test(projectId);
