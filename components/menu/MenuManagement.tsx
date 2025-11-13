import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, MenuLocation } from '../../types/menu';
import { buildMenuTree } from '../../utils/menuHelpers';
import MenuList from './MenuList';
import MenuForm from './MenuForm';
import MenuLocationSelector from './MenuLocationSelector';
import MenuPreview from './MenuPreview';
import { IconPlus, IconSave, IconTrash, IconEye, IconMenu } from '../Icons';

const MENU_LOCATIONS: MenuLocation[] = [
  { id: 'header', name: 'Header Menu', slug: 'header', description: 'Main navigation menu' },
  { id: 'footer', name: 'Footer Menu', slug: 'footer', description: 'Footer links' },
  { id: 'sidebar', name: 'Sidebar Menu', slug: 'sidebar', description: 'Sidebar navigation' },
  { id: 'mobile', name: 'Mobile Menu', slug: 'mobile', description: 'Mobile navigation' },
];

const MenuManagement: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('header');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Load menus from localStorage
  useEffect(() => {
    const savedMenus = localStorage.getItem('menus');
    if (savedMenus) {
      setMenus(JSON.parse(savedMenus));
    } else {
      // Initialize with empty menus for each location
      const initialMenus: Menu[] = MENU_LOCATIONS.map(loc => ({
        id: loc.id,
        name: loc.name,
        location: loc.slug,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setMenus(initialMenus);
      localStorage.setItem('menus', JSON.stringify(initialMenus));
    }
  }, []);

  // Load menu items for selected location
  useEffect(() => {
    const menu = menus.find(m => m.location === selectedLocation);
    if (menu) {
      setMenuItems(menu.items);
    }
  }, [selectedLocation, menus]);

  const handleSaveMenu = () => {
    const updatedMenus = menus.map(menu => {
      if (menu.location === selectedLocation) {
        return {
          ...menu,
          items: menuItems,
          updatedAt: new Date().toISOString(),
        };
      }
      return menu;
    });
    setMenus(updatedMenus);
    localStorage.setItem('menus', JSON.stringify(updatedMenus));
  };

  const handleAddItem = (item: MenuItem) => {
    setMenuItems([...menuItems, item]);
    setShowForm(false);
  };

  const handleUpdateItem = (item: MenuItem) => {
    setMenuItems(menuItems.map(i => i.id === item.id ? item : i));
    setEditingItem(null);
    setShowForm(false);
  };

  const handleDeleteItem = (itemId: string) => {
    // Remove item and its children
    const removeItemAndChildren = (items: MenuItem[], id: string): MenuItem[] => {
      return items.filter(item => {
        if (item.id === id) return false;
        if (item.parentId === id) return false;
        return true;
      });
    };
    setMenuItems(removeItemAndChildren(menuItems, itemId));
  };

  const handleReorder = (items: MenuItem[]) => {
    setMenuItems(items);
  };

  const menuTree = buildMenuTree(menuItems);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Menu Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create and manage navigation menus for your site
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                showPreview
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <IconEye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              <IconPlus className="w-4 h-4" />
              Add Item
            </button>
            <button
              onClick={handleSaveMenu}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
            >
              <IconSave className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Menu Location Selector */}
      <div className="flex-shrink-0 mb-6">
        <MenuLocationSelector
          locations={MENU_LOCATIONS}
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
        />
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="flex-shrink-0 mb-6 animate-in slide-in-from-top duration-300">
          <MenuPreview 
            items={menuItems} 
            location={MENU_LOCATIONS.find(l => l.slug === selectedLocation)?.name || selectedLocation}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Menu Items List */}
        <div className={`${showForm ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col min-h-0`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Menu Structure
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {menuItems.length} {menuItems.length === 1 ? 'item' : 'items'} • Drag to reorder
                  </p>
                </div>
                {menuItems.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                      {menuItems.filter(i => i.isActive).length} Active
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                      {menuItems.filter(i => !i.isActive).length} Inactive
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {menuItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <IconMenu className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No menu items yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm">
                    Get started by adding your first menu item. You can create nested menus and organize them however you like.
                  </p>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <IconPlus className="w-4 h-4" />
                    Add Your First Item
                  </button>
                </div>
              ) : (
                <MenuList
                  items={menuTree}
                  onEdit={(item) => {
                    setEditingItem(item);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteItem}
                  onReorder={handleReorder}
                />
              )}
            </div>
          </div>
        </div>

        {/* Menu Form */}
        {showForm && (
          <div className="lg:col-span-4 flex flex-col min-h-0 animate-in slide-in-from-right duration-300">
            <MenuForm
              item={editingItem}
              parentItems={menuItems.filter(i => !editingItem || i.id !== editingItem.id)}
              onSave={editingItem ? handleUpdateItem : handleAddItem}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
