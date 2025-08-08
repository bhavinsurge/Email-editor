import { useState, useCallback, useRef, useEffect } from 'react';
import { StripoEmailTemplate, StripoVersionHistoryEntry, StripoChange } from '../types/stripo.types';
import { nanoid } from 'nanoid';

interface UseStripoHistoryReturn {
  history: StripoVersionHistoryEntry[];
  currentIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  saveToHistory: (template: StripoEmailTemplate, description?: string, isAutoSave?: boolean) => void;
  getVersionHistory: () => StripoVersionHistoryEntry[];
  restoreVersion: (versionId: string) => StripoEmailTemplate | null;
  clearHistory: () => void;
}

const MAX_HISTORY_ENTRIES = 50;
const AUTO_SAVE_THRESHOLD = 30000; // 30 seconds

export function useStripoHistory(
  currentTemplate?: StripoEmailTemplate,
  userId: string = 'anonymous',
  userName: string = 'Anonymous User'
): UseStripoHistoryReturn {
  const [history, setHistory] = useState<StripoVersionHistoryEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const lastSaveTime = useRef<number>(Date.now());
  const pendingChanges = useRef<StripoChange[]>([]);

  // Initialize history with current template
  useEffect(() => {
    if (currentTemplate && history.length === 0) {
      const initialEntry: StripoVersionHistoryEntry = {
        id: nanoid(),
        template: JSON.parse(JSON.stringify(currentTemplate)),
        timestamp: new Date().toISOString(),
        userId,
        userName,
        description: 'Initial version',
        changes: [],
        isAutoSave: false
      };
      
      setHistory([initialEntry]);
      setCurrentIndex(0);
    }
  }, [currentTemplate, history.length, userId, userName]);

  const saveToHistory = useCallback((
    template: StripoEmailTemplate, 
    description?: string, 
    isAutoSave: boolean = false
  ) => {
    const now = Date.now();
    const shouldAutoSave = now - lastSaveTime.current > AUTO_SAVE_THRESHOLD;
    
    if (isAutoSave && !shouldAutoSave) {
      return;
    }

    // Detect changes
    const changes = detectChanges(
      history[currentIndex]?.template,
      template,
      userId,
      userName
    );

    if (changes.length === 0 && isAutoSave) {
      return; // No changes to save
    }

    const newEntry: StripoVersionHistoryEntry = {
      id: nanoid(),
      template: JSON.parse(JSON.stringify(template)), // Deep clone
      timestamp: new Date().toISOString(),
      userId,
      userName,
      description: description || (isAutoSave ? 'Auto-save' : `Updated ${changes.length} item(s)`),
      changes: [...pendingChanges.current, ...changes],
      isAutoSave
    };

    setHistory(prev => {
      // Remove any history after current index (when undoing then making new changes)
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newEntry);
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY_ENTRIES) {
        return newHistory.slice(-MAX_HISTORY_ENTRIES);
      }
      
      return newHistory;
    });

    setCurrentIndex(prev => {
      const newIndex = Math.min(prev + 1, MAX_HISTORY_ENTRIES - 1);
      return newIndex;
    });

    lastSaveTime.current = now;
    pendingChanges.current = [];
  }, [history, currentIndex, userId, userName]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const getVersionHistory = useCallback(() => {
    return [...history].reverse(); // Most recent first
  }, [history]);

  const restoreVersion = useCallback((versionId: string): StripoEmailTemplate | null => {
    const entry = history.find(h => h.id === versionId);
    if (entry) {
      const entryIndex = history.indexOf(entry);
      setCurrentIndex(entryIndex);
      return JSON.parse(JSON.stringify(entry.template));
    }
    return null;
  }, [history]);

  const clearHistory = useCallback(() => {
    if (currentTemplate) {
      const initialEntry: StripoVersionHistoryEntry = {
        id: nanoid(),
        template: JSON.parse(JSON.stringify(currentTemplate)),
        timestamp: new Date().toISOString(),
        userId,
        userName,
        description: 'Reset history',
        changes: [],
        isAutoSave: false
      };
      
      setHistory([initialEntry]);
      setCurrentIndex(0);
    }
  }, [currentTemplate, userId, userName]);

  return {
    history,
    currentIndex,
    canUndo,
    canRedo,
    undo,
    redo,
    saveToHistory,
    getVersionHistory,
    restoreVersion,
    clearHistory
  };
}

// Helper function to detect changes between templates
function detectChanges(
  oldTemplate: StripoEmailTemplate | undefined,
  newTemplate: StripoEmailTemplate,
  userId: string,
  userName: string
): StripoChange[] {
  const changes: StripoChange[] = [];
  
  if (!oldTemplate) {
    return [];
  }

  // Check template metadata changes
  if (oldTemplate.name !== newTemplate.name) {
    changes.push({
      id: nanoid(),
      timestamp: new Date().toISOString(),
      userId,
      userName,
      type: 'template_settings',
      description: `Changed template name from "${oldTemplate.name}" to "${newTemplate.name}"`,
      data: { field: 'name', oldValue: oldTemplate.name, newValue: newTemplate.name }
    });
  }

  if (oldTemplate.subject !== newTemplate.subject) {
    changes.push({
      id: nanoid(),
      timestamp: new Date().toISOString(),
      userId,
      userName,
      type: 'template_settings',
      description: `Changed subject from "${oldTemplate.subject}" to "${newTemplate.subject}"`,
      data: { field: 'subject', oldValue: oldTemplate.subject, newValue: newTemplate.subject }
    });
  }

  // Check component changes
  const oldComponentIds = getAllComponentIds(oldTemplate.components);
  const newComponentIds = getAllComponentIds(newTemplate.components);

  // Detect added components
  newComponentIds.forEach(id => {
    if (!oldComponentIds.includes(id)) {
      const component = findComponentById(newTemplate.components, id);
      changes.push({
        id: nanoid(),
        timestamp: new Date().toISOString(),
        userId,
        userName,
        type: 'component_add',
        description: `Added ${component?.type || 'component'}`,
        componentId: id,
        data: { componentType: component?.type }
      });
    }
  });

  // Detect removed components
  oldComponentIds.forEach(id => {
    if (!newComponentIds.includes(id)) {
      const component = findComponentById(oldTemplate.components, id);
      changes.push({
        id: nanoid(),
        timestamp: new Date().toISOString(),
        userId,
        userName,
        type: 'component_remove',
        description: `Removed ${component?.type || 'component'}`,
        componentId: id,
        data: { componentType: component?.type }
      });
    }
  });

  // Detect modified components
  newComponentIds.forEach(id => {
    if (oldComponentIds.includes(id)) {
      const oldComponent = findComponentById(oldTemplate.components, id);
      const newComponent = findComponentById(newTemplate.components, id);
      
      if (oldComponent && newComponent) {
        // Check content changes
        if (JSON.stringify(oldComponent.content) !== JSON.stringify(newComponent.content)) {
          changes.push({
            id: nanoid(),
            timestamp: new Date().toISOString(),
            userId,
            userName,
            type: 'content_change',
            description: `Updated content in ${newComponent.type}`,
            componentId: id,
            data: { 
              oldContent: oldComponent.content, 
              newContent: newComponent.content 
            }
          });
        }

        // Check style changes
        if (JSON.stringify(oldComponent.styles) !== JSON.stringify(newComponent.styles)) {
          changes.push({
            id: nanoid(),
            timestamp: new Date().toISOString(),
            userId,
            userName,
            type: 'style_change',
            description: `Updated styles in ${newComponent.type}`,
            componentId: id,
            data: { 
              oldStyles: oldComponent.styles, 
              newStyles: newComponent.styles 
            }
          });
        }
      }
    }
  });

  return changes;
}

// Helper function to get all component IDs recursively
function getAllComponentIds(components: any[]): string[] {
  const ids: string[] = [];
  
  function traverse(comps: any[]) {
    comps.forEach(comp => {
      ids.push(comp.id);
      if (comp.children) {
        traverse(comp.children);
      }
    });
  }
  
  traverse(components);
  return ids;
}

// Helper function to find a component by ID
function findComponentById(components: any[], id: string): any | null {
  for (const comp of components) {
    if (comp.id === id) {
      return comp;
    }
    if (comp.children) {
      const found = findComponentById(comp.children, id);
      if (found) return found;
    }
  }
  return null;
}