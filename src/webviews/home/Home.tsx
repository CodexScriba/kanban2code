import React from 'react';
import { ActionCard, BrandLogo, StatusCard, Divider } from '../components/ui';
import { postMessage } from '../lib/vscode';

export function Home() {
  return (
    <div className="k2c-home">

      <div className="k2c-brand">
        <div className="k2c-brand-logo-wrap">
          <BrandLogo />
        </div>
        <div className="k2c-brand-title">Kanban2Code</div>
        <div className="k2c-brand-subtitle">AI-native developer workspace · v2</div>
      </div>

      <div className="k2c-divider-wrap">
        <Divider />
      </div>

      <div className="k2c-actions">

        <ActionCard
          accent="amber"
          label="Create Kanban"
          description="New board from scratch"
          icon={
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
              <rect x="3" y="3" width="18" height="18" rx="2"/>
            </svg>
          }
          onClick={() => postMessage({ command: 'createKanban' })}
        />

        <ActionCard
          accent="violet"
          label="Open Sidebar"
          description="Kanban board explorer"
          icon={
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
          }
          onClick={() => postMessage({ command: 'openSidebar' })}
        />

        <ActionCard
          accent="cyan"
          label="Open Chat"
          description="AI-powered coding assistant"
          icon={
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              <line x1="8" y1="9" x2="13" y2="9"/>
              <line x1="8" y1="13" x2="16" y2="13"/>
            </svg>
          }
          onClick={() => postMessage({ command: 'openChat' })}
        />

        <ActionCard
          accent="red"
          label="Connect OpenClaw"
          description="Link your project board"
          icon={
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <ellipse cx="12" cy="14" rx="7" ry="5"/>
              <path d="M8 10V7a2 2 0 0 1 2-2"/>
              <path d="M16 10V7a2 2 0 0 0-2-2"/>
              <circle cx="6" cy="7" r="1.5" fill="currentColor"/>
              <circle cx="18" cy="7" r="1.5" fill="currentColor"/>
              <path d="M5 14L2 11a2 2 0 0 1 3-1l2 3"/>
              <path d="M19 14l3-3a2 2 0 0 0-3-1l-2 3"/>
              <path d="M7 17L5 20"/>
              <path d="M9 18l-1 3"/>
              <path d="M17 17l2 3"/>
              <path d="M15 18l1 3"/>
            </svg>
          }
          onClick={() => postMessage({ command: 'connectOpenClaw' })}
        />

      </div>

      <div className="k2c-status-area">
        <StatusCard>
          <strong>3 boards</strong>{' synced · last update 2m ago'}
        </StatusCard>
      </div>

      <div className="k2c-footer">
        Kanban2Code v2.0 · by OpenClaw
      </div>

    </div>
  );
}
