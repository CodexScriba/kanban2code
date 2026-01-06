import React, { useState, useMemo } from 'react';
import type { Task } from '../../../types/task';
import { Icons } from './Icons';

interface FilterBarProps {
  tasks: Task[];
  selectedProject: string | null;
  selectedTags: string[];
  hiddenProjects: string[];
  onSetProject: (project: string | null) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onToggleProjectVisibility: (project: string) => void;
  onShowAllProjects: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  tasks,
  selectedProject,
  selectedTags,
  hiddenProjects,
  onSetProject,
  onAddTag,
  onRemoveTag,
  onToggleProjectVisibility,
  onShowAllProjects,
  onClearFilters,
  hasActiveFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract unique projects from tasks
  const projects = useMemo(() => {
    const projectSet = new Set<string>();
    tasks.forEach((task) => {
      if (task.project) projectSet.add(task.project);
    });
    return Array.from(projectSet).sort();
  }, [tasks]);

  // Extract unique tags from tasks
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach((task) => {
      task.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [tasks]);

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onRemoveTag(tag);
    } else {
      onAddTag(tag);
    }
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar-header">
        <button
          className="filter-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <Icons.Filter size={14} />
          <span>Filters</span>
          {hasActiveFilters && <span className="filter-badge" />}
          <Icons.ChevronDown
            size={12}
            className={`filter-chevron ${isExpanded ? 'expanded' : ''}`}
          />
        </button>
        
        {hasActiveFilters && (
          <button
            className="clear-filters-btn"
            onClick={onClearFilters}
            title="Clear all filters"
          >
            <Icons.X size={12} />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="filter-bar-content">
          {/* Project Filter */}
          <div className="filter-group">
            <label className="filter-label">Project</label>
            <select
              className="filter-select"
              value={selectedProject ?? ''}
              onChange={(e) => onSetProject(e.target.value || null)}
            >
              <option value="">All Projects</option>
              <option value="__inbox__">Inbox Only</option>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          {availableTags.length > 0 && (
            <div className="filter-group">
              <label className="filter-label">Tags</label>
              <div className="tag-chips">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    className={`tag-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Project Visibility */}
          {projects.length > 0 && (
            <div className="filter-group">
              <div className="filter-label-row">
                <label className="filter-label">Show Projects</label>
                {hiddenProjects.length > 0 && (
                  <button
                    className="show-all-btn"
                    onClick={onShowAllProjects}
                    title="Show all projects"
                  >
                    Show all
                  </button>
                )}
              </div>
              <div className="project-visibility-list">
                {projects.map((project) => (
                  <label key={project} className="project-visibility-item">
                    <input
                      type="checkbox"
                      checked={!hiddenProjects.includes(project)}
                      onChange={() => onToggleProjectVisibility(project)}
                    />
                    <span className="project-name">{project}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
