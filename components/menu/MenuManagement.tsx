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
    <div className="h-full flex flex-col space-y-5">
      {/* Header */}
      <div className="flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <IconMenu className="w-5 h-5 text-blue-600" />
              Menu Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Create and manage navigation menus
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                showPreview
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <IconEye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowForm(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <IconPlus className="w-3.5 h-3.5" />
              Add Item
            </button>
            <button
              onClick={handleSaveMenu}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <IconSave className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Menu Location Selector */}
      <div className="flex-shrink-0">
        <MenuLocationSelector
          locations={MENU_LOCATIONS}
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
        />
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="flex-shrink-0 animate-in slide-in-from-top duration-300">
          <MenuPreview 
            items={menuItems} 
            location={MENU_LOCATIONS.find(l => l.slug === selectedLocation)?.name || selectedLocation}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">
        {/* Menu Items List */}
        <div className={`${showForm ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col min-h-0`}>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 p-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
                    Menu Structure
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {menuItems.length} {menuItems.length === 1 ? 'item' : 'items'} • Drag to reorder
                  </p>
                </div>
                {menuItems.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-medium">
                      {menuItems.filter(i => i.isActive).length} Active
                    </span>
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded font-medium">
                      {menuItems.filter(i => !i.isActive).length} Inactive
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {menuItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                    <IconMenu className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
                    No menu items yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-3 max-w-sm text-sm">
                    Get started by adding your first menu item. You can create nested menus and organize them however you like.
                  </p>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <IconPlus className="w-3.5 h-3.5" />
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
