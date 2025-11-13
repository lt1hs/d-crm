import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Save } from '../Icons';

interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

interface CategoryManagerProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  allowManage?: boolean;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  selectedCategory,
  onSelectCategory,
  allowManage = true,
}) => {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Breaking News', description: 'Urgent, time-sensitive news', color: 'red' },
    { id: '2', name: 'Technology', description: 'Tech news and updates', color: 'blue' },
    { id: '3', name: 'Business', description: 'Business and finance', color: 'green' },
    { id: '4', name: 'Health', description: 'Health and wellness', color: 'pink' },
    { id: '5', name: 'Education', description: 'Education news', color: 'purple' },
    { id: '6', name: 'Sports', description: 'Sports coverage', color: 'orange' },
    { id: '7', name: 'Entertainment', description: 'Entertainment news', color: 'yellow' },
    { id: '8', name: 'Politics', description: 'Political news', color: 'indigo' },
    { id: '9', name: 'Science', description: 'Science and research', color: 'teal' },
    { id: '10', name: 'Culture', description: 'Arts and culture', color: 'rose' },
  ]);

  const [showManager, setShowManager] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: 'blue' });

  const colors = [
    { name: 'Red', value: 'red' },
    { name: 'Blue', value: 'blue' },
    { name: 'Green', value: 'green' },
    { name: 'Yellow', value: 'yellow' },
    { name: 'Purple', value: 'purple' },
    { name: 'Pink', value: 'pink' },
    { name: 'Orange', value: 'orange' },
    { name: 'Teal', value: 'teal' },
    { name: 'Indigo', value: 'indigo' },
    { name: 'Rose', value: 'rose' },
  ];

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;

    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description,
      color: newCategory.color,
    };

    setCategories([...categories, category]);
    setNewCategory({ name: '', description: '', color: 'blue' });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;

    setCategories(categories.map(cat =>
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      red: 'bg-red-100 text-red-800 border-red-300',
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      green: 'bg-green-100 text-green-800 border-green-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      purple: 'bg-purple-100 text-purple-800 border-purple-300',
      pink: 'bg-pink-100 text-pink-800 border-pink-300',
      orange: 'bg-orange-100 text-orange-800 border-orange-300',
      teal: 'bg-teal-100 text-teal-800 border-teal-300',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      rose: 'bg-rose-100 text-rose-800 border-rose-300',
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Category *
        </label>
        {allowManage && (
          <button
            type="button"
            onClick={() => setShowManager(!showManager)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showManager ? 'Hide Manager' : 'Manage Categories'}
          </button>
        )}
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {categories.map(category => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.name)}
            className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
              selectedCategory === category.name
                ? getColorClass(category.color || 'blue')
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Category Manager */}
      {showManager && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
          <h3 className="font-medium text-gray-900">Manage Categories</h3>

          {/* Add New Category */}
          <div className="space-y-3 p-3 bg-white rounded-lg border">
            <h4 className="text-sm font-medium text-gray-700">Add New Category</h4>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Category name"
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            <input
              type="text"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              placeholder="Description (optional)"
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Color:</label>
              <select
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                {colors.map(color => (
                  <option key={color.value} value={color.value}>{color.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddCategory}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Existing Categories */}
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border">
                {editingCategory?.id === category.id ? (
                  <>
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleUpdateCategory}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className={`flex-1 px-2 py-1 rounded text-sm ${getColorClass(category.color || 'blue')}`}>
                      {category.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingCategory(category)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
