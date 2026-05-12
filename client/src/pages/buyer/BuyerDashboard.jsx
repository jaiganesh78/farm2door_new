import { ShoppingBag, MessageSquare, Heart, Search, Gavel, ShieldCheck, Truck } from "lucide-react";
import { DashboardHeader, StatCard, QuickActionCard, WorkflowGuide } from "@/components/DashboardUI";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BuyerDashboard = () => {
  return (
    <div className="pb-24 pt-4 px-2 md:px-0">
      <DashboardHeader 
        description="Monitor your secure transactions and discover fresh harvests direct from verified farms." 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <StatCard label="Active Orders" value="2" icon={ShoppingBag} color="green" />
        <StatCard label="Live Bids" value="1" icon={Gavel} color="blue" />
        <StatCard label="Saved Farms" value="12" icon={Heart} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
           <div>
              <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 Recommended Missions
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <QuickActionCard 
                   title="Find Produce" 
                   description="Browse local farm harvests" 
                   icon={Search} 
                   to="/listings"
                   color="green"
                 />
                 <QuickActionCard 
                   title="Check Bids" 
                   description="Respond to farmer counters" 
                   icon={MessageSquare} 
                   to="/negotiations"
                   color="blue"
                 />
                 <QuickActionCard 
                   title="Track Escrow" 
                   description="Monitor funds in vault" 
                   icon={ShieldCheck} 
                   to="/orders"
                   color="orange"
                 />
                 <QuickActionCard 
                   title="Live Delivery" 
                   description="Real-time logistics map" 
                   icon={Truck} 
                   to="/orders"
                   color="blue"
                 />
              </div>
           </div>

           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-gray-200"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-green-500/20 transition-all duration-700" />
              
              <div className="relative z-10">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-[0.2em] mb-6 border border-white/10">
                    <ShieldCheck className="w-3 h-3 text-green-400" />
                    Buyer Protection Active
                 </div>
                 <h3 className="text-3xl font-black mb-4 leading-tight">Direct-to-Source <br />Price Discovery</h3>
                 <p className="text-gray-400 text-sm font-bold uppercase tracking-tight leading-relaxed max-w-md">
                    Eliminate middleman fees. Negotiate directly with the farmer and lock your price via our secure escrow vault.
                 </p>
                 <Link to="/listings" className="inline-block mt-8">
                    <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">
                       Explore Marketplace
                    </button>
                 </Link>
              </div>
           </motion.div>
        </div>

        <div className="space-y-8">
           <WorkflowGuide 
             steps={[
               { title: "Discovery", description: "Locate verified produce within your logistics radius.", completed: true },
               { title: "Negotiation", description: "Bypass static pricing with direct-to-source bids.", completed: true },
               { title: "Escrow Lock", description: "Funds are secured in vault until delivery verified.", completed: false },
               { title: "Live Handoff", description: "Track real-time transit and release payout via OTP.", completed: false },
             ]}
           />
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
