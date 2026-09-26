import { defineField, defineType } from "sanity";
import { imageField, withEn } from "./fields";

export const category = defineType({
  name: "category",
  title: "Catégorie",
  type: "document",
  fields: [
    ...withEn(defineField({ name: "title", title: "Nom", type: "string", validation: (r) => r.required() })),
    defineField({
      name: "slug",
      title: "Adresse (URL)",
      type: "slug",
      options: { source: "title", maxLength: 40 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "icon",
      title: "Icône",
      type: "string",
      options: {
        list: [
          { title: "Sport", value: "sport" },
          { title: "Lifestyle", value: "lifestyle" },
          { title: "Immobilier", value: "realestate" },
          { title: "Événements", value: "events" },
          { title: "Vidéo", value: "video" },
          { title: "Appareil photo", value: "camera" },
        ],
        layout: "radio",
      },
      initialValue: "camera",
    }),
    imageField("cover", "Image de couverture", { required: true }),
    ...withEn(defineField({ name: "description", title: "Phrase courte", type: "string" })),
    defineField({ name: "order", title: "Ordre d'affichage", type: "number", initialValue: 10 }),
  ],
  orderings: [{ title: "Ordre", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", media: "cover" } },
});
