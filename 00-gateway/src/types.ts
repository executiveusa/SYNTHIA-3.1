export interface BtnListType {
  label: string;
  link: string;
  icon: string;
  newTab: boolean;
  isLocked?: boolean;
}

export interface ProjectListType {
  id: number;
  name: string;
  subHeading: string;
  description: string;
  demoLink: string;
  sourceLink: string;
  techStack: string[];
}

// ─── Avatar Wardrobe ─────────────────────────────────────────────────────────

export type AvatarOutfit =
  | "wizard"       // default
  | "streetwear"
  | "suit"
  | "hoodie"
  | "futuristic";

export type AvatarBackground =
  | "forest"
  | "city"
  | "space"
  | "beach"
  | "studio"
  | "none";

export type AvatarVoice =
  | "es-MX-female"
  | "es-MX-male"
  | "en-US-female"
  | "en-US-male";

export interface WardrobeItem {
  id: AvatarOutfit;
  label: string;
  labelEs: string;
  previewEmoji: string;
  /** Material name → color hex — applied as emissive tint at runtime */
  materialOverrides: Record<string, string>;
  locked: boolean;
  price?: number; // USD cents for upsell
}

export const OUTFITS: WardrobeItem[] = [
  {
    id: "wizard",
    label: "Wizard (Default)",
    labelEs: "Mago",
    previewEmoji: "🧙",
    materialOverrides: {},
    locked: false,
  },
  {
    id: "streetwear",
    label: "Streetwear",
    labelEs: "Urbano",
    previewEmoji: "🧢",
    materialOverrides: { BLN_shirt: "#1a1a2e", BLN_Pants: "#16213e" },
    locked: true,
    price: 1997,
  },
  {
    id: "suit",
    label: "Business Suit",
    labelEs: "Traje",
    previewEmoji: "👔",
    materialOverrides: {
      BLN_shirt: "#f5f5f5",
      BLN_Lower_coat: "#1c1c1c",
      BLN_upper_coat: "#1c1c1c",
    },
    locked: true,
    price: 1997,
  },
  {
    id: "hoodie",
    label: "Hoodie",
    labelEs: "Sudadera",
    previewEmoji: "🏃",
    materialOverrides: { BLN_shirt: "#2d2d2d", BLN_Lower_coat: "#fefe5b" },
    locked: true,
    price: 997,
  },
  {
    id: "futuristic",
    label: "Futuristic",
    labelEs: "Futurista",
    previewEmoji: "🤖",
    materialOverrides: { BLN_shirt: "#0a0a2e", BLN_Lower_coat: "#7b2ff7" },
    locked: true,
    price: 2997,
  },
];

export const BACKGROUNDS: {
  id: AvatarBackground;
  label: string;
  labelEs: string;
  locked: boolean;
}[] = [
  { id: "forest",  label: "Forest",       labelEs: "Bosque",          locked: false },
  { id: "city",    label: "City Lights",   labelEs: "Luces de Ciudad", locked: true  },
  { id: "space",   label: "Space",         labelEs: "Espacio",         locked: true  },
  { id: "beach",   label: "Beach",         labelEs: "Playa",           locked: true  },
  { id: "studio",  label: "Studio",        labelEs: "Estudio",         locked: true  },
  { id: "none",    label: "No Background", labelEs: "Sin fondo",       locked: false },
];

export const VOICES: { id: AvatarVoice; label: string }[] = [
  { id: "es-MX-female", label: "Alex ES · Femenino" },
  { id: "es-MX-male",   label: "Alex ES · Masculino" },
  { id: "en-US-female", label: "Alex EN · Female" },
  { id: "en-US-male",   label: "Alex EN · Male" },
];

export const ASSET_SOURCES = [
  {
    name: "Sketchfab",
    url: "https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount",
    notes: "Largest free/paid 3D library. Download .glb/.gltf directly.",
    free: true,
  },
  {
    name: "Mixamo (Adobe)",
    url: "https://www.mixamo.com",
    notes: "Free rigged humanoid characters + animations. Export as .fbx → convert to .glb with Blender.",
    free: true,
  },
  {
    name: "Ready Player Me",
    url: "https://readyplayer.me",
    notes: "Free avatar builder. Returns a .glb URL per user — perfect for client avatars.",
    free: true,
  },
  {
    name: "Avaturn",
    url: "https://avaturn.me",
    notes: "Photo → 3D avatar pipeline. SDK available for programmatic swaps.",
    free: false,
  },
  {
    name: "NVIDIA Omniverse Audio2Face",
    url: "https://www.nvidia.com/en-us/omniverse/apps/audio2face/",
    notes: "Lip sync from audio. Local app or cloud API. Outputs blendshape data for Three.js.",
    free: false,
  },
  {
    name: "Reallusion ActorCore",
    url: "https://actorcore.reallusion.com",
    notes: "Motion-captured animations. Export as .fbx → .glb.",
    free: false,
  },
];
