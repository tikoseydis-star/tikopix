/**
 * TikoPix's Sanity project. The project ID is public (it is visible in every API
 * request), so it lives in the code: no hosting env var needed. An env var can
 * still override it (e.g. to point a copy of the site at another project).
 */
const TIKOPIX_PROJECT_ID = "vyy136yn";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || TIKOPIX_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2025-10-01";

/** false → the site runs on the local demo seed and /studio shows setup steps. */
export const sanityConfigured = /^[a-z0-9]{6,}$/.test(projectId);
