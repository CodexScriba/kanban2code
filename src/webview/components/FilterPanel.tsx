import React, { useCallback, useEffect, useMemo } from 'react';
import { useTaskStore, selectProjects, selectAllTags } from '../stores/taskStore';
import { postMessageToHost, createFiltersChangedMessage } from '../messaging/protocol';
import type { Stage } from '../../types/task';
import { TAG_TAXONOMY, type TagCategory, categorizeTag } from '../../core/tagTaxonomy';
import type { TagFiltersState } from '../stores/taskStore';

/**
 * Quick view presets for common task filters.
 */
export interface QuickView {
  id: string;
  label: string;
  stages?: Stage[];
  tagFilters?: Partial<TagFiltersState>;
  project?: string | null;
}

const QUICK_VIEWS: QuickView[] = [
  {
    id: 'today',
    label: "Today's Focus",
    stages: ['plan', 'code', 'audit'],
  },
  {
    id: 'all-active',
    label: 'All In Development',
    stages: ['plan', 'code', 'audit'],
  },
  {
    id: 'bugs',
    label: 'Bugs',
    tagFilters: { type: ['bug'] },
  },
  {
    id: 'ideas',
    label: 'Ideas & Roadmaps',
    tagFilters: { type: ['idea', 'roadmap'] },
  },
];

const STAGES: { key: Stage; label: string; color: string }[] = [
  { key: 'inbox', label: 'Inbox', color: '#38bdf8' },
  { key: 'plan', label: 'Plan', color: '#a78bfa' },
  { key: 'code', label: 'Code', color: '#fbbf24' },
  { key: 'audit', label: 'Audit', color: '#34d399' },
  { key: 'completed', label: 'Done', color: '#60a5fa' },
];

export interface FilterPanelProps {
  className?: string;
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

const ALL_STAGE_KEYS: Stage[] = ['inbox', 'plan', 'code', 'audit', 'completed'];

export function FilterPanel({ className = '', searchInputRef }: FilterPanelProps) {
  const tasks = useTaskStore((state) => state.tasks);
  const filters = useTaskStore((state) => state.filters);
  const setFilters = useTaskStore((state) => state.setFilters);
  const resetFilters = useTaskStore((state) => state.resetFilters);

  // Get available projects and tags
  const projects = useMemo(() => selectProjects({ tasks, filters, loading: false, error: null } as never), [tasks, filters]);
  const allTags = useMemo(() => selectAllTags({ tasks, filters, loading: false, error: null } as never), [tasks, filters]);
  const availableOtherTags = useMemo(
    () => allTags.filter((tag) => categorizeTag(tag) === 'other'),
    [allTags],
  );

  const [activeQuickView, setActiveQuickView] = React.useState<string | null>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Broadcast filters to host (for future board sync)
  useEffect(() => {
    postMessageToHost(
      createFiltersChangedMessage({
        project: filters.project,
        phase: filters.phase,
        tagFilters: filters.tagFilters,
        search: filters.search,
        stages: filters.stages,
        inboxOnly: filters.inboxOnly,
      }),
    );
  }, [filters]);

  const handleProjectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (value === 'all') {
        setFilters({ project: null, inboxOnly: false });
      } else if (value === 'inbox') {
        setFilters({ project: null, inboxOnly: true });
      } else {
        setFilters({ project: value, inboxOnly: false });
      }
      setActiveQuickView(null);
    },
    [setFilters],
  );

  const handleCategoryToggle = useCallback(
    (category: TagCategory, tag: string) => {
      const current = filters.tagFilters[category];
      const updated = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      setFilters({ tagFilters: { [category]: updated } as Partial<TagFiltersState> });
      setActiveQuickView(null);
    },
    [filters.tagFilters, setFilters],
  );

  const handleOtherTagToggle = useCallback(
    (tag: string) => {
      const current = filters.tagFilters.other;
      const updated = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      setFilters({ tagFilters: { other: updated } });
      setActiveQuickView(null);
    },
    [filters.tagFilters.other, setFilters],
  );

  const handleStageToggle = useCallback(
    (stage: Stage) => {
      const current = new Set(filters.stages);
      if (current.has(stage)) {
        current.delete(stage);
      } else {
        current.add(stage);
      }
      const nextStages = Array.from(current) as Stage[];
      setFilters({ stages: nextStages });
      setActiveQuickView(null);
    },
    [filters.stages, setFilters],
  );

  const handleQuickView = useCallback(
    (quickView: QuickView) => {
      const tagFilters = {
        scope: [],
        type: [],
        domain: [],
        priority: [],
        other: [],
        ...(quickView.tagFilters ?? {}),
      };
      // Apply quick view filters
      setFilters({
        stages: quickView.stages ?? ALL_STAGE_KEYS,
        tagFilters,
        project: quickView.project ?? null,
        inboxOnly: quickView.project === null ? false : quickView.project === undefined ? filters.inboxOnly : false,
        search: '',
        phase: null,
      });
      setActiveQuickView(quickView.id);
    },
    [setFilters, filters.inboxOnly],
  );

  const handleReset = useCallback(() => {
    resetFilters();
    setActiveQuickView(null);
  }, [resetFilters]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ search: e.target.value });
    },
    [setFilters],
  );

  const hasActiveStageFilter = filters.stages.length !== ALL_STAGE_KEYS.length;
  const hasActiveFilters =
    filters.project ||
    filters.inboxOnly ||
    filters.tagFilters.scope.length > 0 ||
    filters.tagFilters.type.length > 0 ||
    filters.tagFilters.domain.length > 0 ||
    filters.tagFilters.priority.length > 0 ||
    filters.tagFilters.other.length > 0 ||
    filters.search ||
    hasActiveStageFilter;

  return (
    <div className={`filter-panel ${className}`}>
      <style>{styles}</style>

      {/* Search */}
      <div className="filter-panel__search">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={handleSearchChange}
          className="filter-panel__search-input"
          ref={searchInputRef}
          aria-label="Search tasks"
        />
        {filters.search && (
          <button
            className="filter-panel__clear"
            onClick={() => setFilters({ search: '' })}
            aria-label="Clear search"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {/* Quick Views */}
      <div className="filter-panel__quick-views">
        {QUICK_VIEWS.map((qv) => (
          <button
            key={qv.id}
            className={`filter-panel__quick-btn ${activeQuickView === qv.id ? 'filter-panel__quick-btn--active' : ''}`}
            onClick={() => handleQuickView(qv)}
            aria-pressed={activeQuickView === qv.id}
          >
            {qv.label}
          </button>
        ))}
      </div>

      {/* Expand/Collapse */}
      <button
        className="filter-panel__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span>Filters</span>
        {hasActiveFilters && <span className="filter-panel__badge">Active</span>}
        <ChevronIcon className={isExpanded ? 'rotated' : ''} />
      </button>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="filter-panel__expanded">
          {/* Project Select */}
          <div className="filter-panel__group">
            <label className="filter-panel__label">Project</label>
            <select
              value={filters.project || 'all'}
              onChange={handleProjectChange}
              className="filter-panel__select"
            >
              <option value="all">All Projects</option>
              <option value="inbox">Inbox Only</option>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>

          {/* Stage Toggles */}
          <div className="filter-panel__group">
            <label className="filter-panel__label">Stages</label>
            <div className="filter-panel__stages">
              {STAGES.map((stage) => (
                <button
                  key={stage.key}
                  className={`filter-panel__stage ${filters.stages.includes(stage.key) ? 'filter-panel__stage--active' : ''}`}
                  onClick={() => handleStageToggle(stage.key)}
                  style={{ '--stage-color': stage.color } as React.CSSProperties}
                  aria-pressed={filters.stages.includes(stage.key)}
                >
                  <span
                    className="filter-panel__stage-dot"
                    style={{ background: stage.color }}
                  />
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Taxonomy-backed tags */}
          {Object.entries(TAG_TAXONOMY).map(([category, definitions]) => (
            <div className="filter-panel__group" key={category}>
              <label className="filter-panel__label">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </label>
              <div className="filter-panel__tags">
                {definitions.map((tag) => {
                  const active = filters.tagFilters[category as TagCategory].includes(tag.value);
                  return (
                    <button
                      key={tag.value}
                      className={`filter-panel__tag ${active ? 'filter-panel__tag--active' : ''}`}
                      style={
                        {
                          borderColor: tag.color,
                          color: active ? '#0b0b0b' : tag.color,
                          background: active ? tag.color : 'transparent',
                        } as React.CSSProperties
                      }
                      onClick={() => handleCategoryToggle(category as TagCategory, tag.value)}
                      aria-pressed={active}
                      title={tag.description}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Other tags */}
          {availableOtherTags.length > 0 && (
            <div className="filter-panel__group">
              <label className="filter-panel__label">Other Tags</label>
              <div className="filter-panel__tags">
                {availableOtherTags.map((tag) => {
                  const active = filters.tagFilters.other.includes(tag);
                  return (
                    <button
                      key={tag}
                      className={`filter-panel__tag ${active ? 'filter-panel__tag--active' : ''}`}
                      onClick={() => handleOtherTagToggle(tag)}
                      aria-pressed={active}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reset */}
          {hasActiveFilters && (
            <button className="filter-panel__reset" onClick={handleReset}>
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Icons
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="filter-panel__search-icon">
      <path d="M11.5 11.5L15 15M7 12A5 5 0 107 2a5 5 0 000 10z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ChevronIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

const styles = `
.filter-panel {
  padding: 8px 12px;
  border-bottom: 1px solid var(--colors-border);
  flex-shrink: 0;
}

/* Search */
.filter-panel__search {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.filter-panel__search-icon {
  position: absolute;
  left: 10px;
  color: var(--colors-subtext);
  pointer-events: none;
}

.filter-panel__search-input {
  width: 100%;
  padding: 8px 28px 8px 32px;
  border: 1px solid var(--colors-border);
  border-radius: 6px;
  background: var(--colors-panel);
  color: var(--colors-text);
  font-size: 12px;
}

.filter-panel__search-input:focus {
  outline: none;
  border-color: var(--colors-accent);
}

.filter-panel__search-input::placeholder {
  color: var(--colors-subtext);
}

.filter-panel__clear {
  position: absolute;
  right: 8px;
  padding: 4px;
  background: none;
  border: none;
  color: var(--colors-subtext);
  cursor: pointer;
}

.filter-panel__clear:hover {
  color: var(--colors-text);
}

/* Quick Views */
.filter-panel__quick-views {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.filter-panel__quick-btn {
  padding: 4px 8px;
  border: 1px solid var(--colors-border);
  border-radius: 4px;
  background: transparent;
  color: var(--colors-subtext);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-panel__quick-btn:hover {
  background: var(--colors-panel);
  color: var(--colors-text);
}

.filter-panel__quick-btn--active {
  background: var(--colors-accent);
  border-color: var(--colors-accent);
  color: white;
}

/* Toggle */
.filter-panel__toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 0;
  background: none;
  border: none;
  color: var(--colors-subtext);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
}

.filter-panel__toggle:hover {
  color: var(--colors-text);
}

.filter-panel__toggle svg {
  margin-left: auto;
  transition: transform 0.2s ease;
}

.filter-panel__toggle svg.rotated {
  transform: rotate(180deg);
}

.filter-panel__badge {
  padding: 2px 6px;
  background: var(--colors-accent);
  border-radius: 10px;
  color: white;
  font-size: 9px;
  font-weight: 600;
}

/* Expanded */
.filter-panel__expanded {
  padding-top: 8px;
}

.filter-panel__group {
  margin-bottom: 12px;
}

.filter-panel__label {
  display: block;
  margin-bottom: 6px;
  font-size: 11px;
  font-weight: 500;
  color: var(--colors-subtext);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.filter-panel__select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--colors-border);
  border-radius: 6px;
  background: var(--colors-panel);
  color: var(--colors-text);
  font-size: 12px;
}

.filter-panel__select:focus {
  outline: none;
  border-color: var(--colors-accent);
}

/* Stages */
.filter-panel__stages {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.filter-panel__stage {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 1px solid var(--colors-border);
  border-radius: 4px;
  background: transparent;
  color: var(--colors-subtext);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-panel__stage:hover {
  background: var(--colors-panel);
}

.filter-panel__stage--active {
  background: color-mix(in srgb, var(--stage-color) 15%, transparent);
  border-color: var(--stage-color);
  color: var(--colors-text);
}

.filter-panel__stage-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

/* Tags */
.filter-panel__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.filter-panel__tag {
  padding: 3px 8px;
  border: 1px solid var(--colors-border);
  border-radius: 12px;
  background: transparent;
  color: var(--colors-subtext);
  font-size: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-panel__tag:hover {
  background: var(--colors-panel);
  color: var(--colors-text);
}

.filter-panel__tag--active {
  background: var(--colors-accent);
  border-color: var(--colors-accent);
  color: white;
}

/* Reset */
.filter-panel__reset {
  width: 100%;
  padding: 6px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--colors-subtext);
  font-size: 11px;
  cursor: pointer;
}

.filter-panel__reset:hover {
  background: var(--colors-panel);
  color: var(--colors-text);
}
`;
