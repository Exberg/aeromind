import { CargoItem, Container, PackingResult, PlacedItem } from '../types';

/**
 * Checks if a proposed position overlaps with any already placed items.
 * Uses 2D AABB collision detection (Plan View).
 */
const checkCollision = (
  x: number,
  y: number,
  width: number,
  length: number,
  placedItems: PlacedItem[]
): boolean => {
  for (const item of placedItems) {
    const ix = item.position.x;
    const iy = item.position.y;
    const iw = item.dimensions.width;
    const il = item.dimensions.length;

    // AABB Collision Rule
    if (
      x < ix + iw &&
      x + width > ix &&
      y < iy + il &&
      y + length > iy
    ) {
      return true; // Collision detected
    }
  }
  return false;
};

/**
 * Core Algorithm:
 * 1. Sorts items by weight (Heaviest first).
 * 2. Iterates through the grid of the container.
 * 3. Finds valid spots (no collision).
 * 4. Scores spots based on distance to the Center Line (Container Width / 2).
 * 5. Places item in the best spot.
 */
export const calculatePacking = (
  container: Container,
  items: CargoItem[]
): PackingResult => {
  // Deep copy to avoid mutating state directly during sort
  const sortedItems = [...items].sort((a, b) => b.weight - a.weight);
  
  const placedItems: PlacedItem[] = [];
  const rejectedItems: CargoItem[] = [];
  
  // Step size for grid search (cm). Lower = more precise but slower.
  // 10cm resolution is standard for rough planning.
  const STEP_X = 10; 
  const STEP_Y = 10; 

  const containerCenterLine = container.width / 2;

  for (const item of sortedItems) {
    let bestX = -1;
    let bestY = -1;
    let bestScore = Infinity; // Lower score is better (distance from center)

    // Naive Greedy Search: Scan Y (Length) then X (Width)
    // We scan Y first to fill from front to back, but we prioritize X centering
    for (let y = 0; y <= container.length - item.dimensions.length; y += STEP_Y) {
      for (let x = 0; x <= container.width - item.dimensions.width; x += STEP_X) {
        
        // 1. Check Collision
        if (!checkCollision(x, y, item.dimensions.width, item.dimensions.length, placedItems)) {
          
          // 2. Calculate Score (Heuristic)
          // Primary: Distance of item's center to container's center line
          const itemCenterX = x + (item.dimensions.width / 2);
          const distToCenter = Math.abs(itemCenterX - containerCenterLine);
          
          // Secondary: Distance from front (Y). We weight this less so we prefer 
          // a slightly further back spot if it's perfectly centered, 
          // BUT generally we want to pack tight.
          // Adjusting the weight of 'y' changes if we prioritize packing tight vs balancing perfectly.
          // Here we treat Y simply as "availability" order because of the loop structure, 
          // but strictly finding the GLOBAL best spot requires scoring all valid spots.
          
          // To strictly follow "choose the spot closer to center line" if two spots exist:
          // We combine them. We prefer front (low y) but heavily penalize off-center.
          const score = (distToCenter * 5) + (y * 0.1); 

          if (score < bestScore) {
            bestScore = score;
            bestX = x;
            bestY = y;
          }
        }
      }
      
      // Optimization: If we found a valid spot in this Y row, and we want to pack front-to-back,
      // we could potentially break here. However, to find the absolute best center balance,
      // we should search a bit deeper. For this demo, scanning the whole floor ensures best fit.
    }

    if (bestX !== -1 && bestY !== -1) {
      placedItems.push({
        ...item,
        position: { x: bestX, y: bestY, z: 0 },
        centerOfGravity: {
          x: bestX + item.dimensions.width / 2,
          y: bestY + item.dimensions.length / 2,
          z: item.dimensions.height / 2
        }
      });
    } else {
      rejectedItems.push(item);
    }
  }

  // Calculate Metrics
  let totalMomentX = 0;
  let totalMomentY = 0;
  let totalWeight = 0;

  placedItems.forEach(item => {
    totalWeight += item.weight;
    totalMomentX += item.weight * item.centerOfGravity.x;
    totalMomentY += item.weight * item.centerOfGravity.y;
  });

  const centerOfGravity = totalWeight > 0 ? {
    x: totalMomentX / totalWeight,
    y: totalMomentY / totalWeight
  } : { x: container.width / 2, y: 0 };

  return {
    placedItems,
    rejectedItems,
    totalWeight,
    centerOfGravity,
    aircraftCG: container.referenceDatum + centerOfGravity.y
  };
};