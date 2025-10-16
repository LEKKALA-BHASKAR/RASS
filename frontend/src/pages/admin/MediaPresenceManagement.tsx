import React, { useState, useEffect } from 'react';
import { mediaPresenceAPI } from '../../services/api';
import { Trash2, Edit, Plus, Save, X, ArrowUp, ArrowDown, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

interface MediaItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  journalLink: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error';
  message: string;
}

const MediaPresenceManagement: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MediaItem>>({
    title: '',
    description: '',
    imageUrl: '',
    journalLink: '',
    order: 0,
    isActive: true
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Simple notification system
  const showNotification = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 3000);
  };

  // Fetch all media items
  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      const response = await mediaPresenceAPI.getAllMediaItems();
      setMediaItems(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching media items:', error);
      showNotification('error', 'Failed to load media items');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaItems();
  }, []);

  // Add new media item
  const handleAddItem = async () => {
    try {
      if (!newItem.title || !newItem.description || !newItem.imageUrl || !newItem.journalLink) {
        return showNotification('error', 'Please fill all required fields');
      }

      console.log('Creating media item with data:', newItem);
      const response = await mediaPresenceAPI.createMediaItem(newItem);
      console.log('Media item created successfully:', response);
      showNotification('success', 'Media item added successfully');
      setNewItem({
        title: '',
        description: '',
        imageUrl: '',
        journalLink: '',
        order: 0,
        isActive: true
      });
      setShowAddForm(false);
      fetchMediaItems();
    } catch (error: any) {
      console.error('Error adding media item:', error);
      showNotification('error', 'Failed to add media item');
    }
  };

  // Update media item
  const handleUpdateItem = async () => {
    try {
      if (!editingItem) return;
      
      await mediaPresenceAPI.updateMediaItem(editingItem._id, editingItem);
      showNotification('success', 'Media item updated successfully');
      setEditingItem(null);
      fetchMediaItems();
    } catch (error: any) {
      console.error('Error updating media item:', error);
      showNotification('error', 'Failed to update media item');
    }
  };

  // Delete media item
  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this media item?')) return;
    
    try {
      await mediaPresenceAPI.deleteMediaItem(id);
      showNotification('success', 'Media item deleted successfully');
      fetchMediaItems();
    } catch (error: any) {
      console.error('Error deleting media item:', error);
      showNotification('error', 'Failed to delete media item');
    }
  };

  // Change item order
  const handleChangeOrder = async (id: string, direction: 'up' | 'down') => {
    const itemIndex = mediaItems.findIndex(item => item._id === id);
    if (
      (direction === 'up' && itemIndex === 0) || 
      (direction === 'down' && itemIndex === mediaItems.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    const currentItem = mediaItems[itemIndex];
    const swapItem = mediaItems[swapIndex];

    try {
      await Promise.all([
        mediaPresenceAPI.updateMediaItem(currentItem._id, { order: swapItem.order }),
        mediaPresenceAPI.updateMediaItem(swapItem._id, { order: currentItem.order })
      ]);
      
      fetchMediaItems();
    } catch (error: any) {
      console.error('Error changing order:', error);
      showNotification('error', 'Failed to change order');
    }
  };

  // Toggle item active status
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await mediaPresenceAPI.updateMediaItem(id, { isActive: !currentStatus });
      showNotification('success', `Media item ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchMediaItems();
    } catch (error: any) {
      console.error('Error toggling status:', error);
      showNotification('error', 'Failed to update status');
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
    <div className="p-6">
      {/* Notification display */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`px-4 py-3 rounded-md shadow-md flex items-center ${
              notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {notification.message}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Presence Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
          {showAddForm ? 'Cancel' : 'Add New Media Item'}
        </button>
      </div>

      {/* Add new media item form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Media Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="Media title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
              <input
                type="text"
                value={newItem.imageUrl}
                onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Journal Link *</label>
              <input
                type="text"
                value={newItem.journalLink}
                onChange={(e) => setNewItem({ ...newItem, journalLink: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="https://example.com/article"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <input
                type="number"
                value={newItem.order || 0}
                onChange={(e) => setNewItem({ ...newItem, order: parseInt(e.target.value) || 0 })}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Brief description of the media mention"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newItem.isActive}
                onChange={(e) => setNewItem({ ...newItem, isActive: e.target.checked })}
                className="mr-2"
                id="isActive"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAddItem}
              className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Save size={18} /> Save Media Item
            </button>
          </div>
        </div>
      )}

      {/* Media items list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mediaItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No media items found
                </td>
              </tr>
            ) : (
              mediaItems.map((item) => (
                <tr key={item._id} className={!item.isActive ? 'bg-gray-100' : ''}>
                  {editingItem && editingItem._id === item._id ? (
                    // Edit mode
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editingItem.imageUrl}
                          onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                          className="w-full p-2 border rounded-md"
                          placeholder="Image URL"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editingItem.title}
                          onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                          className="w-full p-2 border rounded-md"
                          placeholder="Title"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          value={editingItem.description}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          className="w-full p-2 border rounded-md"
                          rows={2}
                          placeholder="Description"
                        />
                        <input
                          type="text"
                          value={editingItem.journalLink}
                          onChange={(e) => setEditingItem({ ...editingItem, journalLink: e.target.value })}
                          className="w-full p-2 border rounded-md mt-2"
                          placeholder="Journal Link"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editingItem.isActive}
                            onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                            className="mr-2"
                          />
                          <span>Active</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={editingItem.order || 0}
                          onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })}
                          className="w-20 p-2 border rounded-md"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={handleUpdateItem}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td className="px-6 py-4">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="h-12 w-auto object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/50x50?text=Error';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4">
                        <div className="line-clamp-2">{item.description}</div>
                        <a 
                          href={item.journalLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Article
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">{item.order}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleActive(item._id, item.isActive)}
                            className={`${
                              item.isActive ? 'text-gray-600' : 'text-green-600'
                            } hover:text-gray-900`}
                            title={item.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {item.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => setEditingItem(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => handleChangeOrder(item._id, 'up')}
                            disabled={mediaItems.indexOf(item) === 0}
                            className={`${
                              mediaItems.indexOf(item) === 0 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            <ArrowUp size={18} />
                          </button>
                          <button
                            onClick={() => handleChangeOrder(item._id, 'down')}
                            disabled={mediaItems.indexOf(item) === mediaItems.length - 1}
                            className={`${
                              mediaItems.indexOf(item) === mediaItems.length - 1 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            <ArrowDown size={18} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default MediaPresenceManagement;