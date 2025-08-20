import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { StripoToolbar } from './components/StripoToolbar';
import { StripoSidebar } from './components/StripoSidebar';
import { StripoCanvas } from './components/StripoCanvas';
import { EnhancedPropertiesPanel } from './components/EnhancedPropertiesPanel';
import { StripoTemplateLibrary } from './components/StripoTemplateLibrary';
import { StripoPreviewModal } from './components/StripoPreviewModal';
import { StripoExportModal } from './components/StripoExportModal';
import { useStripoState } from './hooks/useStripoState';
import { useStripoHistory } from './hooks/useStripoHistory';
import { useStripoTemplates } from './hooks/useStripoTemplates';
import { StripoEmailTemplate, StripoComponent, StripoUser } from './types/stripo.types';

interface StripoEditorProps {
  initialTemplate?: StripoEmailTemplate;
  user?: StripoUser;
  onSave?: (template: StripoEmailTemplate) => void;
  onExport?: (html: string, format: 'html') => void;
  className?: string;
}

export function StripoEditor({
  initialTemplate,
  user,
  onSave,
  onExport,
  className = ''
}: StripoEditorProps) {
  const [currentView, setCurrentView] = useState<'editor' | 'templates' | 'preview'>('editor');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');

  // Custom hooks for state management
  const {
    template,
    updateTemplate,
    selectedComponent,
    updateComponent,
    deleteComponent,
    duplicateComponent,
    addComponent,
    reorderComponents,
    globalStyles,
    updateGlobalStyles
  } = useStripoState(initialTemplate);

  const {
    history,
    currentIndex,
    canUndo,
    canRedo,
    undo,
    redo,
    saveToHistory,
    getVersionHistory
  } = useStripoHistory(template);

  const {
    templates,
    categories,
    searchTemplates,
    getTemplateById,
    saveTemplate,
    favoriteTemplate
  } = useStripoTemplates();

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (template && template.lastModified) {
        saveToHistory(template);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [template, saveToHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'd':
            if (selectedComponentId) {
              e.preventDefault();
              duplicateComponent(selectedComponentId);
            }
            break;
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedComponentId && 
            e.target instanceof HTMLElement && 
            e.target.tagName !== 'INPUT' && 
            e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          deleteComponent(selectedComponentId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponentId, undo, redo, duplicateComponent, deleteComponent]);

  const handleSave = useCallback(async () => {
    if (template && onSave) {
      const updatedTemplate = {
        ...template,
        lastModified: new Date().toISOString(),
        modifiedBy: user?.id || 'anonymous'
      };
      await onSave(updatedTemplate);
      saveToHistory(updatedTemplate);
    }
  }, [template, onSave, user, saveToHistory]);

  const handleExport = useCallback(async (format: 'html') => {
    if (template) {
      // Generate HTML from template
      const html = generateEmailHTML(template, format);
      if (onExport) {
        await onExport(html, format);
      }
      setShowExportModal(true);
    }
  }, [template, onExport]);

  const handleComponentSelect = useCallback((componentId: string | null) => {
    setSelectedComponentId(componentId);
  }, []);

  const handleComponentUpdate = useCallback((componentId: string, updates: Partial<StripoComponent>) => {
    updateComponent(componentId, updates);
  }, [updateComponent]);

  const handleTemplateSelect = useCallback((templateId: string) => {
    const selectedTemplate = getTemplateById(templateId);
    if (selectedTemplate) {
      updateTemplate(selectedTemplate);
      setCurrentView('editor');
    }
  }, [getTemplateById, updateTemplate]);

  // Generate HTML function (simplified - would need full implementation)
  const generateEmailHTML = (template: StripoEmailTemplate, format: 'html'): string => {
    // This would be a comprehensive HTML generator
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${template.subject}</title>
    <style>
        /* Generated styles from template */
    </style>
</head>
<body>
    <!-- Generated content from components -->
</body>
</html>`;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`stripo-editor h-screen flex flex-col bg-gray-50 dark:bg-gray-900 ${className}`}>
        {/* Top Toolbar */}
        <StripoToolbar
          template={template}
          onSave={handleSave}
          onExport={handleExport}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onPreview={() => setCurrentView('preview')}
          onTemplateLibrary={() => setCurrentView('templates')}
          previewDevice={previewDevice}
          onPreviewDeviceChange={setPreviewDevice}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          {currentView === 'editor' && (
            <StripoSidebar
              onAddComponent={addComponent}
              selectedComponentType={selectedComponent?.type}
            />
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {currentView === 'editor' && (
              <StripoCanvas
                template={template}
                selectedComponentId={selectedComponentId}
                onComponentSelect={handleComponentSelect}
                onComponentUpdate={handleComponentUpdate}
                onComponentDelete={deleteComponent}
                onComponentDuplicate={duplicateComponent}
                onComponentReorder={reorderComponents}
                onAddComponent={(type, parentId, index) => addComponent(type as any, parentId, index)}
                previewDevice={previewDevice}
                isFullscreen={false}
                collaborators={[]}
                comments={[]}
                onAddComment={() => {}}
                user={user}
                globalStyles={globalStyles}
              />
            )}

            {currentView === 'templates' && (
              <StripoTemplateLibrary
                templates={templates}
                categories={categories}
                onTemplateSelect={handleTemplateSelect}
                onSearchTemplates={searchTemplates}
                onFavoriteTemplate={favoriteTemplate}
                onBackToEditor={() => setCurrentView('editor')}
                user={user}
              />
            )}

            {currentView === 'preview' && (
              <StripoPreviewModal
                template={template}
                device={previewDevice}
                onDeviceChange={setPreviewDevice}
                onClose={() => setCurrentView('editor')}
                onSendTest={() => {}}
                onInboxPreview={() => {}}
                ampSupport={false}
              />
            )}
          </div>

          {/* Right Properties Panel */}
          {currentView === 'editor' && (
            <EnhancedPropertiesPanel
              selectedComponent={selectedComponent}
              template={template}
              onComponentUpdate={handleComponentUpdate}
              onGlobalStylesUpdate={updateGlobalStyles}
              customFontsEnabled={false}
              ampSupport={false}
              globalStyles={globalStyles}
            />
          )}
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <StripoExportModal
            template={template}
            onClose={() => setShowExportModal(false)}
            onExport={(template) => handleExport('html')}
          />
        )}
      </div>
    </DndProvider>
  );
}