import React from "react";
import { Container, PackingResult } from "../types";
import { THEME } from "../aeromindConstants";

interface CargoHoldProps {
  container: Container;
  result: PackingResult;
}

const CargoHold: React.FC<CargoHoldProps> = ({ container, result }) => {
  // Container dimensions (The actual cargo floor)
  const FLOOR_WIDTH_CM = container.width;
  const FLOOR_LENGTH_CM = container.length;

  // Aircraft Visual Scaling (Relative to the 400cm floor)
  const FUSELAGE_WIDTH = FLOOR_WIDTH_CM + 180;
  const FUSELAGE_RX = FUSELAGE_WIDTH / 2;

  const NOSE_LENGTH = 500;
  const TAIL_LENGTH = 600;

  // Wing Geometry
  const WING_SPAN_HALF = 1600;
  const WING_ROOT_Y = 600;
  const WING_TIP_Y = 1400;
  const WING_ROOT_WIDTH = 500;
  const WING_TIP_WIDTH = 150;

  // Engine Geometry
  const ENGINE_OFFSET_X = 700;
  const ENGINE_OFFSET_Y = 800;
  const ENGINE_RADIUS = 70;

  // Horizontal Stabilizer (Tail wings)
  const STABILIZER_SPAN_HALF = 600;
  const STABILIZER_ROOT_Y = FLOOR_LENGTH_CM + 200;
  const STABILIZER_TIP_Y = FLOOR_LENGTH_CM + 500;

  // Offsets to center the floor in the SVG logic
  const floorOffsetY = NOSE_LENGTH;

  // Total Viewbox area
  const VISUAL_WIDTH = WING_SPAN_HALF * 2 + 200;
  const VISUAL_HEIGHT = NOSE_LENGTH + FLOOR_LENGTH_CM + TAIL_LENGTH;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-start bg-black p-4 rounded-lg border border-white/10 overflow-hidden">
      {/* HUD Info Overlays */}
      <div className="absolute top-4 left-4 z-20 text-[10px] md:text-xs font-mono text-white opacity-80 pointer-events-none">
        <div className="border-l-2 border-orange-500 pl-2">
          MODEL: B-77X // WIREFRAME
        </div>
        <div className="border-l-2 border-orange-500 pl-2 mt-1">
          DATUM OFFSET: {container.referenceDatum}cm
        </div>
      </div>
      <div className="absolute top-4 right-4 z-20 text-[10px] md:text-xs font-mono text-white opacity-80 pointer-events-none text-right">
        <div>STRUCTURAL MESH: ACTIVE</div>
        <div>BAY ZONES: SEPARATED</div>
      </div>

      {/* Main Visualization SVG */}
      <div className="relative w-full h-full flex items-center justify-center overflow-auto custom-scrollbar">
        <svg
          width="100%"
          height="100%"
          viewBox={`-${VISUAL_WIDTH / 2} -200 ${VISUAL_WIDTH} ${
            VISUAL_HEIGHT + 400
          }`}
          preserveAspectRatio="xMidYMid meet"
          className="overflow-visible drop-shadow-2xl"
        >
          {/* Defs for patterns */}
          <defs>
            {/* The Wireframe Mesh Pattern - White/Gray */}
            <pattern
              id="meshPattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect
                width="40"
                height="40"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
              <path
                d="M0 0 L40 40 M40 0 L0 40"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="0.5"
              />
            </pattern>

            {/* Floor Grid Pattern - White */}
            <pattern
              id="floorGrid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          {/* --- AIRCRAFT GEOMETRY (WIREFRAME) --- */}
          <g>
            {/* 1. Wings (Left & Right) */}
            {[-1, 1].map((side) => (
              <g key={`wing-${side}`} transform={`scale(${side}, 1)`}>
                {/* Main Wing */}
                <path
                  d={`
                                M ${FUSELAGE_RX * 0.8} ${
                    floorOffsetY + WING_ROOT_Y
                  }
                                L ${WING_SPAN_HALF} ${floorOffsetY + WING_TIP_Y}
                                L ${WING_SPAN_HALF} ${
                    floorOffsetY + WING_TIP_Y + WING_TIP_WIDTH
                  }
                                L ${FUSELAGE_RX * 0.8} ${
                    floorOffsetY + WING_ROOT_Y + WING_ROOT_WIDTH
                  }
                                Z
                            `}
                  fill="url(#meshPattern)"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="1"
                />
                {/* Engine Pod */}
                <g
                  transform={`translate(${ENGINE_OFFSET_X}, ${
                    floorOffsetY + ENGINE_OFFSET_Y
                  })`}
                >
                  <rect
                    x={-ENGINE_RADIUS}
                    y={-100}
                    width={ENGINE_RADIUS * 2}
                    height={200}
                    rx="20"
                    fill="#000"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="0"
                    cy="100"
                    r={ENGINE_RADIUS - 5}
                    fill="none"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="2"
                  />
                  <path
                    d={`M -${ENGINE_RADIUS} -80 L -${ENGINE_RADIUS} 80`}
                    stroke="rgba(255,255,255,0.2)"
                  />
                </g>
              </g>
            ))}

            {/* 2. Tail Stabilizers */}
            {[-1, 1].map((side) => (
              <path
                key={`tail-${side}`}
                transform={`scale(${side}, 1)`}
                d={`
                            M ${FUSELAGE_RX * 0.5} ${
                  floorOffsetY + STABILIZER_ROOT_Y
                }
                            L ${STABILIZER_SPAN_HALF} ${
                  floorOffsetY + STABILIZER_TIP_Y
                }
                            L ${STABILIZER_SPAN_HALF} ${
                  floorOffsetY + STABILIZER_TIP_Y + 200
                }
                            L ${FUSELAGE_RX * 0.2} ${
                  floorOffsetY + STABILIZER_ROOT_Y + 300
                }
                            Z
                        `}
                fill="url(#meshPattern)"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1"
              />
            ))}

            {/* 3. Fuselage Body (Main Tube) */}
            <path
              d={`
                        M -${FUSELAGE_RX} ${floorOffsetY}
                        Q -${FUSELAGE_RX} ${
                floorOffsetY - NOSE_LENGTH * 0.5
              } 0 ${floorOffsetY - NOSE_LENGTH}
                        Q ${FUSELAGE_RX} ${
                floorOffsetY - NOSE_LENGTH * 0.5
              } ${FUSELAGE_RX} ${floorOffsetY}
                        L ${FUSELAGE_RX} ${floorOffsetY + FLOOR_LENGTH_CM}
                        Q ${FUSELAGE_RX} ${
                floorOffsetY + FLOOR_LENGTH_CM + TAIL_LENGTH
              } 0 ${floorOffsetY + FLOOR_LENGTH_CM + TAIL_LENGTH}
                        Q -${FUSELAGE_RX} ${
                floorOffsetY + FLOOR_LENGTH_CM + TAIL_LENGTH
              } -${FUSELAGE_RX} ${floorOffsetY + FLOOR_LENGTH_CM}
                        Z
                    `}
              fill="#000000"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="2"
            />

            {/* Structural Ribs */}
            {Array.from({ length: 12 }).map((_, i) => (
              <path
                key={i}
                d={`M -${FUSELAGE_RX} ${
                  floorOffsetY + i * (FLOOR_LENGTH_CM / 12)
                } Q 0 ${
                  floorOffsetY + i * (FLOOR_LENGTH_CM / 12) + 20
                } ${FUSELAGE_RX} ${floorOffsetY + i * (FLOOR_LENGTH_CM / 12)}`}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}

            {/* Cockpit Window */}
            <path
              d={`M -40 ${floorOffsetY - NOSE_LENGTH * 0.7} Q 0 ${
                floorOffsetY - NOSE_LENGTH * 0.8
              } 40 ${floorOffsetY - NOSE_LENGTH * 0.7} L 50 ${
                floorOffsetY - NOSE_LENGTH * 0.6
              } H -50 Z`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="1.5"
            />
          </g>

          {/* --- CARGO FLOOR (FUNCTIONAL AREA) --- */}
          <g transform={`translate(-${FLOOR_WIDTH_CM / 2}, ${floorOffsetY})`}>
            {/* Main Floor Background */}
            <rect
              x="0"
              y="0"
              width={FLOOR_WIDTH_CM}
              height={FLOOR_LENGTH_CM}
              fill="rgba(20, 20, 20, 0.5)"
              stroke="none"
            />

            {/* THE "LEFT & RIGHT BOXES" - Distinct Bay Zones */}
            <g>
              {/* Left Bay Container Box */}
              <rect
                x="10"
                y="10"
                width={FLOOR_WIDTH_CM / 2 - 15}
                height={FLOOR_LENGTH_CM - 20}
                fill="url(#floorGrid)"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2"
              />
              {/* Left Label */}
              <text
                x="30"
                y={FLOOR_LENGTH_CM - 50}
                className="text-xs font-mono fill-white opacity-50"
                transform="rotate(-90 30, 1550)"
              >
                PORT SIDE (L)
              </text>

              {/* Right Bay Container Box */}
              <rect
                x={FLOOR_WIDTH_CM / 2 + 5}
                y="10"
                width={FLOOR_WIDTH_CM / 2 - 15}
                height={FLOOR_LENGTH_CM - 20}
                fill="url(#floorGrid)"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2"
              />
              {/* Right Label */}
              <text
                x={FLOOR_WIDTH_CM - 30}
                y={FLOOR_LENGTH_CM - 50}
                className="text-xs font-mono fill-white opacity-50"
                transform="rotate(90 370, 1550)"
              >
                STARBOARD (R)
              </text>
            </g>

            {/* Center Line Marker */}
            <line
              x1={FLOOR_WIDTH_CM / 2}
              y1="-50"
              x2={FLOOR_WIDTH_CM / 2}
              y2={FLOOR_LENGTH_CM + 50}
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="1"
              strokeDasharray="15,10"
            />

            {/* --- PLACED ITEMS --- */}
            {result.placedItems.map((item) => (
              <g
                key={item.id}
                transform={`translate(${item.position.x}, ${item.position.y})`}
              >
                {/* Shadow */}
                <rect
                  x="4"
                  y="4"
                  width={item.dimensions.width}
                  height={item.dimensions.length}
                  fill="rgba(0,0,0,0.8)"
                />
                {/* Item Body */}
                <rect
                  width={item.dimensions.width}
                  height={item.dimensions.length}
                  fill={item.color || "rgba(255, 255, 255, 0.2)"}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-all duration-300 hover:fill-white cursor-pointer"
                />
                {/* X Pattern on top */}
                <line
                  x1="0"
                  y1="0"
                  x2={item.dimensions.width}
                  y2={item.dimensions.length}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="1"
                />
                <line
                  x1={item.dimensions.width}
                  y1="0"
                  x2="0"
                  y2={item.dimensions.length}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="1"
                />

                {/* Label */}
                {item.dimensions.width > 50 && (
                  <foreignObject
                    x="0"
                    y="0"
                    width={item.dimensions.width}
                    height={item.dimensions.length}
                    className="pointer-events-none"
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center text-center overflow-hidden p-0.5">
                      <div className="text-[10px] md:text-xs font-bold text-white mix-blend-difference drop-shadow-md truncate w-full">
                        {item.id.split("-")[0]}
                      </div>
                      <div className="text-[8px] text-black bg-white px-1 mt-1 font-bold">
                        {item.weight}kg
                      </div>
                    </div>
                  </foreignObject>
                )}
              </g>
            ))}

            {/* --- CG MARKER (Target Style) --- */}
            <g
              transform={`translate(${result.centerOfGravity.x}, ${result.centerOfGravity.y})`}
            >
              <circle
                r="20"
                fill={`${THEME.accentHex}33`}
                stroke={THEME.accentHex}
                strokeWidth="1"
                className="animate-ping"
              />
              <circle r="6" fill={THEME.accentHex} />
              <line
                x1="-30"
                y1="0"
                x2="30"
                y2="0"
                stroke={THEME.accentHex}
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="-30"
                x2="0"
                y2="30"
                stroke={THEME.accentHex}
                strokeWidth="1"
              />
              <text
                x="15"
                y="-15"
                fill={THEME.accentHex}
                fontSize="16"
                fontFamily="monospace"
                fontWeight="bold"
              >
                CG
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default CargoHold;
