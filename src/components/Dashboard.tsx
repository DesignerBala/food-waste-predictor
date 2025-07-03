
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface DashboardProps {
  inventoryData: any[];
  salesData: any[];
}

const Dashboard = ({ inventoryData, salesData }: DashboardProps) => {
  const wasteChartRef = useRef<HTMLCanvasElement>(null);
  const inventoryChartRef = useRef<HTMLCanvasElement>(null);
  const topWastedChartRef = useRef<HTMLCanvasElement>(null);
  
  // Store chart instances to properly destroy them
  const wasteChartInstance = useRef<any>(null);
  const inventoryChartInstance = useRef<any>(null);
  const topWastedChartInstance = useRef<any>(null);

  // Calculate dashboard statistics
  const totalItems = inventoryData.length;
  const expiringItems = inventoryData.filter(item => {
    const daysToExpiry = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysToExpiry <= 2;
  }).length;

  const totalSales = salesData.reduce((sum, sale) => sum + sale.quantitySold, 0);
  const wastePercentage = inventoryData.length > 0 ? Math.round((expiringItems / totalItems) * 100) : 0;

  useEffect(() => {
    // Destroy existing charts before creating new ones
    if (wasteChartInstance.current) {
      wasteChartInstance.current.destroy();
      wasteChartInstance.current = null;
    }
    if (inventoryChartInstance.current) {
      inventoryChartInstance.current.destroy();
      inventoryChartInstance.current = null;
    }
    if (topWastedChartInstance.current) {
      topWastedChartInstance.current.destroy();
      topWastedChartInstance.current = null;
    }

    // Waste Trends Chart
    if (wasteChartRef.current) {
      const ctx = wasteChartRef.current.getContext('2d');
      if (ctx) {
        wasteChartInstance.current = new (window as any).Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Daily Waste (kg)',
              data: [5, 8, 3, 12, 7, 15, 4],
              borderColor: '#f97316',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: '#f3f4f6'
                }
              },
              x: {
                grid: {
                  color: '#f3f4f6'
                }
              }
            }
          }
        });
      }
    }

    // Inventory vs Sales Chart
    if (inventoryChartRef.current) {
      const ctx = inventoryChartRef.current.getContext('2d');
      if (ctx) {
        inventoryChartInstance.current = new (window as any).Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Sold', 'In Stock', 'Predicted Waste'],
            datasets: [{
              data: [60, 30, 10],
              backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });
      }
    }

    // Top Wasted Items Chart
    if (topWastedChartRef.current) {
      const ctx = topWastedChartRef.current.getContext('2d');
      if (ctx) {
        topWastedChartInstance.current = new (window as any).Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Tomatoes', 'Lettuce', 'Bread', 'Milk', 'Chicken'],
            datasets: [{
              label: 'Waste Amount (kg)',
              data: [12, 8, 6, 4, 3],
              backgroundColor: '#ef4444',
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: '#f3f4f6'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }
    }

    // Cleanup function to destroy charts when component unmounts
    return () => {
      if (wasteChartInstance.current) {
        wasteChartInstance.current.destroy();
      }
      if (inventoryChartInstance.current) {
        inventoryChartInstance.current.destroy();
      }
      if (topWastedChartInstance.current) {
        topWastedChartInstance.current.destroy();
      }
    };
  }, [inventoryData, salesData]);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Items</p>
              <p className="text-3xl font-bold">{totalItems}</p>
            </div>
            <i className="fas fa-boxes text-2xl text-blue-200"></i>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Sales</p>
              <p className="text-3xl font-bold">{totalSales}</p>
            </div>
            <i className="fas fa-chart-line text-2xl text-green-200"></i>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Expiring Soon</p>
              <p className="text-3xl font-bold">{expiringItems}</p>
            </div>
            <i className="fas fa-exclamation-triangle text-2xl text-orange-200"></i>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Waste %</p>
              <p className="text-3xl font-bold">{wastePercentage}%</p>
            </div>
            <i className="fas fa-percentage text-2xl text-purple-200"></i>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Weekly Waste Trends</h3>
          <div className="h-64">
            <canvas ref={wasteChartRef}></canvas>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Inventory Distribution</h3>
          <div className="h-64">
            <canvas ref={inventoryChartRef}></canvas>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Top 5 Most Wasted Items</h3>
          <div className="h-64">
            <canvas ref={topWastedChartRef}></canvas>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-left">
              <i className="fas fa-plus mr-2"></i>
              Add New Item
            </button>
            <button className="w-full p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-left">
              <i className="fas fa-chart-bar mr-2"></i>
              Record Sales
            </button>
            <button className="w-full p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-left">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Check Waste Alerts
            </button>
            <button className="w-full p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <i className="fas fa-lightbulb mr-2"></i>
              View Suggestions
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
