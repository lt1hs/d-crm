import { MenuItem } from '../types/menu';

export const buildMenuTree = (items: MenuItem[]): MenuItem[] => {
  const itemMap = new Map<string, MenuItem>();
  const rootItems: MenuItem[] = [];

  // Create a map of all items
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Build the tree structure
  items.forEach(item => {
    const menuItem = itemMap.get(item.id);
    if (!menuItem) return;

    if (item.parentId === null) {
      rootItems.push(menuItem);
    } else {
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(menuItem);
      }
    }
  });

  // Sort by order
  const sortByOrder = (items: MenuItem[]) => {
    items.sort((a, b) => a.order - b.order);
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        sortByOrder(item.children);
      }
    });
  };

  sortByOrder(rootItems);
  return rootItems;
};

export const flattenMenuTree = (items: MenuItem[]): MenuItem[] => {
  const result: MenuItem[] = [];
  
  const flatten = (items: MenuItem[], depth = 0) => {
    items.forEach(item => {
      result.push({ ...item, children: undefined });
      if (item.children && item.children.length > 0) {
        flatten(item.children, depth + 1);
      }
    });
  };
  
  flatten(items);
  return result;
};

export const getMenuItemDepth = (itemId: string, items: MenuItem[]): number => {
  let depth = 0;
  
  const findDepth = (items: MenuItem[], currentDepth: number): boolean => {
    for (const item of items) {
      if (item.id === itemId) {
        depth = currentDepth;
        return true;
      }
      if (item.children && item.children.length > 0) {
        if (findDepth(item.children, currentDepth + 1)) {
          return true;
        }
      }
    }
    return false;
  };
  
  findDepth(items, 0);
  return depth;
};

export const generateMenuItemId = (): string => {
  return `menu-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
