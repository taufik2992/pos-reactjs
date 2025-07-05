import React, { useState, useEffect } from 'react';
import { Search, Eye, FileText } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, menuAPI, formatIDR } from '../../services/api';
import toast from 'react-hot-toast';

export const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    loadMenuItems();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      if (response.data.success) {
        // Filter orders by current user if cashier
        const userOrders = user?.role === 'cashier' 
          ? response.data.orders.filter(order => order.cashierId._id === user.id)
          : response.data.orders;
        setOrders(userOrders);
      }
    } catch (error) {
      toast.error('Gagal memuat riwayat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const loadMenuItems = async () => {
    try {
      const response = await menuAPI.getAll();
      if (response.data.success) {
        setMenuItems(response.data.menuItems);
      }
    } catch (error) {
      console.error('Failed to load menu items:', error);
    }
  };

  const filteredOrders = orders.filter((order: any) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMenuItemById = (id: string) => {
    return menuItems.find((item: any) => item._id === id);
  };

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const printReceipt = (order: any) => {
    const receipt = `
      Restaurant POS Receipt
      =====================
      Order ID: ${order._id.slice(-6)}
      Date: ${new Date(order.createdAt).toLocaleString('id-ID')}
      Customer: ${order.customerName || 'Walk-in Customer'}
      Cashier: ${user?.nama}
      
      Items:
      ${order.items.map((item: any) => {
        const menuItem = getMenuItemById(item.menuItemId);
        return `${menuItem?.name} x${item.quantity} - ${formatIDR(item.subtotal)}`;
      }).join('\n')}
      
      Total: ${formatIDR(order.total)}
      Payment: ${order.paymentMethod.toUpperCase()}
      
      Terima kasih atas kunjungan Anda!
    `;
    
    console.log(receipt);
    toast.success('Struk dikirim ke printer!');
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
          Riwayat Pesanan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
          Lihat semua pesanan yang telah diproses
        </p>
      </div>

      <Card>
        <div className="mb-4 sm:mb-6">
          <Input
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Cari pesanan berdasarkan ID atau nama pelanggan..."
            icon={Search}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>ID Pesanan</TableCell>
              <TableCell header className="hidden sm:table-cell">Pelanggan</TableCell>
              <TableCell header>Total</TableCell>
              <TableCell header className="hidden md:table-cell">Pembayaran</TableCell>
              <TableCell header className="hidden lg:table-cell">Tanggal</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header className="text-right">Aksi</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order: any) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      #{order._id.slice(-6)}
                    </div>
                    <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400">
                      {order.customerName || 'Walk-in Customer'}
                    </div>
                    <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400">
                      {order.items.length} item
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-gray-500 dark:text-gray-400">
                  <div>
                    <div>{order.customerName || 'Walk-in Customer'}</div>
                    <div className="text-xs">{order.items.length} item</div>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatIDR(order.total)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.paymentMethod === 'cash' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  }`}>
                    {order.paymentMethod === 'cash' ? 'TUNAI' : 'DIGITAL'}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-gray-500 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString('id-ID')}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {order.status === 'completed' ? 'SELESAI' : 
                     order.status === 'pending' ? 'PENDING' : 
                     order.status === 'processing' ? 'PROSES' : 'BATAL'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1 sm:space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewOrderDetails(order)}
                      icon={Eye}
                      className="text-xs"
                    >
                      <span className="hidden sm:inline">Lihat</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => printReceipt(order)}
                      icon={FileText}
                      className="text-xs"
                    >
                      <span className="hidden sm:inline">Cetak</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Tidak ada pesanan ditemukan
            </p>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Detail Pesanan - #${selectedOrder?._id.slice(-6)}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Informasi Pesanan</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">ID Pesanan:</span> #{selectedOrder._id.slice(-6)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Tanggal:</span> {new Date(selectedOrder.createdAt).toLocaleString('id-ID')}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Pelanggan:</span> {selectedOrder.customerName || 'Walk-in Customer'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Pembayaran:</span> {selectedOrder.paymentMethod === 'cash' ? 'TUNAI' : 'DIGITAL'}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Ringkasan Pesanan</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Item:</span> {selectedOrder.items.length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Total:</span> {formatIDR(selectedOrder.total)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                      selectedOrder.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {selectedOrder.status === 'completed' ? 'SELESAI' : 'PENDING'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Item Pesanan</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item: any) => {
                  const menuItem = getMenuItemById(item.menuItemId);
                  return (
                    <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        {menuItem?.image && (
                          <img 
                            src={menuItem.image} 
                            alt={menuItem.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                            {menuItem?.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {formatIDR(item.price)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base ml-4">
                        {formatIDR(item.subtotal)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => printReceipt(selectedOrder)}
                icon={FileText}
                className="w-full sm:w-auto"
              >
                Cetak Struk
              </Button>
              <Button onClick={() => setIsDetailOpen(false)} className="w-full sm:w-auto">
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};