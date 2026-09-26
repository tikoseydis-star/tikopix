import { defineArrayMember, defineField, defineType } from "sanity";
import { imageField, videoFields } from "./fields";

export const project = defineType({
  name: "project",
  title: "Projet",
  type: "document",
  groups: [
    { name: "main", title: "Essentiel", default: true },
    { name: "media", title: "Photos & vidéo" },
    { name: "details", title: "Détails" },
  ],
  fields: [
    defineField({ name: "title", title: "Titre", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Adresse (URL)",
      type: "slug",
      group: "main",
      options: { source: "title", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "reference",
      to: [{ type: "category" }],
      group: "main",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Quelques mots",
      type: "text",
      rows: 2,
      group: "main",
      description: "Une ou deux phrases maximum. Laisse les images parler.",
      validation: (r) => r.max(200),
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "string",
      group: "main",
      description: "Ex. : Photographie / Vidéo",
    }),
    defineField({
      name: "featured",
      title: "Mettre en vedette sur l'accueil",
      type: "boolean",
      group: "main",
      initialValue: false,
    }),
    imageField("cover", "Image principale", { required: true, description: "L'image qui représente le projet.", group: "main" }),
    defineField({
      name: "gallery",
      title: "Galerie",
      type: "array",
      group: "media",
      description: "Glisse plusieurs photos d'un coup. Réordonne-les par glisser-déposer.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Description courte", type: "string" })],
        }),
      ],
      options: { layout: "grid" },
    }),
    ...videoFields().map((f) => ({ ...f, group: "media" })),
    defineField({ name: "eyebrow", title: "Petit titre (optionnel)", type: "string", group: "details", description: "Remplace le nom de la catégorie au-dessus du titre. Ex. : Vidéo cinématique" }),
    defineField({ name: "client", title: "Client", type: "string", group: "details" }),
    defineField({ name: "location", title: "Lieu", type: "string", group: "details" }),
    defineField({ name: "year", title: "Année", type: "string", group: "details" }),
    defineField({ name: "order", title: "Ordre d'affichage", type: "number", group: "details", initialValue: 10 }),
  ],
  orderings: [
    { title: "Ordre", name: "order", by: [{ field: "order", direction: "asc" }] },
    { title: "Plus récents", name: "recent", by: [{ field: "_createdAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", media: "cover", category: "category.title", featured: "featured" },
    prepare: ({ title, media, category, featured }) => ({
      title,
      media,
      subtitle: `${category ?? "Sans catégorie"}${featured ? " · ★ En vedette" : ""}`,
    }),
  },
});
