export class WorkspaceState {
  private static _kanbanRoot: string | null = null;
  private static _filterState: unknown | null = null;

  static get kanbanRoot(): string | null {
    return this._kanbanRoot;
  }

  static setKanbanRoot(path: string | null) {
    this._kanbanRoot = path;
  }

  static get filterState(): unknown | null {
    return this._filterState;
  }

  static setFilterState(state: unknown | null) {
    this._filterState = state;
  }
}
