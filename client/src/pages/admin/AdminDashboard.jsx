import { useEffect, useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { 
  Users, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  UserCheck,
  Ban,
  Database,
  Search,
  Settings
} from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";
import UserManagementTable from "@/components/admin/UserManagementTable";
import DeliveryMonitoringPanel from "@/components/admin/DeliveryMonitoringPanel";
import PaymentMonitoringPanel from "@/components/admin/PaymentMonitoringPanel";
import ListingModerationTable from "@/components/admin/ListingModerationTable";
import DisputeMonitoringPanel from "@/components/admin/DisputeMonitoringPanel";
import { DashboardHeader, QuickActionCard, WorkflowGuide } from "@/components/DashboardUI";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const { stats, users, orders, deliveries, listings, isLoading, fetchAdminData } = useAdminStore();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  if (isLoading && users.length === 0) {
    return (
      <div className="space-y-12 animate-in fade-in duration-500">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 rounded-[3rem]" />)}
         </div>
         <Skeleton className="h-[600px] rounded-[3rem]" />
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "users", label: "Users", icon: Users },
    { id: "listings", label: "Marketplace", icon: ShoppingBag },
    { id: "logistics", label: "Logistics", icon: Truck },
    { id: "payments", label: "Financials", icon: CreditCard },
  ];

  return (
    <div className="pb-24 pt-4 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
           <div className="flex items-center gap-2 mb-2">
              <div className="px-3 py-1 bg-gray-900 text-white rounded-full text-[8px] font-black uppercase tracking-widest">Global Control</div>
              <div className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </div>
           </div>
           <h1 className="text-5xl font-black text-gray-900 tracking-tight">Platform Command</h1>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Real-time ecosystem health and moderation center</p>
        </div>
        
        <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={cn(
                 "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                 activeTab === tab.id ? "bg-gray-900 text-white shadow-xl" : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
               )}
             >
                <tab.icon className="w-4 h-4" />
                {tab.label}
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-12">
               {/* Primary Stats */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AdminStatCard 
                    label="Escrow Capacity" 
                    value={`₹${stats.escrowTotal.toLocaleString()}`} 
                    icon={ShieldCheck} 
                    color="orange" 
                    description="Total funds held in platform vault"
                  />
                  <AdminStatCard 
                    label="Total Revenue" 
                    value={`₹${stats.totalRevenue.toLocaleString()}`} 
                    icon={TrendingUp} 
                    color="green" 
                    description="Platform transaction volume"
                  />
                  <AdminStatCard 
                    label="Active Missions" 
                    value={stats.activeDeliveries} 
                    icon={Truck} 
                    color="blue" 
                    description="In-progress logistics operations"
                  />
                  <AdminStatCard 
                    label="Active Users" 
                    value={stats.totalUsers} 
                    icon={Users} 
                    color="purple" 
                    description="Verified platform members"
                  />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-12">
                     <div>
                        <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                           Governance Commands
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <QuickActionCard 
                             title="Verify Farmers" 
                             description="Audit pending applications" 
                             icon={UserCheck} 
                             to="/dashboard"
                             color="green"
                           />
                           <QuickActionCard 
                             title="Freeze Account" 
                             description="Suspend malicious entities" 
                             icon={Ban} 
                             to="/dashboard"
                             color="red"
                           />
                           <QuickActionCard 
                             title="Escrow Audit" 
                             description="Review transaction ledger" 
                             icon={Database} 
                             to="/dashboard"
                             color="blue"
                           />
                           <QuickActionCard 
                             title="System Logs" 
                             description="Monitor API health" 
                             icon={Settings} 
                             to="/dashboard"
                             color="orange"
                           />
                        </div>
                     </div>

                     <div className="space-y-8">
                        <DeliveryMonitoringPanel deliveries={deliveries} />
                        <PaymentMonitoringPanel orders={orders} />
                        <DisputeMonitoringPanel disputes={[]} />
                     </div>
                  </div>

                  <div className="space-y-8">
                     <WorkflowGuide 
                       steps={[
                         { title: "Verification", description: "Farmer identity and farm location verified via GPS data.", completed: true },
                         { title: "Price Stability", description: "Algorithmic monitoring for marketplace manipulation.", completed: true },
                         { title: "Liquidity Guard", description: "Ensuring escrow vault matches real-world commitments.", completed: true },
                         { title: "Dispute Arbitrage", description: "Reviewing delivery proof-of-images for resolution.", completed: false },
                       ]}
                     />

                     <div className="bg-gray-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        <Globe className="w-12 h-12 text-blue-400 mb-6" />
                        <h3 className="text-2xl font-black mb-2 tracking-tight">Global Presence</h3>
                        <p className="text-sm font-medium text-gray-400 leading-relaxed mb-8">
                           System latency is optimal at 45ms.
                        </p>
                        <div className="flex items-center gap-4">
                           <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10">
                              <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Uptime</p>
                              <p className="text-xl font-black">99.9%</p>
                           </div>
                           <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10">
                              <p className="text-[8px] font-black text-green-400 uppercase tracking-widest mb-1">Status</p>
                              <p className="text-xl font-black uppercase">Level 1</p>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                           <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Alerts</h3>
                           <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                              <AlertTriangle className="w-4 h-4" />
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 animate-pulse" />
                              <div>
                                 <p className="text-[10px] font-black text-red-700 uppercase tracking-widest">Escrow Hold</p>
                                 <p className="text-xs font-bold text-red-800 mt-1">3 transactions delayed</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <AdminStatCard label="Farmers" value={stats.farmerCount} icon={Users} color="green" />
                  <AdminStatCard label="Buyers" value={stats.buyerCount} icon={ShoppingBag} color="blue" />
                  <AdminStatCard label="Partners" value={stats.deliveryCount} icon={Truck} color="orange" />
               </div>
               <UserManagementTable users={users} />
            </div>
          )}

          {activeTab === "listings" && (
            <div className="space-y-12">
               <ListingModerationTable listings={listings} />
            </div>
          )}

          {activeTab === "logistics" && (
            <div className="space-y-12">
               <DeliveryMonitoringPanel deliveries={deliveries} />
            </div>
          )}

          {activeTab === "payments" && (
            <div className="space-y-12">
               <PaymentMonitoringPanel orders={orders} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
