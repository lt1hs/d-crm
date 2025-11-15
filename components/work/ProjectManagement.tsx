import React, { useState } from 'react';
import { useWork } from '../../context/WorkContext';
import { Plus, Folder, Users, Calendar, MoreVertical, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { Project } from '../../types/work';
import { ProjectForm } from './ProjectForm';

export const ProjectManagement: React.FC = () => {
  const { projects, tasks, deleteProject } = useWork();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]').map((u: any) => ({
    id: u.id,
    name: u.fullName || u.username
  }));

  const getProjectStats = (projectId: string) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const completed = projectTasks.filter(t => t.status === 'completed').length;
    return {
      total: projectTasks.length,
      completed,
      progress: projectTasks.length > 0 ? (completed / projectTasks.length) * 100 : 0
    };
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
    setActiveMenu(null);
  };

  const handleDelete = (project: Project) => {
    if (confirm(`Delete project "${project.name}" and all its tasks?`)) {
      deleteProject(project.id);
    }
    setActiveMenu(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(undefined);
  };

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalTasks = tasks.length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sleeker Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {activeProjects} active · {completedProjects} completed · {totalTasks} total tasks
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-10 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No projects yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Create your first project to organize your tasks</p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => {
            const stats = getProjectStats(project.id);
            const teamMembers = users.filter((u: any) => project.teamMembers.includes(u.id));

            return (
              <div
                key={project.id}
                className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-5 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    >
                      {project.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{project.name}</h3>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-md mt-1 ${
                        project.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        project.status === 'on-hold' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        project.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      type="button"
                      onClick={() => setActiveMenu(activeMenu === project.id ? null : project.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Project options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {activeMenu === project.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                        <button
                          type="button"
                          onClick={() => handleEdit(project)}
                          className="w-full px-3 py-2 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(project)}
                          className="w-full px-3 py-2 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                )}

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <TrendingUp className="w-3 h-3" />
                      <span>Progress</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {stats.completed}/{stats.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${stats.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  {/* Team Members */}
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    <div className="flex -space-x-1.5">
                      {teamMembers.slice(0, 3).map((member: any) => (
                        <div
                          key={member.id}
                          className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-medium"
                          title={member.name}
                        >
                          {member.name.charAt(0)}
                        </div>
                      ))}
                      {teamMembers.length > 3 && (
                        <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-medium">
                          +{teamMembers.length - 3}
                        </div>
                      )}
                      {teamMembers.length === 0 && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">No members</span>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                    {project.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-gray-400 dark:text-gray-500 text-xs">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <ProjectForm
          project={editingProject}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};
