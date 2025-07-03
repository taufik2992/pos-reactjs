import React from 'react';
import { ShoppingCart, Clock, DollarSign, Coffee } from 'lucide-react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { WorkShiftTimer } from '../../components/ui/WorkShiftTimer';
import { useAuth } from '../../context/AuthContext';
import { orders } from '../../data/orders';
import { menuItems } from '../../data/menu';
import { useNavigate } from 'react-router-dom';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const userOrders = orders.filter(order => order.cashierId === user?.id);
  const todaySales = userOrders.reduce((sum, order) => sum + order.total, 0);
  const todayOrders = userOrders.length;

  const recentOrders = userOrders.slice(-5);
  const lowStockItems = menuItems.filter(item => item.stock < 10);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Selamat Bekerja, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
          Semua kemajuan terjadi di luar zona nyaman.
        </p>
      </div>

      {/* Work Shift Timer - Only for cashiers */}
      {user?.role === 'cashier' && (
        <WorkShiftTimer />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Today's Sales"
          value={`$${todaySales.toFixed(2)}`}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Orders Processed"
          value={todayOrders}
          icon={ShoppingCart}
          color="blue"
        />
        <StatsCard
          title="Avg Order Time"
          value="8 mins"
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Items Served"
          value={userOrders.reduce((sum, order) => sum + order.items.length, 0)}
          icon={Coffee}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h3>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/user/orders')}
              className="w-full justify-start"
              icon={ShoppingCart}
            >
              Create New Order
            </Button>
            <Button
              onClick={() => navigate('/user/history')}
              variant="outline"
              className="w-full justify-start"
              icon={Clock}
            >
              View Order History
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Orders
          </h3>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      Order #{order.id}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                      {order.customerName || 'Walk-in Customer'}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
                No recent orders
              </p>
            )}
          </div>
        </Card>
      </div>

      {lowStockItems.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ⚠️ Low Stock Alert
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {item.name}
                    </p>
                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                      Only {item.stock} left
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};