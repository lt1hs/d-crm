import React, { useState } from 'react';
import { MenuItem } from '../../types/menu';
import { IconEdit, IconTrash, IconChevronDown, IconChevronRight, IconGripVertical, IconExternalLink } from '../Icons';

interface MenuListItemProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
  depth: number;
}

const MenuListItem: React.FC<MenuListItemProps> = ({ item, onEdit, onDelete, depth }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="space-y-1">
      <div
        className={`
          flex items-center gap-3 p-3 rounded-lg border
          ${item.isActive 
            ? 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600' 
            : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
          }
          hover:shadow-sm transition-all
        `}
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        {/* Drag Handle */}
        <button 
          className="cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Drag to reorder"
        >
          <IconGripVertical className="w-4 h-4" />
        </button>

        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {isExpanded ? (
              <IconChevronDown className="w-4 h-4" />
            ) : (
              <IconChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Item Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {item.title}
            </span>
            {item.target === '_blank' && (
              <IconExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {item.url}
          </div>
        </div>

        {/* Order Badge */}
        <div className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs font-medium text-gray-600 dark:text-gray-300">
          #{item.order}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            title="Edit"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${item.title}"?`)) {
                onDelete(item.id);
              }
            }}
            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            title="Delete"
          >
            <IconTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="space-y-1">
          {item.children!.map((child) => (
            <MenuListItem
              key={child.id}
              item={child}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuListItem;
