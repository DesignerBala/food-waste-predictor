
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SalesItem {
  id: number;
  itemName: string;
  quantitySold: number;
  date: string;
}

interface SalesEntryProps {
  salesData: SalesItem[];
  setSalesData: (data: SalesItem[]) => void;
  inventoryData: any[];
}

const SalesEntry = ({ salesData, setSalesData, inventoryData }: SalesEntryProps) => {
  const [formData, setFormData] = useState({
    itemName: '',
    quantitySold: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.quantitySold) {
      alert('Please fill in all fields');
      return;
    }

    const newSale: SalesItem = {
      id: Date.now(),
      itemName: formData.itemName,
      quantitySold: parseFloat(formData.quantitySold),
      date: formData.date
    };

    setSalesData([...salesData, newSale]);
    
    // Reset form
    setFormData({
      itemName: '',
      quantitySold: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDelete = (id: number) => {
    setSalesData(salesData.filter(sale => sale.id !== id));
  };

  // Calculate leftover stock for each inventory item
  const calculateLeftoverStock = () => {
    return inventoryData.map(item => {
      const totalSold = salesData
        .filter(sale => sale.itemName === item.name)
        .reduce((sum, sale) => sum + sale.quantitySold, 0);
      
      const leftover = item.quantity - totalSold;
      return {
        ...item,
        sold: totalSold,
        leftover: Math.max(0, leftover)
      };
    });
  };

  const leftoverStock = calculateLeftoverStock();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Sales Entry</h2>
        <div className="text-sm text-gray-500">
          Total Sales Records: {salesData.length}
        </div>
      </div>

      {/* Add New Sale Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Record Daily Sales</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="itemName">Item Name</Label>
            <select
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Item</option>
              {inventoryData.map(item => (
                <option key={item.id} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="quantitySold">Quantity Sold</Label>
            <Input
              id="quantitySold"
              name="quantitySold"
              type="number"
              step="0.1"
              value={formData.quantitySold}
              onChange={handleInputChange}
              placeholder="e.g., 15"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-end">
            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
              <i className="fas fa-plus mr-2"></i>
              Record Sale
            </Button>
          </div>
        </form>
      </Card>

      {/* Sales Records */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Sales Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sale.itemName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sale.quantitySold}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sale.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Leftover Stock Analysis */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Inventory vs Sales Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Initial Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leftover Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leftoverStock.map((item) => {
                const utilizationRate = (item.sold / item.quantity) * 100;
                let status = { text: 'Good', color: 'text-green-600 bg-green-50' };
                
                if (utilizationRate < 30) {
                  status = { text: 'Poor Sales', color: 'text-red-600 bg-red-50' };
                } else if (utilizationRate < 60) {
                  status = { text: 'Moderate', color: 'text-orange-600 bg-orange-50' };
                }
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity} {item.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.sold} {item.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.leftover} {item.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {utilizationRate.toFixed(1)}% utilized
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SalesEntry;
