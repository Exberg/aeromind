import React from "react";
import {
  LayoutDashboard,
  Plane,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
  ShieldAlert,
  Radar,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  activePage,
  setActivePage,
}) => {
  const navItems = [
    { id: "OPERATIONS", label: "Cargo Ops", icon: LayoutDashboard },
    { id: "AEROMIND", label: "Revenue AI", icon: Radar },
    { id: "FLEET", label: "Fleet Status", icon: Plane },
    { id: "ANALYTICS", label: "Load Reports", icon: BarChart3 },
    { id: "MANIFESTS", label: "Manifests", icon: FileText },
    { id: "SETTINGS", label: "System Config", icon: Settings },
  ];

  return (
    <aside
      className={`
        relative h-full bg-black border-r border-white/20 transition-all duration-300 flex flex-col z-30
        ${isCollapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Top Logo Area */}
      <div className="h-16 border-b border-white/20 flex items-center justify-center relative overflow-hidden">
        {isCollapsed ? (
          <ShieldAlert className="text-white" size={24} />
        ) : (
          <div className="flex items-center gap-2 px-4 w-full">
            <ShieldAlert className="text-white shrink-0" size={24} />
            <span className="font-bold tracking-widest text-lg whitespace-nowrap">
              AERO_LOAD
            </span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`
                flex items-center gap-4 px-4 py-3 mx-2 transition-all duration-200 group relative
                ${
                  isActive
                    ? "bg-white text-black font-bold"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }
              `}
              title={isCollapsed ? item.label : ""}
            >
              <item.icon size={20} className="shrink-0" />

              <span
                className={`
                whitespace-nowrap tracking-wider text-xs transition-opacity duration-200
                ${isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 block"}
              `}
              >
                {item.label}
              </span>

              {/* Active Indicator Line for Collapsed Mode */}
              {isActive && isCollapsed && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Toggle */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors border border-transparent hover:border-white/20"
        >
          {isCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft size={20} />
              <span className="text-xs uppercase">Collapse</span>
            </div>
          )}
        </button>
      </div>

      {/* Decorative Corner */}
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/40 pointer-events-none" />
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/40 pointer-events-none" />
    </aside>
  );
};

export default Sidebar;
