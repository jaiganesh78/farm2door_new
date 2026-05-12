import { CreditCard, ShieldCheck, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const PaymentMonitoringPanel = ({ orders }) => {
  const successfulPayments = orders.filter(o => o.paymentStatus === "SUCCESS");

  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50">
         <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Financial Monitoring</h3>
         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Escrow and transaction lifecycle</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Escrow</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {successfulPayments.slice(0, 10).map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                         <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="font-bold text-gray-900 text-sm">Order #{order.id.slice(0, 8)}</p>
                         <p className="text-[10px] font-medium text-gray-400 uppercase">{order.listing?.productName || 'Produce'}</p>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <p className="font-black text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-[10px] font-black text-gray-900 uppercase">Success</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                     order.payment?.escrowStatus === "HELD" ? "bg-orange-50 text-orange-600" :
                     order.payment?.escrowStatus === "RELEASED" ? "bg-green-50 text-green-600" :
                     "bg-gray-50 text-gray-400"
                   )}>
                      {order.payment?.escrowStatus || 'N/A'}
                   </span>
                </td>
                <td className="px-8 py-6">
                   <p className="text-[10px] font-bold text-gray-400 uppercase">
                      {new Date(order.createdAt).toLocaleDateString()}
                   </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {successfulPayments.length === 0 && (
        <div className="p-20 text-center">
           <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
           <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No successful payments found.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentMonitoringPanel;
