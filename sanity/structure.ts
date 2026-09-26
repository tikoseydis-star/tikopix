import type { StructureResolver } from "sanity/structure";

/** Tiko's sidebar: projects first, then categories, then the single settings document. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("TikoPix")
    .items([
      S.documentTypeListItem("project").title("Projets"),
      S.documentTypeListItem("category").title("Catégories"),
      S.divider(),
      S.listItem()
        .title("Réglages du site")
        .id("settings")
        .child(S.document().schemaType("settings").documentId("settings").title("Réglages du site")),
    ]);
