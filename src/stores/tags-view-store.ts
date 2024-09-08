// src/stores/tags-view-store.ts
import type { LocationQuery, _RouteRecordBase } from 'vue-router'
import { defineStore } from 'pinia'
import { stringify, parse } from 'flatted'

export interface ITagView extends Partial<_RouteRecordBase> {
  query?: LocationQuery
  fullPath?: string
  title?: string
}

export interface ITagsViewState {
  visitedViews: ITagView[]
  cachedViews: (string | undefined)[]
}

const LOCAL_STORAGE_KEY = 'tagsViewStoreState';

// Function to safely parse JSON using flatted
function safeParse<T>(data: string): T | null {
  try {
    const result = parse(data);
    if (typeof result === 'object' && result !== null) {
      return result as T;
    }
  } catch (error) {
    console.error('Parsing error:', error);
  }
  return null;
}

// Function to handle quota exceeded error
function handleQuotaExceeded() {
  console.warn('LocalStorage quota exceeded. Consider clearing old data or reducing the size of the data being stored.');
}

export const useTagsViewStore = defineStore('tagsViewStore', {
  state: (): ITagsViewState => {
    // Initialize state from local storage if available
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      const parsedState = safeParse<ITagsViewState>(savedState);
      if (parsedState) {
        return parsedState;
      } else {
        console.error('Invalid or corrupted state in localStorage');
      }
    }
    return {
      visitedViews: [],
      cachedViews: []
    };
  },
  actions: {
    saveStateToLocalStorage() {
      try {
        const stateToSave = stringify(this.$state);
        localStorage.setItem(LOCAL_STORAGE_KEY, stateToSave);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          handleQuotaExceeded();
          // Optionally, clear localStorage or reduce data size here
        } else {
          console.error('Failed to save state to localStorage', error);
        }
      }
    },

    ADD_VISITED_VIEW(view: ITagView) {
      if (this.visitedViews.some((v) => v.path === view.path)) return;
      this.visitedViews.push(
        Object.assign({}, view, {
          title: view.title || view.meta?.title || 'no-name'
        })
      );
      this.saveStateToLocalStorage();
    },

    ADD_CACHED_VIEW(view: ITagView) {
      if (view.name === null) return;
      if (this.cachedViews.includes(view.name?.toString())) return;
      if (!view.meta?.noCache) {
        this.cachedViews.push(view.name?.toString());
        this.saveStateToLocalStorage();
      }
    },

    DEL_VISITED_VIEW(view: ITagView) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.path === view.path) {
          this.visitedViews.splice(i, 1);
          break;
        }
      }
      this.saveStateToLocalStorage();
    },

    DEL_CACHED_VIEW(view: ITagView) {
      if (view.name === null) return;
      const index = this.cachedViews.indexOf(view.name!.toString());
      index > -1 && this.cachedViews.splice(index, 1);
      this.saveStateToLocalStorage();
    },

    DEL_OTHERS_VISITED_VIEWS(view: ITagView) {
      this.visitedViews = this.visitedViews.filter((v) => {
        return v.meta!.affix || v.path === view.path;
      });
      this.saveStateToLocalStorage();
    },

    DEL_OTHERS_CACHED_VIEWS(view: ITagView) {
      if (view.name === null) return;
      const index = this.cachedViews.indexOf(view.name!.toString());
      if (index > -1) {
        this.cachedViews = this.cachedViews.slice(index, index + 1);
      } else {
        this.cachedViews = [];
      }
      this.saveStateToLocalStorage();
    },

    DEL_ALL_VISITED_VIEWS() {
      // keep affix tags
      const affixTags = this.visitedViews.filter((tag) => tag.meta!.affix);
      this.visitedViews = affixTags;
      this.saveStateToLocalStorage();
    },

    DEL_ALL_CACHED_VIEWS() {
      this.cachedViews = [];
      this.saveStateToLocalStorage();
    },

    UPDATE_VISITED_VIEW(view: ITagView) {
      for (const v of this.visitedViews) {
        if (v.path === view.path) {
          Object.assign(v, view);
          break;
        }
      }
      this.saveStateToLocalStorage();
    },

    addView(view: ITagView) {
      this.ADD_VISITED_VIEW(view);
      this.ADD_CACHED_VIEW(view);
    },

    addVisitedView(view: ITagView) {
      this.ADD_VISITED_VIEW(view);
    },

    delView(view: ITagView) {
      this.DEL_VISITED_VIEW(view);
      this.DEL_CACHED_VIEW(view);
    },

    delCachedView(view: ITagView) {
      this.DEL_CACHED_VIEW(view);
    },

    delOthersViews(view: ITagView) {
      this.DEL_OTHERS_VISITED_VIEWS(view);
      this.DEL_OTHERS_CACHED_VIEWS(view);
    },

    delAllViews() {
      this.DEL_ALL_VISITED_VIEWS();
      this.DEL_ALL_CACHED_VIEWS();
    },

    delAllCachedViews() {
      this.DEL_ALL_CACHED_VIEWS();
    },

    updateVisitedView(view: ITagView) {
      this.UPDATE_VISITED_VIEW(view);
    }
  }
});
