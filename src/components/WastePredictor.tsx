
import React from 'react';
import { Card } from '@/components/ui/card';

interface WastePredictorProps {
  inventoryData: any[];
  salesData: any[];
}

const WastePredictor = ({ inventoryData, salesData }: WastePredictorProps) => {
  // Waste prediction algorithm
  const predictWaste = () => {
    return inventoryData.map(item => {
      const daysToExpiry = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate sales velocity (how much is being sold per day)
      const recentSales = salesData.filter(sale => 
        sale.itemName === item.name && 
        new Date(sale.date) >= new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // Last 3 days
      );
      
      const totalRecentSales = recentSales.reduce((sum, sale) => sum + sale.quantitySold, 0);
      const dailySalesRate = recentSales.length > 0 ? totalRecentSales / 3 : 0;
      
      // Calculate remaining stock after total sales
      const totalSold = salesData
        .filter(sale => sale.itemName === item.name)
        .reduce((sum, sale) => sum + sale.quantitySold, 0);
      
      const remainingStock = item.quantity - totalSold;
      const daysToSellOut = dailySalesRate > 0 ? remainingStock / dailySalesRate : Infinity;
      
      // Prediction logic
      let wasteRisk = 'Low';
      let wasteProbability = 0;
      let reasons = [];
      
      // Rule 1: Item expires within 2 days and has poor sales
      if (daysToExpiry <= 2 && dailySalesRate < remainingStock / 2) {
        wasteRisk = 'High';
        wasteProbability = 80;
        reasons.push('Expires very soon with low sales rate');
      }
      // Rule 2: Item hasn't sold in 3 days and expires within 5 days
      else if (dailySalesRate === 0 && daysToExpiry <= 5) {
        wasteRisk = 'High';
        wasteProbability = 70;
        reasons.push('No recent sales and expiring soon');
      }
      // Rule 3: Sales rate too slow compared to expiry
      else if (daysToSellOut > daysToExpiry && daysToExpiry <= 7) {
        wasteRisk = 'Medium';
        wasteProbability = 50;
        reasons.push('Sales rate too slow for expiry timeline');
      }
      // Rule 4: Large leftover stock with approaching expiry
      else if (remainingStock > item.quantity * 0.7 && daysToExpiry <= 5) {
        wasteRisk = 'Medium';
        wasteProbability = 40;
        reasons.push('High remaining stock with approaching expiry');
      }
      // Rule 5: Low risk items
      else if (daysToExpiry > 7 || dailySalesRate >= remainingStock / daysToExpiry) {
        wasteRisk = 'Low';
        wasteProbability = 10;
        reasons.push('Good sales rate or sufficient time to expiry');
      }
      
      return {
        ...item,
        daysToExpiry,
        remainingStock,
        dailySalesRate,
        daysToSellOut,
        wasteRisk,
        wasteProbability,
        reasons,
        predictedWasteAmount: wasteRisk === 'High' ? remainingStock * 0.8 : 
                           wasteRisk === 'Medium' ? remainingStock * 0.4 : 
                           remainingStock * 0.1
      };
    }).sort((a, b) => b.wasteProbability - a.wasteProbability);
  };

  const wastePredicitions = predictWaste();
  const highRiskItems = wastePredicitions.filter(item => item.wasteRisk === 'High');
  const mediumRiskItems = wastePredicitions.filter(item => item.wasteRisk === 'Medium');

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const totalPredictedWaste = wastePredicitions.reduce((sum, item) => sum + item.predictedWasteAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Waste Predictor</h2>
        <div className="text-sm text-gray-500">
          Prediction based on sales velocity and expiry dates
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-red-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">High Risk Items</p>
              <p className="text-3xl font-bold text-red-700">{highRiskItems.length}</p>
            </div>
            <i className="fas fa-exclamation-triangle text-2xl text-red-400"></i>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-orange-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Medium Risk Items</p>
              <p className="text-3xl font-bold text-orange-700">{mediumRiskItems.length}</p>
            </div>
            <i className="fas fa-exclamation-circle text-2xl text-orange-400"></i>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-blue-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Predicted Waste</p>
              <p className="text-3xl font-bold text-blue-700">{totalPredictedWaste.toFixed(1)} kg</p>
            </div>
            <i className="fas fa-chart-line text-2xl text-blue-400"></i>
          </div>
        </Card>
      </div>

      {/* Waste Predictions Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Waste Predictions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days to Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Daily Sales Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Predicted Waste
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reasons
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {wastePredicitions.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.remainingStock} {item.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.daysToExpiry >= 0 ? `${item.daysToExpiry} days` : 'Expired'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.dailySalesRate.toFixed(1)} {item.unit}/day</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getRiskColor(item.wasteRisk)}`}>
                      {item.wasteRisk} ({item.wasteProbability}%)
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.predictedWasteAmount.toFixed(1)} {item.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {item.reasons.map((reason, index) => (
                        <div key={index} className="mb-1">• {reason}</div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Urgent Actions Required */}
      {highRiskItems.length > 0 && (
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Urgent Actions Required
          </h3>
          <div className="space-y-2">
            {highRiskItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-200">
                <div>
                  <span className="font-medium text-red-800">{item.name}</span>
                  <span className="text-red-600 ml-2">
                    ({item.remainingStock} {item.unit} remaining, expires in {item.daysToExpiry} days)
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                    Create Promotion
                  </button>
                  <button className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">
                    Move to Specials
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default WastePredictor;
