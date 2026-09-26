import { defineArrayMember, defineField, defineType } from "sanity";
import { imageField, videoFields, withEn } from "./fields";

export const settings = defineType({
  name: "settings",
  title: "Réglages du site",
  type: "document",
  groups: [
    { name: "hero", title: "Accueil", default: true },
    { name: "about", title: "À propos" },
    { name: "contact", title: "Contact & réseaux" },
  ],
  fields: [
    defineField({ name: "heroEyebrow", title: "Petit titre", type: "string", group: "hero", initialValue: "TikoPix" }),
    ...withEn(defineField({ name: "heroTitle", title: "Grand titre", type: "string", group: "hero", initialValue: "Visual stories, captured with" })),
    ...withEn(defineField({ name: "heroAccent", title: "Mot en violet (écriture)", type: "string", group: "hero", initialValue: "intention" })),
    ...withEn(defineField({ name: "heroText", title: "Texte d'introduction", type: "text", rows: 3, group: "hero" })),
    imageField("heroImage", "Image d'accueil", { description: "Affichée pendant le chargement de la vidéo.", group: "hero" }),
    defineField({
      name: "heroLoop",
      title: "Vidéo d'ambiance en fond (MP4 court, sans son)",
      type: "file",
      group: "hero",
      options: { accept: "video/mp4,video/webm" },
      description: "10 à 20 secondes, en boucle. Idéalement moins de 15 Mo.",
    }),
    defineField({
      name: "showreel",
      title: "Showreel",
      type: "object",
      group: "hero",
      fields: videoFields(),
    }),
    ...withEn(defineField({ name: "specialtiesTitle", title: "Titre des spécialités", type: "string", group: "hero" })),
    ...withEn(defineField({ name: "specialtiesText", title: "Texte des spécialités", type: "text", rows: 3, group: "hero" })),
    ...withEn(defineField({ name: "lensTitle", title: "Titre section 3D (objectif)", type: "string", group: "hero" })),
    ...withEn(defineField({ name: "lensText", title: "Texte section 3D", type: "text", rows: 3, group: "hero" })),

    ...withEn(defineField({ name: "aboutTitle", title: "Titre", type: "string", group: "about", initialValue: "Derrière l'objectif" })),
    ...withEn(defineField({ name: "aboutBio", title: "Présentation", type: "text", rows: 5, group: "about" })),
    ...withEn(defineField({ name: "aboutMission", title: "Mission", type: "text", rows: 3, group: "about" })),
    imageField("portrait", "Portrait", { description: "Affiché en noir et blanc.", group: "about" }),
    defineField({ name: "signature", title: "Signature", type: "string", group: "about", initialValue: "Djonko Seydi" }),
    defineField({
      name: "skills",
      title: "Compétences",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icône",
              type: "string",
              options: { list: ["camera", "video", "palette", "tools", "pin"] },
            }),
            ...withEn(defineField({ name: "label", title: "Titre", type: "string" })),
            ...withEn(defineField({ name: "value", title: "Détail", type: "string" })),
          ],
        }),
      ],
    }),

    ...withEn(defineField({ name: "ctaText", title: "Phrase finale", type: "string", group: "contact", initialValue: "Let's create something great." })),
    imageField("ctaImage", "Image de fond finale", { group: "contact" }),
    defineField({ name: "email", title: "Courriel", type: "string", group: "contact", validation: (r) => r.email() }),
    defineField({ name: "instagram", title: "Instagram (lien)", type: "url", group: "contact" }),
    defineField({ name: "youtube", title: "YouTube (lien)", type: "url", group: "contact" }),
    defineField({ name: "handle", title: "Pseudo affiché", type: "string", group: "contact", initialValue: "@tiko.pix" }),
    ...withEn(defineField({ name: "city", title: "Ville", type: "string", group: "contact", initialValue: "Montréal, Québec" })),
  ],
  preview: { prepare: () => ({ title: "Réglages du site" }) },
});
