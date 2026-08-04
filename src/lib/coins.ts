export type CoinDef = {
  id: string;
  name: string;
  /** Pre-rendered glass coin (rim, tilt, glow baked in). */
  image: string;
  /** Diameter in px. */
  size: number;
};

export const coins: CoinDef[] = [
  { id: "apple", name: "Apple", image: "/logos/apple.png", size: 76 },
  { id: "nvidia", name: "Nvidia", image: "/logos/nvidia.png", size: 68 },
  { id: "microsoft", name: "Microsoft", image: "/logos/microsoft.png", size: 80 },
  { id: "tesla", name: "Tesla", image: "/logos/tesla.png", size: 72 },
  { id: "amazon", name: "Amazon", image: "/logos/amazon.png", size: 78 },
  { id: "google", name: "Google", image: "/logos/google.png", size: 84 },
  { id: "meta", name: "Meta", image: "/logos/meta.png", size: 70 },
];
