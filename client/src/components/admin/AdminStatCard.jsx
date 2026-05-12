import { cn } from "@/lib/utils";

const AdminStatCard = ({ label, value, icon: Icon, color, description }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    red: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
      <div className="flex items-center justify-between mb-6">
        <div className={cn(
          "w-16 h-16 rounded-[2rem] flex items-center justify-center border transition-all duration-500 group-hover:scale-110",
          colors[color] || colors.blue
        )}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="text-right">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</p>
           <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
        </div>
      </div>
      {description && (
        <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">
          {description}
        </p>
      )}
    </div>
  );
};

export default AdminStatCard;
