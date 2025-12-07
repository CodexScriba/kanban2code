import React, { Suspense, lazy } from 'react';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

interface MonacoModalProps {
  open: boolean;
  onClose: () => void;
  initialValue?: string;
  language?: string;
}

export function MonacoModal({
  open,
  onClose,
  initialValue,
  language = 'markdown',
}: MonacoModalProps) {
  if (!open) return null;

  const fallback = (
    <textarea
      style={{
        width: '100%',
        height: '60vh',
        background: '#0f172a',
        color: '#e5e7eb',
        border: '1px solid var(--colors-border)',
        borderRadius: 'var(--radius)',
        padding: '12px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      }}
      defaultValue={initialValue}
      readOnly
    />
  );

  return (
    <div className="modal-overlay">
      <div className="modal">
        <header className="modal__header">
          <div>
            <p className="eyebrow">Editor</p>
            <h3 className="modal__title">Monaco preview</h3>
          </div>
          <button className="btn ghost" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="modal__body">
          <Suspense fallback={fallback}>
            <MonacoEditor
              height="60vh"
              language={language}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                lineDecorationsWidth: 8,
                lineNumbersMinChars: 3,
              }}
              defaultValue={initialValue}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
