import { User, Shield, Search, MoreVertical, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const UserManagementTable = ({ users }) => {
  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Platform Users</h3>
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage farmers, buyers and partners</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="SEARCH USERS..." 
                className="pl-12 pr-4 py-3 bg-gray-50 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-0 focus:border-green-600 transition-all w-64"
              />
           </div>
           <button className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400 hover:text-gray-900 transition-all">
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:border-blue-200 transition-all">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-[10px] font-medium text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                    user.role === "FARMER" ? "bg-green-50 text-green-600" :
                    user.role === "BUYER" ? "bg-blue-50 text-blue-600" :
                    user.role === "DELIVERY" ? "bg-orange-50 text-orange-600" :
                    "bg-purple-50 text-purple-600"
                  )}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[10px] font-black text-gray-900 uppercase">Active</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-8 py-6 text-right">
                   <button className="p-2 text-gray-300 hover:text-gray-900 transition-all">
                      <MoreVertical className="w-5 h-5" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTable;
