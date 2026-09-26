import { defineField } from "sanity";

/** Image with hotspot (Tiko chooses the focal point) and a required description for accessibility/SEO. */
export function imageField(name: string, title: string, options: { required?: boolean; description?: string; group?: string } = {}) {
  return defineField({
    name,
    title,
    type: "image",
    description: options.description,
    group: options.group,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Description courte",
        type: "string",
        description: "Ce qu'on voit sur la photo (pour Google et l'accessibilité).",
      }),
    ],
    validation: options.required ? (r) => r.required() : undefined,
  });
}

export function videoFields() {
  return [
    defineField({
      name: "videoFile",
      title: "Fichier vidéo (MP4)",
      type: "file",
      options: { accept: "video/mp4,video/webm,video/quicktime" },
      description: "Glisse ton MP4 ici. Idéalement 1080p, moins de 100 Mo.",
    }),
    defineField({
      name: "videoUrl",
      title: "…ou lien YouTube / Vimeo",
      type: "url",
      validation: (r) => r.uri({ scheme: ["https"] }),
    }),
  ];
}
