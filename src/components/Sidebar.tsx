
import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Sidebar = ({ currentPage, setCurrentPage }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line' },
    { id: 'inventory', label: 'Inventory Management', icon: 'fas fa-boxes' },
    { id: 'sales', label: 'Sales Entry', icon: 'fas fa-cash-register' },
    { id: 'predictor', label: 'Waste Predictor', icon: 'fas fa-exclamation-triangle' },
    { id: 'optimizer', label: 'Optimizer', icon: 'fas fa-lightbulb' }
  ];

  return (
    <div className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg border-r border-gray-200 z-40">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <i className="fas fa-utensils text-white"></i>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">RestaurantAI</h2>
            <p className="text-xs text-gray-500">Waste Management</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-orange-50 transition-colors duration-200",
              currentPage === item.id 
                ? "bg-orange-50 border-r-2 border-orange-500 text-orange-600" 
                : "text-gray-600 hover:text-orange-600"
            )}
          >
            <i className={cn(item.icon, "w-5 text-center")}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 text-white">
          <h3 className="font-semibold text-sm">Pro Tip</h3>
          <p className="text-xs opacity-90 mt-1">
            Check waste predictions daily to optimize your inventory!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
