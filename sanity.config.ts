"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "tikopix",
  title: "TikoPix Studio",
  basePath: "/studio",
  projectId: projectId || "unconfigured",
  dataset,
  schema: {
    types: schemaTypes,
    // "settings" is a singleton: hide it from the "new document" menu.
    templates: (templates) => templates.filter((t) => t.schemaType !== "settings"),
  },
  document: {
    actions: (actions, ctx) =>
      ctx.schemaType === "settings"
        ? actions.filter((a) => a.action && ["publish", "discardChanges", "restore"].includes(a.action))
        : actions,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
