export const NAV_LINKS = {
  BUYER: [
    { label: "Marketplace", href: "/listings", icon: "Store" },
    { label: "My Orders", href: "/orders", icon: "ShoppingBag" },
    { label: "Negotiations", href: "/negotiations", icon: "MessageSquare" },
  ],
  FARMER: [
    { label: "My Listings", href: "/farmer/listings", icon: "Package" },
    { label: "Incoming Orders", href: "/orders", icon: "ClipboardList" },
    { label: "Negotiations", href: "/negotiations", icon: "MessageSquare" },
  ],
  DELIVERY: [
    { label: "Available Deliveries", href: "/delivery/available", icon: "Truck" },
    { label: "My Tasks", href: "/delivery/tasks", icon: "MapPin" },
  ],
  ADMIN: [
    { label: "User Management", href: "/admin/users", icon: "Users" },
    { label: "Active Disputes", href: "/disputes", icon: "AlertTriangle" },
    { label: "Platform Analytics", href: "/admin/stats", icon: "BarChart" },
  ],
};
