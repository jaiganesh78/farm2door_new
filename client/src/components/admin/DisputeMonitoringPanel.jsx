import { AlertTriangle, CheckCircle2, XCircle, Clock, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const DisputeMonitoringPanel = ({ disputes = [] }) => {
  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex items-center justify-between">
        <div>
           <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Resolution Center</h3>
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage platform disputes and claims</p>
        </div>
        <div className="px-4 py-2 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100">
           {disputes.filter(d => d.status === "OPEN").length} Critical
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {disputes.length === 0 ? (
          <div className="p-20 text-center">
             <div className="w-16 h-16 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
             </div>
             <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">All Clear</h4>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">No active disputes requiring attention.</p>
          </div>
        ) : (
          disputes.map((dispute) => (
            <div key={dispute.id} className="p-8 hover:bg-gray-50/50 transition-all group">
               <div className="flex flex-col md:row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-6">
                     <div className={cn(
                       "w-12 h-12 rounded-xl flex items-center justify-center border",
                       dispute.status === "OPEN" ? "bg-red-50 text-red-600 border-red-100 shadow-lg shadow-red-100" : "bg-gray-50 text-gray-400 border-gray-100"
                     )}>
                        <AlertTriangle className="w-6 h-6" />
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className={cn(
                             "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                             dispute.status === "OPEN" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
                           )}>
                              {dispute.status}
                           </span>
                           <span className="text-[10px] font-black text-gray-300 uppercase">Order #{dispute.orderId.slice(0, 8)}</span>
                        </div>
                        <h4 className="font-bold text-gray-900">{dispute.reason}</h4>
                        <p className="text-[10px] font-medium text-gray-400 uppercase mt-1">Raised by {dispute.raisedBy === 'BUYER' ? 'Buyer' : 'Farmer'}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-4">
                     <button className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
                        Resolve Dispute
                     </button>
                     <button className="p-3 text-gray-300 hover:text-gray-900 transition-all">
                        <MoreVertical className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DisputeMonitoringPanel;
