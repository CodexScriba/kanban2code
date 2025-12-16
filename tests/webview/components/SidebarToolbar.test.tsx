// @vitest-environment jsdom
import '../setup-dom';
import '../setup-matchers';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

describe('SidebarToolbar', () => {
  it('renders a prominent Open Board button and triggers callback', async () => {
    const { SidebarToolbar } = await import('../../../src/webview/ui/components/SidebarToolbar');

    const onOpenBoard = vi.fn();
    const onOpenSettings = vi.fn();

    render(<SidebarToolbar onOpenBoard={onOpenBoard} onOpenSettings={onOpenSettings} />);

    const openBoardButton = screen.getByRole('button', { name: /open board/i });
    expect(openBoardButton).toHaveClass('btn-primary');
    expect(openBoardButton).toHaveClass('btn-board');
    expect(openBoardButton).toHaveTextContent(/open board/i);

    fireEvent.click(openBoardButton);
    expect(onOpenBoard).toHaveBeenCalledTimes(1);
    expect(onOpenSettings).not.toHaveBeenCalled();
  });

  it('renders Settings button and triggers callback', async () => {
    const { SidebarToolbar } = await import('../../../src/webview/ui/components/SidebarToolbar');

    const onOpenBoard = vi.fn();
    const onOpenSettings = vi.fn();

    render(<SidebarToolbar onOpenBoard={onOpenBoard} onOpenSettings={onOpenSettings} />);

    const settingsButton = screen.getByRole('button', { name: /settings/i });
    expect(settingsButton).toHaveClass('btn-icon');

    fireEvent.click(settingsButton);
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
    expect(onOpenBoard).not.toHaveBeenCalled();
  });
});

