import { Container, CargoItem } from './types';

export const A400M_CONTAINER: Container = {
  width: 400, // cm
  length: 1600, // cm (approx cargo hold length available for use)
  height: 385, // cm
  maxWeight: 37000, // kg payload approx
  referenceDatum: 500 // cm (Distance from nose to start of cargo hold)
};

export const SAMPLE_ITEMS: CargoItem[] = [
  { id: 'FUEL-PUMP-01', name: 'Fuel Pump Sys', weight: 1200, dimensions: { width: 120, length: 120, height: 100 }, type: 'PUMP', color: 'rgba(255, 255, 255, 0.15)' },
  { id: 'AMMO-BOX-A2', name: 'Munitions Crate', weight: 2500, dimensions: { width: 200, length: 150, height: 80 }, type: 'CRATE', color: 'rgba(255, 255, 255, 0.3)' },
  { id: 'ENGINE-PART', name: 'Turbine Blade', weight: 850, dimensions: { width: 100, length: 250, height: 100 }, type: 'CRATE', color: 'rgba(200, 200, 200, 0.2)' },
  { id: 'MED-SUPPLY', name: 'Medical Kit', weight: 400, dimensions: { width: 100, length: 100, height: 100 }, type: 'PALLET', color: 'rgba(150, 150, 150, 0.2)' },
  { id: 'WATER-TANK', name: 'Potable Water', weight: 1500, dimensions: { width: 140, length: 140, height: 140 }, type: 'DRUM', color: 'rgba(255, 255, 255, 0.25)' },
  { id: 'GEN-SET-X', name: 'Generator 50kW', weight: 3200, dimensions: { width: 220, length: 300, height: 180 }, type: 'CRATE', color: 'rgba(255, 255, 255, 0.4)' },
  { id: 'ROVER-TIRES', name: 'Spare Tires', weight: 600, dimensions: { width: 150, length: 150, height: 50 }, type: 'PALLET', color: 'rgba(100, 100, 100, 0.3)' },
];