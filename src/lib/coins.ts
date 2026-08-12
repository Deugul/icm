export type CoinDef = {
  id: string;
  name: string;
  /** Pre-rendered glass coin (rim, tilt, glow baked in). */
  image: string;
  /** Diameter in px. */
  size: number;
};

export const coins: CoinDef[] = [
  { id: "apple", name: "Apple", image: "/logos/apple.png", size: 81 },
  { id: "nvidia", name: "Nvidia", image: "/logos/nvidia.png", size: 73 },
  { id: "microsoft", name: "Microsoft", image: "/logos/microsoft.png", size: 86 },
  { id: "tesla", name: "Tesla", image: "/logos/tesla.png", size: 77 },
  { id: "amazon", name: "Amazon", image: "/logos/amazon.png", size: 83 },
  { id: "google", name: "Google", image: "/logos/google.png", size: 90 },
  { id: "meta", name: "Meta", image: "/logos/meta.png", size: 75 },
];
