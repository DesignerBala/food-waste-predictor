
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  addedDate: string;
}

interface InventoryManagementProps {
  inventoryData: InventoryItem[];
  setInventoryData: (data: InventoryItem[]) => void;
}

const InventoryManagement = ({ inventoryData, setInventoryData }: InventoryManagementProps) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    expiryDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.quantity || !formData.expiryDate) {
      alert('Please fill in all fields');
      return;
    }

    const newItem: InventoryItem = {
      id: Date.now(),
      name: formData.name,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      expiryDate: formData.expiryDate,
      addedDate: new Date().toISOString().split('T')[0]
    };

    setInventoryData([...inventoryData, newItem]);
    
    // Reset form
    setFormData({
      name: '',
      quantity: '',
      unit: 'kg',
      expiryDate: ''
    });
  };

  const handleDelete = (id: number) => {
    setInventoryData(inventoryData.filter(item => item.id !== id));
  };

  const getDaysToExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (daysToExpiry: number) => {
    if (daysToExpiry < 0) return { text: 'Expired', color: 'text-red-600 bg-red-50' };
    if (daysToExpiry <= 1) return { text: 'Expires Today', color: 'text-red-600 bg-red-50' };
    if (daysToExpiry <= 3) return { text: 'Expires Soon', color: 'text-orange-600 bg-orange-50' };
    return { text: 'Fresh', color: 'text-green-600 bg-green-50' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <div className="text-sm text-gray-500">
          Total Items: {inventoryData.length}
        </div>
      </div>

      {/* Add New Item Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Add New Item</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Tomatoes"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              step="0.1"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="e.g., 50"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="unit">Unit</Label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="kg">kg</option>
              <option value="liters">liters</option>
              <option value="pieces">pieces</option>
              <option value="heads">heads</option>
              <option value="boxes">boxes</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-end">
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              <i className="fas fa-plus mr-2"></i>
              Add Item
            </Button>
          </div>
        </form>
      </Card>

      {/* Inventory Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryData.map((item) => {
                const daysToExpiry = getDaysToExpiry(item.expiryDate);
                const status = getExpiryStatus(daysToExpiry);
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity} {item.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.addedDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.expiryDate}</div>
                      <div className="text-xs text-gray-500">
                        {daysToExpiry >= 0 ? `${daysToExpiry} days left` : `${Math.abs(daysToExpiry)} days ago`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {inventoryData.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-boxes text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">No items in inventory. Add your first item above!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InventoryManagement;
