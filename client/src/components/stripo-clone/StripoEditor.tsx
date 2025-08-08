import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { StripoToolbar } from './components/StripoToolbar';
import { StripoSidebar } from './components/StripoSidebar';
import { StripoCanvas } from './components/StripoCanvas';
import { StripoPropertiesPanel } from './components/StripoPropertiesPanel';
import { StripoTemplateLibrary } from './components/StripoTemplateLibrary';
import { StripoPreviewModal } from './components/StripoPreviewModal';
import { StripoExportModal } from './components/StripoExportModal';
import { StripoVersionHistory } from './components/StripoVersionHistory';
import { StripoCollaboration } from './components/StripoCollaboration';
import { useStripoState } from './hooks/useStripoState';
import { useStripoHistory } from './hooks/useStripoHistory';
import { useStripoCollaboration } from './hooks/useStripoCollaboration';
import { useStripoTemplates } from './hooks/useStripoTemplates';
import { StripoEmailTemplate, StripoComponent, StripoUser } from './types/stripo.types';

interface StripoEditorProps {
  initialTemplate?: StripoEmailTemplate;
  user?: StripoUser;
  onSave?: (template: StripoEmailTemplate) => void;
  onExport?: (html: string, format: 'html' | 'amp') => void;
  collaborationEnabled?: boolean;
  versionHistoryEnabled?: boolean;
  aiAssistantEnabled?: boolean;
  gameGeneratorEnabled?: boolean;
  customFontsEnabled?: boolean;
  ampSupport?: boolean;
  className?: string;
}

export function StripoEditor({
  initialTemplate,
  user,
  onSave,
  onExport,
  collaborationEnabled = true,
  versionHistoryEnabled = true,
  aiAssistantEnabled = true,
  gameGeneratorEnabled = true,
  customFontsEnabled = true,
  ampSupport = true,
  className = ''
}: StripoEditorProps) {
  const [currentView, setCurrentView] = useState<'editor' | 'templates' | 'preview'>('editor');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    collaborators,
    activeUsers,
    comments,
    addComment,
    resolveComment,
    sendCursor,
    broadcastChange
  } = useStripoCollaboration(user, collaborationEnabled);

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
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 'd':
            e.preventDefault();
            if (selectedComponentId) {
              duplicateComponent(selectedComponentId);
            }
            break;
          case 'Delete':
          case 'Backspace':
            if (selectedComponentId && e.target instanceof HTMLElement && 
                !e.target.isContentEditable && e.target.tagName !== 'INPUT' && 
                e.target.tagName !== 'TEXTAREA') {
              e.preventDefault();
              deleteComponent(selectedComponentId);
            }
            break;
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

  const handleExport = useCallback(async (format: 'html' | 'amp') => {
    if (template) {
      // Generate HTML/AMP from template
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
    if (collaborationEnabled) {
      broadcastChange({
        type: 'component_update',
        componentId,
        updates,
        userId: user?.id || 'anonymous'
      });
    }
  }, [updateComponent, collaborationEnabled, broadcastChange, user]);

  const handleTemplateSelect = useCallback((templateId: string) => {
    const selectedTemplate = getTemplateById(templateId);
    if (selectedTemplate) {
      updateTemplate(selectedTemplate);
      setCurrentView('editor');
    }
  }, [getTemplateById, updateTemplate]);

  // Generate HTML function (simplified - would need full implementation)
  const generateEmailHTML = (template: StripoEmailTemplate, format: 'html' | 'amp'): string => {
    // This would be a comprehensive HTML/AMP generator
    // For now, returning a basic structure
    return `<!DOCTYPE html>
<html${format === 'amp' ? ' ⚡4email' : ''}>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${template.subject}</title>
    ${format === 'amp' ? '<script async src="https://cdn.ampproject.org/v0.js"></script>' : ''}
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
      <div className={`stripo-editor h-screen flex flex-col bg-gray-50 ${className}`}>
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
          onVersionHistory={() => setShowVersionHistory(true)}
          onCollaboration={() => setShowCollaboration(true)}
          previewDevice={previewDevice}
          onPreviewDeviceChange={setPreviewDevice}
          isFullscreen={isFullscreen}
          onFullscreenToggle={() => setIsFullscreen(!isFullscreen)}
          collaborators={collaborators}
          activeUsers={activeUsers}
          user={user}
          aiAssistantEnabled={aiAssistantEnabled}
          gameGeneratorEnabled={gameGeneratorEnabled}
          ampSupport={ampSupport}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          {currentView === 'editor' && (
            <StripoSidebar
              onAddComponent={addComponent}
              selectedComponentType={selectedComponent?.type}
              gameGeneratorEnabled={gameGeneratorEnabled}
              customFontsEnabled={customFontsEnabled}
              ampSupport={ampSupport}
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
                previewDevice={previewDevice}
                isFullscreen={isFullscreen}
                collaborators={collaborators}
                comments={comments}
                onAddComment={addComment}
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
                ampSupport={ampSupport}
              />
            )}
          </div>

          {/* Right Properties Panel */}
          {currentView === 'editor' && (
            <StripoPropertiesPanel
              selectedComponent={selectedComponent}
              template={template}
              onComponentUpdate={handleComponentUpdate}
              onGlobalStylesUpdate={updateGlobalStyles}
              customFontsEnabled={customFontsEnabled}
              ampSupport={ampSupport}
              globalStyles={globalStyles}
            />
          )}
        </div>

        {/* Modals and Overlays */}
        {showVersionHistory && versionHistoryEnabled && (
          <StripoVersionHistory
            history={getVersionHistory()}
            currentIndex={currentIndex}
            onRestore={(version) => {
              updateTemplate(version);
              setShowVersionHistory(false);
            }}
            onClose={() => setShowVersionHistory(false)}
            user={user}
          />
        )}

        {showCollaboration && collaborationEnabled && (
          <StripoCollaboration
            collaborators={collaborators}
            activeUsers={activeUsers}
            comments={comments}
            onAddComment={addComment}
            onResolveComment={resolveComment}
            onInviteUser={() => {}}
            onClose={() => setShowCollaboration(false)}
            user={user}
          />
        )}

        {showExportModal && (
          <StripoExportModal
            template={template}
            onExport={handleExport}
            onClose={() => setShowExportModal(false)}
            ampSupport={ampSupport}
          />
        )}
      </div>
    </DndProvider>
  );
}