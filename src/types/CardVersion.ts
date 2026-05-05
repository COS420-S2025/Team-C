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
  /** Attack energy types used across any attack, e.g. ["Fire", "Colorless"] */
  attackEnergyTypes?: string[];
  /** Total number of energy required for the cheapest attack (if known). */
  minAttackEnergyCost?: number;
  /** Total number of energy required for the most expensive attack (if known). */
  maxAttackEnergyCost?: number;
  /** Distinct total energy costs across attacks, e.g. [1,2,3] */
  attackEnergyCosts?: number[];
  /** Weakness types, e.g. ["Lightning"] */
  weaknessTypes?: string[];
};
