import React, { useState, useEffect } from 'react';
import { MenuItem } from '../../types/menu';
import { generateMenuItemId } from '../../utils/menuHelpers';
import { IconX } from '../Icons';

interface MenuFormProps {
  item: MenuItem | null;
  parentItems: MenuItem[];
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({ item, parentItems, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    titleFa: '',
    url: '',
    parentId: null as string | null,
    order: 0,
    isActive: true,
    target: '_self' as '_self' | '_blank',
    icon: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        titleAr: item.titleAr || '',
        titleFa: item.titleFa || '',
        url: item.url,
        parentId: item.parentId,
        order: item.order,
        isActive: item.isActive,
        target: item.target,
        icon: item.icon || '',
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const menuItem: MenuItem = {
      id: item?.id || generateMenuItemId(),
      ...formData,
      createdAt: item?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(menuItem);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {item ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {item ? 'Update the menu item details' : 'Fill in the details below'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Close form"
        >
          <IconX className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Title (English) */}
        <div>
          <label htmlFor="title-en" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title (English) *
          </label>
          <input
            id="title-en"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Title (Arabic) */}
        <div>
          <label htmlFor="title-ar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title (Arabic)
          </label>
          <input
            id="title-ar"
            type="text"
            value={formData.titleAr}
            onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            dir="rtl"
          />
        </div>

        {/* Title (Persian) */}
        <div>
          <label htmlFor="title-fa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title (Persian)
          </label>
          <input
            id="title-fa"
            type="text"
            value={formData.titleFa}
            onChange={(e) => setFormData({ ...formData, titleFa: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            dir="rtl"
          />
        </div>

        {/* URL */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            URL *
          </label>
          <input
            id="url"
            type="text"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="/page or https://example.com"
            required
          />
        </div>

        {/* Parent Item */}
        <div>
          <label htmlFor="parent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Parent Item
          </label>
          <select
            id="parent"
            value={formData.parentId || ''}
            onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">None (Top Level)</option>
            {parentItems.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.title}
              </option>
            ))}
          </select>
        </div>

        {/* Order */}
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Order
          </label>
          <input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>

        {/* Target */}
        <div>
          <label htmlFor="target" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Open Link In
          </label>
          <select
            id="target"
            value={formData.target}
            onChange={(e) => setFormData({ ...formData, target: e.target.value as '_self' | '_blank' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="_self">Same Window</option>
            <option value="_blank">New Window</option>
          </select>
        </div>

        {/* Icon */}
        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Icon (Optional)
          </label>
          <input
            id="icon"
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="icon-name"
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Active
          </label>
        </div>

      </form>
      
      {/* Actions - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            type="button"
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            {item ? 'Update' : 'Add'} Item
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuForm;
