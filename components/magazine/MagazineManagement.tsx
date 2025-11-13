import React, { useState, useEffect } from 'react';
import { MagazineIssue, MagazineFilter, MagazineSortBy, MagazineSortOrder } from '../../types/magazine';
import { filterMagazines, sortMagazines, getMagazineStats } from '../../utils/magazineHelpers';
import MagazineList from './MagazineList';
import MagazineForm from './MagazineForm';
import MagazineFilters from './MagazineFilters';
import MagazineStats from './MagazineStats';
import { IconPlus, IconSave, IconMagazine } from '../Icons';

const MagazineManagement: React.FC = () => {
  const [magazines, setMagazines] = useState<MagazineIssue[]>([]);
  const [filteredMagazines, setFilteredMagazines] = useState<MagazineIssue[]>([]);
  const [editingMagazine, setEditingMagazine] = useState<MagazineIssue | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<MagazineFilter>({});
  const [sortBy, setSortBy] = useState<MagazineSortBy>('issueNumber');
  const [sortOrder, setSortOrder] = useState<MagazineSortOrder>('desc');

  useEffect(() => {
    const savedMagazines = localStorage.getItem('magazines');
    if (savedMagazines) {
      setMagazines(JSON.parse(savedMagazines));
    }
  }, []);

  useEffect(() => {
    let result = filterMagazines(magazines, filter);
    result = sortMagazines(result, sortBy, sortOrder);
    setFilteredMagazines(result);
  }, [magazines, filter, sortBy, sortOrder]);

  const handleSaveMagazines = () => {
    localStorage.setItem('magazines', JSON.stringify(magazines));
  };

  const handleAddMagazine = (magazine: MagazineIssue) => {
    setMagazines([...magazines, magazine]);
    setShowForm(false);
    handleSaveMagazines();
  };

  const handleUpdateMagazine = (magazine: MagazineIssue) => {
    setMagazines(magazines.map(m => m.id === magazine.id ? magazine : m));
    setEditingMagazine(null);
    setShowForm(false);
    handleSaveMagazines();
  };

  const handleDeleteMagazine = (magazineId: string) => {
    setMagazines(magazines.filter(m => m.id !== magazineId));
    handleSaveMagazines();
  };

  const handleToggleFeatured = (magazineId: string) => {
    setMagazines(magazines.map(m => 
      m.id === magazineId ? { ...m, isFeatured: !m.isFeatured } : m
    ));
    handleSaveMagazines();
  };

  const handleChangeStatus = (magazineId: string, status: MagazineIssue['status']) => {
    setMagazines(magazines.map(m => 
      m.id === magazineId ? { ...m, status } : m
    ));
    handleSaveMagazines();
  };

  const stats = getMagazineStats(magazines);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Magazine Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage magazine issues, articles, and publications
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setEditingMagazine(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              <IconPlus className="w-4 h-4" />
              Add Issue
            </button>
            <button
              onClick={handleSaveMagazines}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
            >
              <IconSave className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 mb-6">
        <MagazineStats stats={stats} />
      </div>

      <div className="flex-shrink-0 mb-6">
        <MagazineFilters
          filter={filter}
          onFilterChange={setFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(by, order) => {
            setSortBy(by);
            setSortOrder(order);
          }}
        />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        <div className={`${showForm ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col min-h-0`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Magazine Issues
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {filteredMagazines.length} {filteredMagazines.length === 1 ? 'issue' : 'issues'} found
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {filteredMagazines.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mb-4">
                    <IconMagazine className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {magazines.length === 0 ? 'No magazine issues yet' : 'No issues found'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm">
                    {magazines.length === 0 
                      ? 'Start publishing by creating your first magazine issue.'
                      : 'Try adjusting your filters to find what you\'re looking for.'
                    }
                  </p>
                  {magazines.length === 0 && (
                    <button
                      onClick={() => {
                        setEditingMagazine(null);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <IconPlus className="w-4 h-4" />
                      Add Your First Issue
                    </button>
                  )}
                </div>
              ) : (
                <MagazineList
                  magazines={filteredMagazines}
                  onEdit={(magazine) => {
                    setEditingMagazine(magazine);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteMagazine}
                  onToggleFeatured={handleToggleFeatured}
                  onChangeStatus={handleChangeStatus}
                />
              )}
            </div>
          </div>
        </div>

        {showForm && (
          <div className="lg:col-span-4 flex flex-col min-h-0 animate-in slide-in-from-right duration-300">
            <MagazineForm
              magazine={editingMagazine}
              onSave={editingMagazine ? handleUpdateMagazine : handleAddMagazine}
              onCancel={() => {
                setShowForm(false);
                setEditingMagazine(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MagazineManagement;
