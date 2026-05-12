import { Package, ClipboardList, TrendingUp, PlusCircle, MessageCircle, BarChart3, ShieldCheck } from "lucide-react";
import { DashboardHeader, StatCard, QuickActionCard, WorkflowGuide } from "@/components/DashboardUI";
import { motion } from "framer-motion";

const FarmerDashboard = () => {
  return (
    <div className="pb-24 pt-4 px-2 md:px-0">
      <DashboardHeader 
        description="Monitor your inventory performance and engage in direct price discovery with buyers." 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <StatCard label="Live Listings" value="8" icon={Package} color="green" />
        <StatCard label="Active Bids" value="3" icon={MessageCircle} color="blue" />
        <StatCard label="Total Revenue" value="₹12,450" icon={BarChart3} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
           <div>
              <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                 Operational Commands
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <QuickActionCard 
                   title="New Listing" 
                   description="Broadcast fresh harvest" 
                   icon={PlusCircle} 
                   to="/farmer/listings/new"
                   color="green"
                 />
                 <QuickActionCard 
                   title="Review Bids" 
                   description="Manage direct offers" 
                   icon={MessageCircle} 
                   to="/negotiations"
                   color="blue"
                 />
                 <QuickActionCard 
                   title="Active Orders" 
                   description="Track escrowed sales" 
                   icon={ClipboardList} 
                   to="/orders"
                   color="orange"
                 />
                 <QuickActionCard 
                   title="Sales Analytics" 
                   description="Revenue & yield stats" 
                   icon={TrendingUp} 
                   to="/dashboard"
                   color="blue"
                 />
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/40">
              <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight">Recent Live Activity</h3>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-6 bg-gray-50/50 rounded-[2rem] border border-gray-50 hover:border-green-100 transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 font-black shadow-sm group-hover:rotate-12 transition-transform">
                        #FD
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Incoming Order #FD-10{i}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">2.5kg Roma Tomatoes • Verified via Escrow</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1.5 rounded-full uppercase tracking-widest">Awaiting Logistics</span>
                  </motion.div>
                ))}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <WorkflowGuide 
             steps={[
               { title: "Broadcast", description: "Publish your harvest availability to the live marketplace.", completed: true },
               { title: "Price Discovery", description: "Receive and counter direct bids from local buyers.", completed: true },
               { title: "Escrow Confirmation", description: "Funds are locked by platform upon buyer acceptance.", completed: true },
               { title: "Verification", description: "Payout released instantly upon secure OTP delivery.", completed: false },
             ]}
           />
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
