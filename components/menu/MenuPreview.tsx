import React from 'react';
import { MenuItem } from '../../types/menu';
import { buildMenuTree } from '../../utils/menuHelpers';
import { IconChevronRight, IconEye, IconMenu } from '../Icons';

interface MenuPreviewProps {
  items: MenuItem[];
  location: string;
}

const MenuPreview: React.FC<MenuPreviewProps> = ({ items, location }) => {
  const menuTree = buildMenuTree(items.filter(item => item.isActive));

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <li key={item.id} className={depth > 0 ? 'ml-4' : ''}>
        <a
          href={item.url}
          target={item.target}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          {item.icon && <span className="text-gray-400">{item.icon}</span>}
          <span>{item.title}</span>
          {item.target === '_blank' && (
            <span className="text-xs text-gray-400">↗</span>
          )}
          {hasChildren && <IconChevronRight className="w-3 h-3 ml-auto text-gray-400" />}
        </a>
        {hasChildren && (
          <ul className="mt-1 space-y-1">
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <IconEye className="w-4 h-4" />
          Preview: {location} Menu
        </h3>
      </div>
      <div className="p-4">
        {menuTree.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <IconMenu className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No active menu items to preview
            </p>
          </div>
        ) : (
          <nav className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
            <ul className="space-y-1">
              {menuTree.map(item => renderMenuItem(item))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default MenuPreview;
