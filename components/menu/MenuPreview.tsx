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
      <li key={item.id} className={depth > 0 ? 'ml-3' : ''}>
        <a
          href={item.url}
          target={item.target}
          className="flex items-center gap-2 px-2.5 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          {item.icon && <span className="text-gray-400 text-xs">{item.icon}</span>}
          <span>{item.title}</span>
          {item.target === '_blank' && (
            <span className="text-xs text-gray-400">↗</span>
          )}
          {hasChildren && <IconChevronRight className="w-3 h-3 ml-auto text-gray-400" />}
        </a>
        {hasChildren && (
          <ul className="mt-0.5 space-y-0.5">
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <div className="p-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <IconEye className="w-3.5 h-3.5" />
          Preview: {location} Menu
        </h3>
      </div>
      <div className="p-3">
        {menuTree.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
              <IconMenu className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No active menu items to preview
            </p>
          </div>
        ) : (
          <nav className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-2.5">
            <ul className="space-y-0.5">
              {menuTree.map(item => renderMenuItem(item))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default MenuPreview;
