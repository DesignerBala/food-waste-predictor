
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import InventoryManagement from '@/components/InventoryManagement';
import SalesEntry from '@/components/SalesEntry';
import WastePredictor from '@/components/WastePredictor';
import Optimizer from '@/components/Optimizer';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [inventoryData, setInventoryData] = useState([]);
  const [salesData, setSalesData] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedInventory = localStorage.getItem('restaurantInventory');
    const savedSales = localStorage.getItem('restaurantSales');
    
    if (savedInventory) {
      setInventoryData(JSON.parse(savedInventory));
    } else {
      // Initialize with dummy data for demonstration
      const dummyInventory = [
        { id: 1, name: 'Tomatoes', quantity: 50, unit: 'kg', expiryDate: '2025-01-02', addedDate: '2024-12-28' },
        { id: 2, name: 'Chicken Breast', quantity: 25, unit: 'kg', expiryDate: '2025-01-01', addedDate: '2024-12-29' },
        { id: 3, name: 'Lettuce', quantity: 30, unit: 'heads', expiryDate: '2025-01-03', addedDate: '2024-12-30' },
        { id: 4, name: 'Milk', quantity: 20, unit: 'liters', expiryDate: '2025-01-05', addedDate: '2024-12-28' }
      ];
      setInventoryData(dummyInventory);
      localStorage.setItem('restaurantInventory', JSON.stringify(dummyInventory));
    }
    
    if (savedSales) {
      setSalesData(JSON.parse(savedSales));
    } else {
      // Initialize with dummy sales data
      const dummySales = [
        { id: 1, itemName: 'Tomatoes', quantitySold: 15, date: '2024-12-30' },
        { id: 2, itemName: 'Chicken Breast', quantitySold: 8, date: '2024-12-30' },
        { id: 3, itemName: 'Lettuce', quantitySold: 12, date: '2024-12-30' }
      ];
      setSalesData(dummySales);
      localStorage.setItem('restaurantSales', JSON.stringify(dummySales));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('restaurantInventory', JSON.stringify(inventoryData));
  }, [inventoryData]);

  useEffect(() => {
    localStorage.setItem('restaurantSales', JSON.stringify(salesData));
  }, [salesData]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard inventoryData={inventoryData} salesData={salesData} />;
      case 'inventory':
        return <InventoryManagement inventoryData={inventoryData} setInventoryData={setInventoryData} />;
      case 'sales':
        return <SalesEntry salesData={salesData} setSalesData={setSalesData} inventoryData={inventoryData} />;
      case 'predictor':
        return <WastePredictor inventoryData={inventoryData} salesData={salesData} />;
      case 'optimizer':
        return <Optimizer inventoryData={inventoryData} salesData={salesData} />;
      default:
        return <Dashboard inventoryData={inventoryData} salesData={salesData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Food Waste Predictor & Optimizer
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-sm"></i>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default Index;
