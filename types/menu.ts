export interface MenuItem {
  id: string;
  title: string;
  titleAr?: string;
  titleFa?: string;
  url: string;
  parentId: string | null;
  order: number;
  isActive: boolean;
  target: '_self' | '_blank';
  icon?: string;
  children?: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuLocation {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Menu {
  id: string;
  name: string;
  location: string;
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export type MenuFormData = Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt' | 'children'>;
