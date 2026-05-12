import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { NAV_LINKS } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

const Sidebar = ({ className, onItemClick }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const role = user?.role || "BUYER";
  const links = NAV_LINKS[role] || [];

  return (
    <aside className={cn("w-72 bg-white border-r border-gray-100 flex flex-col h-full overflow-y-auto z-40", className)}>
      <div className="flex-1 px-6 py-10">
        <nav className="space-y-1.5">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-3">
            Navigation
          </div>
          
          <Link
            to="/dashboard"
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-4 px-4 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300",
              location.pathname === "/dashboard"
                ? "bg-gray-900 text-white shadow-xl shadow-gray-200"
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Icons.LayoutDashboard className="w-4 h-4" />
            Overview
          </Link>

          {links.map((link) => {
            const Icon = Icons[link.icon] || Icons.Circle;
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={onItemClick}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300",
                  isActive
                    ? "bg-gray-900 text-white shadow-xl shadow-gray-200"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 mt-auto space-y-6">
        <div className="bg-gray-900 rounded-[2rem] p-6 border border-gray-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-white/5 rounded-full blur-xl transition-all group-hover:scale-150" />
          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Perspective</p>
          <p className="text-sm font-black text-white flex items-center gap-2">
            {role} <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </p>
          <div className="mt-4 pt-4 border-t border-white/5">
             <p className="text-[7px] font-black text-gray-500 uppercase tracking-[0.2em] leading-relaxed">
               Secure Session Verified <br /> {user?.email}
             </p>
          </div>
        </div>

        <div className="px-4 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
              <div className="w-1 h-1 rounded-full bg-blue-500" />
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Reviewer Mode v1.0</span>
           </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
