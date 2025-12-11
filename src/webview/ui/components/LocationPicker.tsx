import React, { useState, useMemo } from 'react';
import type { Task } from '../../../types/task';

interface LocationPickerProps {
  tasks: Task[];
  value: { type: 'inbox' } | { type: 'project'; project: string; phase?: string };
  onChange: (location: LocationPickerProps['value']) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  tasks,
  value,
  onChange,
}) => {
  const [locationType, setLocationType] = useState<'inbox' | 'project'>(value.type);
  const [selectedProject, setSelectedProject] = useState(
    value.type === 'project' ? value.project : ''
  );
  const [selectedPhase, setSelectedPhase] = useState(
    value.type === 'project' ? value.phase || '' : ''
  );

  // Extract unique projects from tasks
  const projects = useMemo(() => {
    const projectSet = new Set<string>();
    tasks.forEach((task) => {
      if (task.project) projectSet.add(task.project);
    });
    return Array.from(projectSet).sort();
  }, [tasks]);

  // Extract phases for selected project
  const phases = useMemo(() => {
    const phaseSet = new Set<string>();
    tasks.forEach((task) => {
      if (task.project === selectedProject && task.phase) {
        phaseSet.add(task.phase);
      }
    });
    return Array.from(phaseSet).sort();
  }, [tasks, selectedProject]);

  const handleTypeChange = (type: 'inbox' | 'project') => {
    setLocationType(type);
    if (type === 'inbox') {
      onChange({ type: 'inbox' });
    } else if (selectedProject) {
      onChange({
        type: 'project',
        project: selectedProject,
        phase: selectedPhase || undefined,
      });
    }
  };

  const handleProjectChange = (project: string) => {
    setSelectedProject(project);
    setSelectedPhase(''); // Reset phase when project changes
    if (project) {
      onChange({ type: 'project', project });
    }
  };

  const handlePhaseChange = (phase: string) => {
    setSelectedPhase(phase);
    onChange({
      type: 'project',
      project: selectedProject,
      phase: phase || undefined,
    });
  };

  return (
    <div className="location-picker">
      <div className="form-group">
        <label className="form-label">Location</label>
        <div className="location-type-buttons">
          <button
            type="button"
            className={`location-type-btn ${locationType === 'inbox' ? 'active' : ''}`}
            onClick={() => handleTypeChange('inbox')}
          >
            📥 Inbox
          </button>
          <button
            type="button"
            className={`location-type-btn ${locationType === 'project' ? 'active' : ''}`}
            onClick={() => handleTypeChange('project')}
          >
            📁 Project
          </button>
        </div>
      </div>

      {locationType === 'project' && (
        <>
          <div className="form-group">
            <label className="form-label">Project</label>
            <select
              className="form-select"
              value={selectedProject}
              onChange={(e) => handleProjectChange(e.target.value)}
            >
              <option value="">Select a project...</option>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>

          {phases.length > 0 && (
            <div className="form-group">
              <label className="form-label">Phase (optional)</label>
              <select
                className="form-select"
                value={selectedPhase}
                onChange={(e) => handlePhaseChange(e.target.value)}
              >
                <option value="">No specific phase</option>
                {phases.map((phase) => (
                  <option key={phase} value={phase}>
                    {phase}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );
};
