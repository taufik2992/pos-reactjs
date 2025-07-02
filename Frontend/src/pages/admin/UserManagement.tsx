import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, User } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { FileUpload } from '../../components/ui/FileUpload';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { User as UserType } from '../../types';
import { users as initialUsers } from '../../data/users';
import toast from 'react-hot-toast';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cashier' as 'admin' | 'cashier',
    password: '',
    avatar: '',
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'cashier',
      password: '',
      avatar: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      avatar: user.avatar || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users => users.filter(user => user.id !== id));
      toast.success('User deleted successfully!');
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users =>
      users.map(user =>
        user.id === id ? { ...user, isActive: !user.isActive } : user
      )
    );
    toast.success('User status updated successfully!');
  };

  const handleAvatarUpload = (file: File | null, dataUrl: string) => {
    setFormData({ ...formData, avatar: dataUrl });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      setUsers(users =>
        users.map(user =>
          user.id === editingUser.id
            ? {
                ...user,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                avatar: formData.avatar,
                ...(formData.password && { password: formData.password }),
              }
            : user
        )
      );
      toast.success('User updated successfully!');
    } else {
      const newUser: UserType = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password,
        avatar: formData.avatar,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      setUsers(users => [...users, newUser]);
      toast.success('User added successfully!');
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-center sm:text-left w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Manage restaurant staff and access
          </p>
        </div>
        <Button onClick={handleAdd} icon={Plus} className="w-full sm:w-auto">
          Add New User
        </Button>
      </div>

      <Card>
        <div className="mb-4 sm:mb-6">
          <Input
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search users..."
            icon={Search}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>User</TableCell>
              <TableCell header className="hidden sm:table-cell">Role</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header className="hidden md:table-cell">Created</TableCell>
              <TableCell header className="text-right">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {user.avatar ? (
                      <img
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover flex-shrink-0"
                        src={user.avatar}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </div>
                      <div className="sm:hidden">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  }`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                      user.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </button>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-gray-500 dark:text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1 sm:space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(user)}
                      icon={Edit}
                      className="text-xs"
                    >
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    {user.role !== 'admin' && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(user.id)}
                        icon={Trash2}
                        className="text-xs"
                      >
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No users found
            </p>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'cashier' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <Input
            label={editingUser ? "New Password (leave empty to keep current)" : "Password"}
            type="password"
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
            required={!editingUser}
          />
          
          <FileUpload
            label="Avatar"
            value={formData.avatar}
            onChange={handleAvatarUpload}
          />
          
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {editingUser ? 'Update' : 'Add'} User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};