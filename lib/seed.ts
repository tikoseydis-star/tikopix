/**
 * DEVELOPMENT SEED CONTENT.
 *
 * Used only while the Sanity Studio is not connected (no NEXT_PUBLIC_SANITY_PROJECT_ID)
 * so the site renders fully. Photos are free Unsplash / Pexels demo media and are
 * replaced by Tiko's own work as soon as the Studio has content.
 */
import type { Category, Img, Project, Settings } from "./types";

function u(id: string, alt: string, ratio = 3 / 2): Img {
  const width = 2400;
  const height = Math.round(width / ratio);
  return {
    src: `https://images.unsplash.com/photo-${id}?w=${width}&h=${height}&fit=crop&auto=format&q=80`,
    alt,
    width,
    height,
  };
}

const IMG = {
  cityDusk: u("1519501025264-65ba15a82390", "Rue de centre-ville au crépuscule"),
  soccerFoot: u("1574629810360-7efbbe195018", "Joueur de soccer frappant le ballon", 4 / 5),
  nightField: u("1431324155629-1a6deb1dec8d", "Terrain de soccer éclairé la nuit"),
  whiteHouse: u("1600596542815-ffad4c1539a9", "Maison moderne blanche avec piscine"),
  houseEvening: u("1600585154340-be6161a56a0c", "Maison contemporaine illuminée en soirée"),
  interior: u("1600607687939-ce8a6c25118c", "Salon lumineux à aire ouverte"),
  conference: u("1540575467063-178a50c2df87", "Public d'une conférence"),
  concertFire: u("1470229722913-7c0e2dbbafd3", "Scène de concert en contre-jour", 4 / 5),
  crowd: u("1501386761578-eac5c94b800a", "Foule en délire pendant un concert"),
  photographer: u("1492691527719-9d1e07e534b4", "Photographe au sommet d'une montagne", 4 / 5),
  fieldMan: u("1503023345310-bd7c1de61c7d", "Homme de dos dans un champ doré", 4 / 5),
  smile: u("1492562080023-ab3db95bfbce", "Portrait lifestyle en extérieur", 4 / 5),
  porsche: u("1503376780353-7e6692767b70", "Voiture sport de nuit sur l'autoroute"),
  garage: u("1492144534655-ae79c964c9d7", "Voiture blanche dans un stationnement sombre"),
  milkyWay: u("1519681393784-d120267933ba", "Montagnes sous la voie lactée", 16 / 9),
  cyclists: u("1517649763962-0c623066013b", "Peloton de cyclistes"),
  hoop: u("1546519638-68e109498ffc", "Ballon de basketball tombant dans le panier"),
  arena: u("1504450758481-7338eba7524a", "Aréna de basketball pleine"),
  purpleConcert: u("1506157786151-b8491531f063", "Concert sous lumières violettes"),
  banquet: u("1511578314322-379afb476865", "Salle de réception corporative"),
  villa: u("1512917774080-9991f1c4c750", "Villa blanche avec piscine"),
  cozy: u("1502672260266-1c1ef2d93688", "Intérieur chaleureux avec plantes", 4 / 5),
  nycStreet: u("1449824913935-59a10b8d2000", "Grande avenue entre les gratte-ciels"),
  nightSea: u("1534447677768-be436bb09401", "Ciel étoilé reflété sur l'eau"),
  sprinter: u("1461896836934-ffe607ba8211", "Sprinteur dans les blocs de départ"),
  runners: u("1552674605-db6ffd4facb5", "Coureurs en silhouette sous les projecteurs", 4 / 5),
  neon: u("1508700115892-45ecd05ae2ad", "Enseigne néon sur un mur de brique"),
  portraitMan: u("1500648767791-00dcc994a43e", "Portrait studio d'un homme", 4 / 5),
  portraitWoman: u("1531746020798-e6953c6e8e04", "Portrait studio d'une femme", 4 / 5),
  yellow: u("1515886657613-9f3515b0c78f", "Tenue jaune sur un terrain de basketball", 4 / 5),
  houseDusk: u("1583337130417-3346a1be7dee", "Façade de maison au coucher du soleil"),
  towers: u("1486406146926-c627a92ad1ab", "Gratte-ciels en contre-plongée", 4 / 5),
  balls: u("1551958219-acbc608c6377", "Ballons de soccer sur le gazon"),
  ballFoot: u("1579952363873-27f3bade9f55", "Pied posé sur un ballon", 4 / 5),
};

export const seedCategories: Category[] = [
  { slug: "sport", title: "Sport", icon: "sport", cover: IMG.runners, description: "L'intensité du jeu, au bon moment." },
  { slug: "lifestyle", title: "Lifestyle", icon: "lifestyle", cover: IMG.fieldMan, description: "Des gens, des lieux, une atmosphère." },
  { slug: "immobilier", title: "Immobilier", icon: "realestate", cover: IMG.houseEvening, description: "Des espaces qui donnent envie d'y vivre." },
  { slug: "evenements", title: "Événements", icon: "events", cover: IMG.purpleConcert, description: "L'énergie d'un moment, pour toujours." },
];

const cat = (slug: string) => {
  const c = seedCategories.find((x) => x.slug === slug)!;
  return { slug: c.slug, title: c.title };
};

export const seedProjects: Project[] = [
  {
    slug: "match-day",
    title: "Match Day",
    category: cat("sport"),
    services: "Photographie / Vidéo",
    summary: "Une soirée sous les projecteurs. La tension, la sueur, le but.",
    cover: IMG.nightField,
    gallery: [IMG.soccerFoot, IMG.balls, IMG.ballFoot, IMG.sprinter],
    client: "Club local",
    location: "Montréal",
    year: "2025",
    featured: true,
  },
  {
    slug: "montreal-vibes",
    title: "Montréal Vibes",
    category: cat("lifestyle"),
    services: "Vidéo / Photographie",
    summary: "La ville la nuit, ses lumières et ceux qui la font vivre.",
    cover: IMG.nycStreet,
    gallery: [IMG.fieldMan, IMG.neon, IMG.nightSea, IMG.towers],
    location: "Montréal",
    year: "2025",
    featured: true,
  },
  {
    slug: "projet-residentiel",
    title: "Projet Résidentiel",
    category: cat("immobilier"),
    services: "Photographie HDR",
    summary: "Lumière naturelle, lignes nettes. Une maison qui respire.",
    cover: IMG.interior,
    gallery: [IMG.houseEvening, IMG.whiteHouse, IMG.cozy, IMG.houseDusk],
    client: "Courtier immobilier",
    location: "Laval",
    year: "2025",
    featured: true,
  },
  {
    slug: "night-drive",
    title: "Night Drive",
    category: cat("lifestyle"),
    eyebrow: "Vidéo cinématique",
    services: "Montage / Colorimétrie",
    summary: "Une virée nocturne, étalonnée pour le ressenti.",
    cover: IMG.porsche,
    gallery: [IMG.garage],
    video: { file: "https://videos.pexels.com/video-files/10603138/10603138-hd_1920_1080_25fps.mp4", poster: IMG.porsche },
    year: "2025",
    featured: true,
  },
  {
    slug: "courts-la-nuit",
    title: "Courts la nuit",
    category: cat("sport"),
    services: "Photographie",
    summary: "Le basket comme un spectacle.",
    cover: IMG.hoop,
    gallery: [IMG.arena, IMG.runners, IMG.yellow],
    year: "2024",
    featured: false,
  },
  {
    slug: "tour-de-l-ile",
    title: "Tour de l'Île",
    category: cat("sport"),
    services: "Photographie / Vidéo",
    summary: "Vitesse, effort et peloton serré.",
    cover: IMG.cyclists,
    gallery: [IMG.sprinter, IMG.runners],
    location: "Montréal",
    year: "2024",
    featured: false,
  },
  {
    slug: "villa-horizon",
    title: "Villa Horizon",
    category: cat("immobilier"),
    services: "Photographie / Drone",
    summary: "Architecture blanche, eau turquoise.",
    cover: IMG.villa,
    gallery: [IMG.whiteHouse, IMG.towers, IMG.cozy],
    year: "2024",
    featured: false,
  },
  {
    slug: "live-sessions",
    title: "Live Sessions",
    category: cat("evenements"),
    services: "Photographie / Vidéo",
    summary: "Le son, la foule, l'instant.",
    cover: IMG.purpleConcert,
    gallery: [IMG.concertFire, IMG.crowd, IMG.arena],
    year: "2025",
    featured: false,
  },
  {
    slug: "sommet-corporatif",
    title: "Sommet Corporatif",
    category: cat("evenements"),
    services: "Couverture événementielle",
    summary: "Une journée de conférences racontée en images.",
    cover: IMG.conference,
    gallery: [IMG.banquet],
    client: "Entreprise privée",
    year: "2024",
    featured: false,
  },
  {
    slug: "portraits",
    title: "Portraits",
    category: cat("lifestyle"),
    services: "Photographie",
    summary: "Des visages, de la vérité.",
    cover: IMG.portraitMan,
    gallery: [IMG.portraitWoman, IMG.smile, IMG.yellow],
    year: "2025",
    featured: false,
  },
];

export const seedSettings: Settings = {
  name: "TikoPix",
  heroEyebrow: "TikoPix",
  heroTitle: "Visual stories, captured with",
  heroAccent: "intention",
  heroText:
    "Photographe et vidéaste basé à Montréal. Je crée des contenus visuels qui racontent des histoires authentiques, avec une attention particulière aux détails, à la lumière et à l'émotion.",
  heroImage: IMG.cityDusk,
  heroLoop: "https://videos.pexels.com/video-files/9331341/9331341-hd_1280_720_30fps.mp4",
  showreel: {
    file: "https://videos.pexels.com/video-files/2248563/2248563-hd_1920_1080_24fps.mp4",
    poster: IMG.cityDusk,
  },
  specialtiesTitle: "Différents univers, une même vision.",
  specialtiesText:
    "Que ce soit pour le sport, le lifestyle, l'immobilier ou des événements, je capture l'essence de chaque projet avec une approche créative et professionnelle.",
  lensTitle: "Chaque image commence par une intention.",
  lensText:
    "Avant de déclencher, je regarde. La lumière, le geste, le moment exact où tout s'aligne. C'est là que l'histoire se raconte.",
  aboutTitle: "Derrière l'objectif",
  aboutBio:
    "Je m'appelle Djonko Seydi, je suis photographe et vidéaste basé à Montréal. Passionné par l'image depuis plusieurs années, j'ai développé un regard unique que je mets au service de projets variés : sport, lifestyle, immobilier et plus encore.",
  aboutMission:
    "Mon objectif est simple : créer des visuels qui ont du sens, qui éveillent des émotions et qui laissent une impression durable.",
  portrait: IMG.photographer,
  signature: "Djonko Seydi",
  skills: [
    { icon: "camera", label: "Photographie", value: "4+ ans d'expérience" },
    { icon: "video", label: "Vidéo", value: "1 an sur DaVinci Resolve" },
    { icon: "palette", label: "Colorimétrie", value: "Balance des blancs · Exposition" },
    { icon: "tools", label: "Logiciels", value: "Lightroom · DaVinci Resolve (Premiere Pro en apprentissage)" },
    { icon: "pin", label: "Base", value: "Montréal, Québec" },
  ],
  ctaText: "Let's create something great.",
  ctaImage: IMG.milkyWay,
  email: "hello@tikopix.com",
  instagram: "https://instagram.com/tiko.pix",
  youtube: "https://youtube.com/@tikopix",
  handle: "@tiko.pix",
  city: "Montréal, Québec",
};
