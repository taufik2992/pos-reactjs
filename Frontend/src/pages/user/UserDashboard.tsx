import React, { useEffect, useState } from 'react';
import { ShoppingCart, Clock, DollarSign, Coffee } from 'lucide-react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { WorkShiftTimer } from '../../components/ui/WorkShiftTimer';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, menuAPI, formatIDR } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todaySales: 0,
    todayOrders: 0,
    totalItems: 0,
    lowStockItems: []
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load orders stats
      const ordersResponse = await orderAPI.getStats();
      if (ordersResponse.data.success) {
        setStats(prev => ({
          ...prev,
          todaySales: ordersResponse.data.stats.totalRevenue || 0,
          todayOrders: ordersResponse.data.stats.totalOrders || 0
        }));
      }

      // Load recent orders
      const recentOrdersResponse = await orderAPI.getAll({ limit: 5 });
      if (recentOrdersResponse.data.success) {
        setRecentOrders(recentOrdersResponse.data.orders);
      }

      // Load menu items for low stock check
      const menuResponse = await menuAPI.getAll();
      if (menuResponse.data.success) {
        const lowStock = menuResponse.data.menuItems.filter(item => item.stock < 10);
        setStats(prev => ({
          ...prev,
          totalItems: menuResponse.data.menuItems.reduce((sum, order) => sum + order.stock, 0),
          lowStockItems: lowStock
        }));
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Selamat Bekerja, {user?.nama}!
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
          title="Penjualan Hari Ini"
          value={formatIDR(stats.todaySales)}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Pesanan Diproses"
          value={stats.todayOrders}
          icon={ShoppingCart}
          color="blue"
        />
        <StatsCard
          title="Rata-rata Waktu"
          value="8 menit"
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Item Tersedia"
          value={stats.totalItems}
          icon={Coffee}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Aksi Cepat
            </h3>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/user/orders')}
              className="w-full justify-start"
              icon={ShoppingCart}
            >
              Buat Pesanan Baru
            </Button>
            <Button
              onClick={() => navigate('/user/history')}
              variant="outline"
              className="w-full justify-start"
              icon={Clock}
            >
              Lihat Riwayat Pesanan
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pesanan Terbaru
          </h3>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order: any) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      Pesanan #{order._id.slice(-6)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                      {order.customerName || 'Walk-in Customer'}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {formatIDR(order.total)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
                Belum ada pesanan terbaru
              </p>
            )}
          </div>
        </Card>
      </div>

      {stats.lowStockItems.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ⚠️ Peringatan Stok Rendah
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.lowStockItems.map((item: any) => (
              <div key={item._id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
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
                      Tersisa {item.stock}
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