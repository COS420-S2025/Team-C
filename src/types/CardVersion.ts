export type CardVersion = {
  id: string;
  name: string;
  imageUrl: string;
  set: string;
  setId?: string;
  rarity: string;
  releaseDate: string;
  numberInSet: string;
  isFoil: boolean;
  /** e.g. ["Grass", "Colorless"] */
  types?: string[];
  /** Parsed numeric HP when available */
  hp?: number;
};
