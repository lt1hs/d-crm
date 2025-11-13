# Menu Management System

A comprehensive menu creation and management system for the Aspire HR Dashboard.

## Features

- **Multi-location Support**: Create menus for different locations (Header, Footer, Sidebar, Mobile)
- **Hierarchical Structure**: Support for nested menu items with unlimited depth
- **Multi-language**: Support for English, Arabic, and Persian translations
- **Drag & Drop**: Reorder menu items easily (UI ready, functionality can be enhanced)
- **Active/Inactive States**: Toggle menu items visibility
- **External Links**: Support for opening links in new windows
- **Icon Support**: Optional icon field for menu items
- **LocalStorage Persistence**: Menus are saved locally in the browser

## Components

### MenuManagement
Main component that orchestrates the entire menu management system.

### MenuLocationSelector
Allows switching between different menu locations (Header, Footer, etc.)

### MenuForm
Form for creating and editing menu items with multi-language support.

### MenuList
Displays the hierarchical menu structure.

### MenuListItem
Individual menu item with edit/delete actions and expand/collapse for children.

## Usage

Click on "Menu" in the sidebar to access the menu management page.

1. Select a menu location (Header, Footer, Sidebar, Mobile)
2. Click "Add Menu Item" to create a new item
3. Fill in the form with title, URL, and other details
4. Optionally select a parent item to create nested menus
5. Click "Save Menu" to persist changes

## Data Structure

Menus are stored in localStorage with the following structure:

```typescript
{
  id: string;
  name: string;
  location: string;
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
}
```

Each MenuItem contains:
- Multi-language titles (English, Arabic, Persian)
- URL and target
- Parent-child relationships
- Order and active status
- Optional icon
