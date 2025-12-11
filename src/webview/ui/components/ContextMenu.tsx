import React, { useEffect, useRef, useCallback } from 'react';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
  disabled?: boolean;
  divider?: boolean;
  submenu?: ContextMenuItem[];
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  position,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeSubmenu, setActiveSubmenu] = React.useState<string | null>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Adjust position to stay within viewport
  const adjustedPosition = useCallback(() => {
    if (!menuRef.current) return position;

    const menu = menuRef.current;
    const { innerWidth, innerHeight } = window;
    const menuRect = menu.getBoundingClientRect();

    let { x, y } = position;

    // Adjust horizontal position
    if (x + menuRect.width > innerWidth) {
      x = innerWidth - menuRect.width - 8;
    }

    // Adjust vertical position
    if (y + menuRect.height > innerHeight) {
      y = innerHeight - menuRect.height - 8;
    }

    return { x: Math.max(8, x), y: Math.max(8, y) };
  }, [position]);

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled || item.divider) return;
    
    if (item.submenu) {
      setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
      return;
    }

    if (item.action) {
      item.action();
    }
    onClose();
  };

  const { x, y } = adjustedPosition();

  return (
    <div
      ref={menuRef}
      className="context-menu glass-panel"
      style={{ left: x, top: y }}
      role="menu"
    >
      {items.map((item) => {
        if (item.divider) {
          return <div key={item.id} className="menu-divider" role="separator" />;
        }

        return (
          <div key={item.id} className="menu-item-wrapper">
            <button
              className={`menu-item ${item.disabled ? 'disabled' : ''} ${item.submenu ? 'has-submenu' : ''}`}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => item.submenu && setActiveSubmenu(item.id)}
              disabled={item.disabled}
              role="menuitem"
              aria-disabled={item.disabled}
              aria-haspopup={item.submenu ? 'menu' : undefined}
            >
              {item.icon && <span className="menu-item-icon">{item.icon}</span>}
              <span className="menu-item-label">{item.label}</span>
              {item.submenu && <span className="menu-item-arrow">▸</span>}
            </button>

            {item.submenu && activeSubmenu === item.id && (
              <div className="context-submenu glass-panel" role="menu">
                {item.submenu.map((subItem) => (
                  <button
                    key={subItem.id}
                    className={`menu-item ${subItem.disabled ? 'disabled' : ''}`}
                    onClick={() => {
                      if (!subItem.disabled && subItem.action) {
                        subItem.action();
                        onClose();
                      }
                    }}
                    disabled={subItem.disabled}
                    role="menuitem"
                  >
                    {subItem.icon && <span className="menu-item-icon">{subItem.icon}</span>}
                    <span className="menu-item-label">{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
