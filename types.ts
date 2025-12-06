export interface Coordinates {
  x: number;
  y: number;
  z: number;
}

export interface Dimensions {
  width: number; // X axis
  length: number; // Y axis
  height: number; // Z axis
}

export interface CargoItem {
  id: string;
  name: string;
  weight: number; // kg
  dimensions: Dimensions;
  color?: string;
  type: 'PUMP' | 'CRATE' | 'PALLET' | 'DRUM';
}

export interface PlacedItem extends CargoItem {
  position: Coordinates;
  centerOfGravity: Coordinates; // Local CG of the item (usually center)
}

export interface Container {
  width: number;
  length: number;
  height: number;
  maxWeight: number;
  referenceDatum: number; // Distance from nose to start of cargo hold (for total aircraft CG)
}

export interface PackingResult {
  placedItems: PlacedItem[];
  rejectedItems: CargoItem[];
  totalWeight: number;
  centerOfGravity: { x: number; y: number }; // Relative to container origin
  aircraftCG: number; // Relative to aircraft datum
}