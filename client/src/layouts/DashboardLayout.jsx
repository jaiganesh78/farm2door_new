import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "@/components/Sidebar";
import { LogOut, User, Menu, X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-green-600 selection:text-white">
      <LoadingOverlay />
      
      {/* Global Navbar */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 md:px-8 h-20 flex items-center justify-between sticky top-0 z-[100] shadow-sm">
        <div className="flex items-center gap-4">
           {/* Mobile Menu Toggle */}
           <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="p-3 md:hidden text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all"
           >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>

           <Link to="/dashboard" className="flex items-center gap-3 group">
             <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12 group-hover:scale-110 shadow-xl shadow-gray-200">
               <span className="text-white font-black text-xl italic">F</span>
             </div>
             <div className="flex flex-col">
                <span className="font-black text-2xl text-gray-900 tracking-tighter leading-none">Farm2Door</span>
                <div className="flex items-center gap-1 mt-0.5">
                   <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[7px] font-black text-green-600 uppercase tracking-[0.2em]">Platform Live</span>
                </div>
             </div>
           </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <button className="hidden sm:flex p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all relative">
             <Bell className="w-5 h-5" />
             <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          <div className="hidden sm:flex items-center gap-4 pl-4 border-l border-gray-100">
            <div className="text-right">
              <p className="text-xs font-black text-gray-900 uppercase tracking-widest leading-none mb-1">{user?.name}</p>
              <div className="flex justify-end">
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border shadow-sm",
                  user?.role === "ADMIN" ? "bg-red-50 text-red-600 border-red-100" :
                  user?.role === "FARMER" ? "bg-green-50 text-green-600 border-green-100" :
                  user?.role === "DELIVERY" ? "bg-blue-50 text-blue-600 border-blue-100" :
                  "bg-orange-50 text-orange-600 border-orange-100"
                )}>
                  {user?.role} Mode
                </span>
              </div>
            </div>
            <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center border-2 border-gray-100 shadow-sm group hover:border-green-600 transition-all cursor-pointer">
              <User className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
          </div>

          <button
            onClick={logout}
            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group"
            title="Logout"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop */}
        <Sidebar className="hidden md:flex sticky top-20 h-[calc(100vh-80px)]" />

        {/* Mobile Menu Overlay */}
        <div className={cn(
          "fixed inset-0 z-[110] bg-gray-900/60 backdrop-blur-sm md:hidden transition-all duration-500",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )} onClick={() => setIsMobileMenuOpen(false)}>
           <aside 
            className={cn(
              "w-[80%] max-w-sm h-full bg-white shadow-2xl transition-transform duration-500",
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
           >
              <Sidebar 
                className="border-r-0" 
                onItemClick={() => setIsMobileMenuOpen(false)} 
              />
           </aside>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 md:p-12">
          <div className="max-w-6xl mx-auto min-h-[calc(100vh-160px)]">
            <Outlet />
          </div>
          
          <footer className="mt-20 py-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">© 2026 Farm2Door Logistics Platform</p>
             <div className="flex items-center gap-8">
                <a href="#" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900">Support</a>
                <a href="#" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900">Privacy</a>
                <a href="#" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900">Terms</a>
             </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
