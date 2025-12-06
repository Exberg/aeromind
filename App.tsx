import React, { useState, useEffect } from "react";
import { Container, CargoItem, PackingResult } from "./types";
import { calculatePacking } from "./services/packingService";
import CargoHold from "./components/CargoHold";
import StatsPanel from "./components/StatsPanel";
import Sidebar from "./components/Sidebar";
import AeromindPage from "./components/AeromindPage";
import { A400M_CONTAINER, SAMPLE_ITEMS } from "./constants";
import { Plus, Trash2, RotateCcw, Box, Cpu, Lock } from "lucide-react";

const App: React.FC = () => {
  // Navigation State
  const [activePage, setActivePage] = useState("OPERATIONS");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // App Data State
  const [items, setItems] = useState<CargoItem[]>(SAMPLE_ITEMS);
  const [container] = useState<Container>(A400M_CONTAINER);
  const [result, setResult] = useState<PackingResult | null>(null);

  // Form State
  const [newItemWeight, setNewItemWeight] = useState(500);
  const [newItemWidth, setNewItemWidth] = useState(100);
  const [newItemLength, setNewItemLength] = useState(100);

  // Recalculate whenever items change
  useEffect(() => {
    const calculation = calculatePacking(container, items);
    setResult(calculation);
  }, [items, container]);

  const addItem = () => {
    const id = `ITEM-${Math.floor(Math.random() * 9999)}`;
    const newItem: CargoItem = {
      id,
      name: "Standard Cargo",
      weight: newItemWeight,
      dimensions: { width: newItemWidth, length: newItemLength, height: 100 },
      type: "CRATE",
      color: "rgba(255, 255, 255, 0.3)",
    };
    setItems([...items, newItem]);
  };

  const clearItems = () => {
    setItems([]);
  };

  const resetDemo = () => {
    setItems(SAMPLE_ITEMS);
  };

  return (
    <div className="h-screen bg-black text-white font-mono flex overflow-hidden relative">
      <div className="scan-line z-50 pointer-events-none fixed inset-0"></div>

      {/* Left Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-black">
        {activePage === "AEROMIND" ? (
          <AeromindPage />
        ) : (
          <>
            {/* Header */}
            <header className="border-b border-white/20 bg-black p-4 flex justify-between items-center z-20 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-white flex items-center justify-center bg-black">
                  <Cpu className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-widest text-white uppercase">
                    {activePage.replace("_", " ")} // SYSTEM.33
                  </h1>
                  <p className="text-xs text-neutral-500">
                    SYSTEM...IP23.33: SECURE LINK ESTABLISHED
                  </p>
                </div>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-xs text-white font-bold border px-1 inline-block">
                  SECURE CONNECTION
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">
                  PROTOCOL V.224.XXX.3.3
                </div>
              </div>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative z-10">
              {/* PAGE: OPERATIONS (The Main App) */}
              {activePage === "OPERATIONS" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                  {/* Left Panel: Inputs & Manifest */}
                  <section className="lg:col-span-3 flex flex-col gap-6">
                    {/* Add Item Control */}
                    <div className="hud-border hud-corner p-4">
                      <h2 className="text-sm font-bold text-white mb-4 border-b border-white/20 pb-2 uppercase flex items-center gap-2">
                        <Box size={14} /> Cargo Injection
                      </h2>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">
                            WEIGHT (KG)
                          </label>
                          <input
                            type="range"
                            min="100"
                            max="5000"
                            step="50"
                            value={newItemWeight}
                            onChange={(e) =>
                              setNewItemWeight(Number(e.target.value))
                            }
                            className="w-full accent-white bg-neutral-800 h-2 appearance-none cursor-pointer"
                          />
                          <div className="text-right text-white text-sm font-bold">
                            {newItemWeight} kg
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-neutral-400 mb-1">
                              WIDTH (CM)
                            </label>
                            <input
                              type="number"
                              value={newItemWidth}
                              onChange={(e) =>
                                setNewItemWidth(Number(e.target.value))
                              }
                              className="w-full bg-black border border-neutral-600 text-white p-2 text-xs focus:border-white outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-neutral-400 mb-1">
                              LENGTH (CM)
                            </label>
                            <input
                              type="number"
                              value={newItemLength}
                              onChange={(e) =>
                                setNewItemLength(Number(e.target.value))
                              }
                              className="w-full bg-black border border-neutral-600 text-white p-2 text-xs focus:border-white outline-none"
                            />
                          </div>
                        </div>

                        <button
                          onClick={addItem}
                          className="w-full bg-white hover:bg-neutral-200 text-black border border-white py-2 text-sm font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                        >
                          <Plus size={16} /> Add to Queue
                        </button>
                      </div>
                    </div>

                    {/* Manifest List */}
                    <div className="hud-border hud-corner flex-1 bg-black overflow-hidden flex flex-col min-h-[300px]">
                      <div className="p-3 border-b border-white/20 bg-black flex justify-between items-center">
                        <span className="text-xs font-bold text-white">
                          MANIFEST_LOG
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={resetDemo}
                            className="p-1 hover:text-white text-neutral-500"
                            title="Reset"
                          >
                            <RotateCcw size={14} />
                          </button>
                          <button
                            onClick={clearItems}
                            className="p-1 hover:text-white text-neutral-500"
                            title="Clear All"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
                        {items.length === 0 && (
                          <div className="text-center text-neutral-600 text-xs py-10">
                            NO CARGO LOADED
                          </div>
                        )}
                        {[...items].reverse().map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center bg-neutral-900 p-2 border-l-2 border-neutral-600 hover:border-white transition-colors text-xs"
                          >
                            <div>
                              <span className="block font-bold text-white">
                                {item.id}
                              </span>
                              <span className="text-[10px] text-neutral-400">
                                {item.dimensions.width}x{item.dimensions.length}
                                cm
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="block font-bold text-white">
                                {item.weight}kg
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Center Panel: Visualization */}
                  <section className="lg:col-span-9 flex flex-col gap-6">
                    {result && (
                      <StatsPanel result={result} container={container} />
                    )}

                    <div className="flex-1 hud-border hud-corner p-1 relative min-h-[600px]">
                      {/* Algorithm Description (Visual Flair) */}
                      <div className="absolute top-2 left-2 z-10 pointer-events-none hidden md:block">
                        <div className="text-[9px] text-neutral-400 space-y-1 font-mono leading-tight">
                          <p>ALGORITHM: GREEDY_HEURISTIC_V2</p>
                          <p>SORT: DESC_WEIGHT</p>
                          <p>OPTIMIZATION: CENTER_LINE_BIAS</p>
                        </div>
                      </div>

                      {result && (
                        <CargoHold container={container} result={result} />
                      )}
                    </div>
                  </section>
                </div>
              )}

              {/* OTHER PAGES: Placeholders */}
              {activePage !== "OPERATIONS" && (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] border border-dashed border-neutral-800 rounded-lg">
                  <Lock size={48} className="text-neutral-700 mb-4" />
                  <h2 className="text-2xl font-bold text-neutral-500 uppercase">
                    System Restricted
                  </h2>
                  <p className="text-neutral-600 font-mono text-sm mt-2">
                    ACCESS LEVEL REQUIRED: 5
                  </p>
                  <p className="text-neutral-700 font-mono text-xs mt-4 animate-pulse">
                    AWAITING AUTHORIZATION...
                  </p>
                </div>
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
