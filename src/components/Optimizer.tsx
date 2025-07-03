
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OptimizerProps {
  inventoryData: any[];
  salesData: any[];
}

const Optimizer = ({ inventoryData, salesData }: OptimizerProps) => {
  // Calculate optimization suggestions
  const generateSuggestions = () => {
    const suggestions = [];

    inventoryData.forEach(item => {
      const daysToExpiry = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate sales data for this item
      const itemSales = salesData.filter(sale => sale.itemName === item.name);
      const totalSold = itemSales.reduce((sum, sale) => sum + sale.quantitySold, 0);
      const remainingStock = item.quantity - totalSold;
      
      const recentSales = itemSales.filter(sale => 
        new Date(sale.date) >= new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      );
      const dailySalesRate = recentSales.length > 0 ? 
        recentSales.reduce((sum, sale) => sum + sale.quantitySold, 0) / 3 : 0;

      // Generate specific suggestions based on conditions
      
      // 1. Reduce order quantity for slow-moving items
      if (dailySalesRate < 2 && remainingStock > item.quantity * 0.5) {
        suggestions.push({
          type: 'reduce_order',
          priority: 'medium',
          item: item.name,
          title: `Reduce order quantity for ${item.name}`,
          description: `Current daily sales rate (${dailySalesRate.toFixed(1)} ${item.unit}/day) is low. Consider reducing next order by 30-40%.`,
          action: 'Reduce next order',
          impact: 'Cost savings',
          icon: 'fas fa-arrow-down'
        });
      }

      // 2. Expiring soon alerts
      if (daysToExpiry <= 2 && remainingStock > 0) {
        suggestions.push({
          type: 'urgent_sale',
          priority: 'high',
          item: item.name,
          title: `Urgent: ${item.name} expires in ${daysToExpiry} days`,
          description: `${remainingStock} ${item.unit} remaining. Create special promotions or bundle deals immediately.`,
          action: 'Create promotion',
          impact: 'Prevent waste',
          icon: 'fas fa-exclamation-triangle'
        });
      }

      // 3. Combine leftovers into special dishes
      if (remainingStock > 0 && remainingStock < item.quantity * 0.3 && daysToExpiry <= 5) {
        suggestions.push({
          type: 'special_menu',
          priority: 'medium',
          item: item.name,
          title: `Create special dish with ${item.name}`,
          description: `Use remaining ${remainingStock} ${item.unit} to create daily specials or combo meals.`,
          action: 'Add to specials menu',
          impact: 'Revenue recovery',
          icon: 'fas fa-utensils'
        });
      }

      // 4. High performing items - increase stock
      if (dailySalesRate > 5 && remainingStock < item.quantity * 0.2) {
        suggestions.push({
          type: 'increase_stock',
          priority: 'medium',
          item: item.name,
          title: `Consider increasing ${item.name} stock`,
          description: `High sales rate (${dailySalesRate.toFixed(1)} ${item.unit}/day) with low remaining stock. Risk of stockout.`,
          action: 'Increase order',
          impact: 'Prevent stockout',
          icon: 'fas fa-arrow-up'
        });
      }
    });

    // 5. Cross-category suggestions
    const expiringItems = inventoryData.filter(item => {
      const daysToExpiry = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysToExpiry <= 3;
    });

    if (expiringItems.length >= 2) {
      suggestions.push({
        type: 'combo_deal',
        priority: 'high',
        item: expiringItems.map(item => item.name).join(', '),
        title: 'Create combo deals with expiring items',
        description: `Bundle ${expiringItems.length} expiring items into attractive combo meals or discounted packages.`,
        action: 'Create combo deal',
        impact: 'Waste reduction',
        icon: 'fas fa-gift'
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const suggestions = generateSuggestions();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Prevent waste': return 'bg-red-100 text-red-800';
      case 'Cost savings': return 'bg-green-100 text-green-800';
      case 'Revenue recovery': return 'bg-blue-100 text-blue-800';
      case 'Prevent stockout': return 'bg-purple-100 text-purple-800';
      case 'Waste reduction': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Quick actions based on current inventory state
  const quickActions = [
    {
      title: 'Staff Training Module',
      description: 'Train staff on FIFO (First In, First Out) inventory management',
      icon: 'fas fa-chalkboard-teacher',
      color: 'bg-blue-500'
    },
    {
      title: 'Supplier Communication',
      description: 'Send optimized order quantities to suppliers based on sales data',
      icon: 'fas fa-truck',
      color: 'bg-green-500'
    },
    {
      title: 'Price Optimization',
      description: 'Implement dynamic pricing for items approaching expiry',
      icon: 'fas fa-tags',
      color: 'bg-purple-500'
    },
    {
      title: 'Donation Program',
      description: 'Set up partnerships with local food banks for surplus items',
      icon: 'fas fa-hands-helping',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Optimization Suggestions</h2>
        <div className="text-sm text-gray-500">
          Smart recommendations to reduce waste and optimize operations
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {suggestions.filter(s => s.priority === 'high').length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {suggestions.filter(s => s.priority === 'medium').length}
            </div>
            <div className="text-sm text-gray-600">Medium Priority</div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {suggestions.length}
            </div>
            <div className="text-sm text-gray-600">Total Suggestions</div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {Math.round((suggestions.filter(s => s.type === 'urgent_sale' || s.type === 'special_menu').length / suggestions.length) * 100) || 0}%
            </div>
            <div className="text-sm text-gray-600">Waste Prevention</div>
          </div>
        </Card>
      </div>

      {/* Optimization Suggestions */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Actionable Recommendations</h3>
        </div>
        <div className="p-6 space-y-4">
          {suggestions.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-check-circle text-4xl text-green-400 mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Good!</h3>
              <p className="text-gray-600">No urgent optimization suggestions at the moment. Keep monitoring your inventory!</p>
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(suggestion.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <i className={`${suggestion.icon} text-xl`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{suggestion.title}</h4>
                      <p className="text-gray-700 mb-2">{suggestion.description}</p>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(suggestion.impact)}`}>
                          {suggestion.impact}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {suggestion.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button 
                      size="sm" 
                      className={`${suggestion.priority === 'high' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'} text-white`}
                    >
                      {suggestion.action}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions & Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                <i className={action.icon}></i>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{action.title}</h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </div>
          ))}
        </div>
      </Card>

      {/* Tips and Best Practices */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <i className="fas fa-lightbulb mr-2"></i>
          Pro Tips for Waste Reduction
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-blue-800">Inventory Management</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Implement FIFO (First In, First Out) system</li>
              <li>• Regular inventory audits twice daily</li>
              <li>• Use clear labeling with dates</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-blue-800">Sales Optimization</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Create daily specials for expiring items</li>
              <li>• Offer staff meals to reduce waste</li>
              <li>• Partner with delivery apps for quick sales</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Optimizer;
