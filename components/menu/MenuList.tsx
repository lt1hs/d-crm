import React from 'react';
import { MenuItem } from '../../types/menu';
import MenuListItem from './MenuListItem';

interface MenuListProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
  onReorder: (items: MenuItem[]) => void;
}

const MenuList: React.FC<MenuListProps> = ({ items, onEdit, onDelete, onReorder }) => {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <MenuListItem
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          depth={0}
        />
      ))}
    </div>
  );
};

export default MenuList;
