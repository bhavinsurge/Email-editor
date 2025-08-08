import React, { useRef, useCallback, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Copy,
  Trash2,
  Edit,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  MoreHorizontal
} from 'lucide-react';
import { StripoEmailTemplate, StripoComponent, StripoUser, StripoComment, StripoGlobalStyles } from '../types/stripo.types';
import { StripoComponentRenderer } from './StripoComponentRenderer';

interface StripoCanvasProps {
  template?: StripoEmailTemplate;
  selectedComponentId?: string | null;
  onComponentSelect: (componentId: string | null) => void;
  onComponentUpdate: (componentId: string, updates: Partial<StripoComponent>) => void;
  onComponentDelete: (componentId: string) => void;
  onComponentDuplicate: (componentId: string) => void;
  onComponentReorder: (dragId: string, hoverId: string, dragIndex: number, hoverIndex: number) => void;
  previewDevice: 'desktop' | 'mobile' | 'tablet';
  isFullscreen: boolean;
  collaborators: StripoUser[];
  comments: StripoComment[];
  onAddComment: (componentId: string, content: string, position?: { x: number; y: number }) => void;
  user?: StripoUser;
  globalStyles: StripoGlobalStyles;
}

export function StripoCanvas({
  template,
  selectedComponentId,
  onComponentSelect,
  onComponentUpdate,
  onComponentDelete,
  onComponentDuplicate,
  onComponentReorder,
  previewDevice,
  isFullscreen,
  collaborators,
  comments,
  onAddComment,
  user,
  globalStyles
}: StripoCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showComments, setShowComments] = useState(true);
  const [dragOverComponentId, setDragOverComponentId] = useState<string | null>(null);

  // Drop zone for new components
  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item: { type: string }, monitor) => {
      if (!monitor.didDrop()) {
        // Add component to end if not dropped on specific component
        console.log('Adding component:', item.type);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    })
  });

  const getCanvasStyles = () => {
    const baseStyles = {
      maxWidth: template?.settings.width ? `${template.settings.width}px` : globalStyles.container.maxWidth,
      backgroundColor: template?.settings.contentAreaBackgroundColor || globalStyles.colors.background,
      fontFamily: globalStyles.typography.bodyFont,
      lineHeight: globalStyles.container.lineHeight
    };

    switch (previewDevice) {
      case 'mobile':
        return { ...baseStyles, maxWidth: '375px' };
      case 'tablet':
        return { ...baseStyles, maxWidth: '768px' };
      default:
        return baseStyles;
    }
  };

  const handleComponentClick = useCallback((componentId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onComponentSelect(componentId);
  }, [onComponentSelect]);

  const handleCanvasClick = useCallback(() => {
    onComponentSelect(null);
  }, [onComponentSelect]);

  const handleComponentDoubleClick = useCallback((componentId: string) => {
    // Enter inline editing mode
    console.log('Enter edit mode for:', componentId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, componentId: string) => {
    e.preventDefault();
    setDragOverComponentId(componentId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverComponentId(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, componentId: string, index: number) => {
    e.preventDefault();
    setDragOverComponentId(null);
    
    const componentType = e.dataTransfer.getData('text/plain');
    if (componentType) {
      console.log('Dropping component:', componentType, 'at index:', index);
    }
  }, []);

  const renderComponent = (component: StripoComponent, index: number) => {
    const isSelected = selectedComponentId === component.id;
    const isDragOver = dragOverComponentId === component.id;
    const componentComments = comments.filter(c => c.componentId === component.id && !c.resolved);

    return (
      <ContextMenu key={component.id}>
        <ContextMenuTrigger>
          <div
            className={`relative group transition-all duration-200 ${
              isSelected 
                ? 'ring-2 ring-blue-500 ring-offset-2' 
                : 'hover:ring-1 hover:ring-gray-300'
            } ${
              isDragOver ? 'ring-2 ring-green-500 ring-offset-2' : ''
            } ${
              component.settings?.hiddenOnMobile && previewDevice === 'mobile' ? 'hidden' : ''
            } ${
              component.settings?.hiddenOnDesktop && previewDevice === 'desktop' ? 'hidden' : ''
            }`}
            onClick={(e) => handleComponentClick(component.id, e)}
            onDoubleClick={() => handleComponentDoubleClick(component.id)}
            onDragOver={(e) => handleDragOver(e, component.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, component.id, index)}
          >
            {/* Component Toolbar */}
            {isSelected && (
              <div className="absolute -top-10 left-0 flex items-center space-x-1 bg-white shadow-lg rounded-md px-2 py-1 z-10 border">
                <Badge variant="secondary" className="text-xs">
                  {component.type}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onComponentDuplicate(component.id);
                  }}
                  title="Duplicate"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onComponentDelete(component.id);
                  }}
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  title="More options"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </div>
            )}

            {/* Comments Indicator */}
            {showComments && componentComments.length > 0 && (
              <div className="absolute -top-2 -right-2 z-20">
                <Button
                  variant="default"
                  size="sm"
                  className="h-6 w-6 p-0 bg-orange-500 hover:bg-orange-600 rounded-full"
                  title={`${componentComments.length} comment(s)`}
                >
                  <MessageSquare className="w-3 h-3" />
                  <span className="sr-only">{componentComments.length}</span>
                </Button>
              </div>
            )}

            {/* Collaborator Cursors */}
            {collaborators
              .filter(collab => collab.cursor?.componentId === component.id)
              .map(collab => (
                <div
                  key={collab.id}
                  className="absolute pointer-events-none z-30"
                  style={{
                    left: collab.cursor?.x || 0,
                    top: collab.cursor?.y || 0
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <div 
                      className="w-3 h-3 rounded-full border-2 border-white"
                      style={{ backgroundColor: getCollaboratorColor(collab.id) }}
                    />
                    <span className="text-xs bg-black text-white px-1 py-0.5 rounded">
                      {collab.name}
                    </span>
                  </div>
                </div>
              ))}

            {/* Component Content */}
            <StripoComponentRenderer
              component={component}
              isSelected={isSelected}
              previewDevice={previewDevice}
              globalStyles={globalStyles}
              onUpdate={(updates) => onComponentUpdate(component.id, updates)}
            />

            {/* Drop Zone Indicators */}
            <div
              className={`absolute inset-x-0 -top-1 h-2 transition-all ${
                isDragOver ? 'bg-green-400 opacity-50' : 'bg-transparent'
              }`}
              onDragOver={(e) => handleDragOver(e, component.id)}
              onDrop={(e) => handleDrop(e, component.id, index)}
            />
            <div
              className={`absolute inset-x-0 -bottom-1 h-2 transition-all ${
                isDragOver ? 'bg-green-400 opacity-50' : 'bg-transparent'
              }`}
              onDragOver={(e) => handleDragOver(e, component.id)}
              onDrop={(e) => handleDrop(e, component.id, index + 1)}
            />
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={() => onComponentDuplicate(component.id)}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onComponentDelete(component.id)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            {component.locked ? (
              <>
                <Unlock className="w-4 h-4 mr-2" />
                Unlock
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Lock
              </>
            )}
          </ContextMenuItem>
          <ContextMenuItem>
            {component.hidden ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide
              </>
            )}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <ArrowUp className="w-4 h-4 mr-2" />
            Move Up
          </ContextMenuItem>
          <ContextMenuItem>
            <ArrowDown className="w-4 h-4 mr-2" />
            Move Down
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => {
            if (user) {
              onAddComment(component.id, 'Add your comment here...');
            }
          }}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Add Comment
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  if (!template) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No template loaded</p>
          <p className="text-sm">Create a new template or load an existing one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Canvas Container */}
      <div
        ref={drop}
        className={`flex-1 overflow-auto p-6 ${isOver ? 'bg-blue-50' : ''}`}
        onClick={handleCanvasClick}
      >
        <div className="flex justify-center">
          <div
            ref={canvasRef}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
            style={getCanvasStyles()}
          >
            {/* Email Subject Preview */}
            <div className="border-b border-gray-200 p-4 bg-gray-50">
              <div className="text-sm text-gray-600 mb-1">Subject:</div>
              <div className="font-medium text-gray-900">{template.subject}</div>
              {template.preheader && (
                <>
                  <div className="text-sm text-gray-600 mb-1 mt-2">Preheader:</div>
                  <div className="text-sm text-gray-700">{template.preheader}</div>
                </>
              )}
            </div>

            {/* Email Content */}
            <div className="min-h-96 relative">
              {template.components.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border-2 border-dashed border-gray-300 m-8 rounded-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Email</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Drag components from the sidebar to create your email template
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs">
                      <Badge variant="outline">Text</Badge>
                      <Badge variant="outline">Images</Badge>
                      <Badge variant="outline">Buttons</Badge>
                      <Badge variant="outline">Headers</Badge>
                      <Badge variant="outline">And more...</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-0">
                  {template.components.map((component, index) => 
                    renderComponent(component, index)
                  )}
                </div>
              )}

              {/* Drop zone at the end */}
              <div
                className={`h-8 transition-all ${
                  isOver ? 'bg-green-100 border-2 border-dashed border-green-400' : ''
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const componentType = e.dataTransfer.getData('text/plain');
                  if (componentType) {
                    console.log('Adding component at end:', componentType);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Footer - Device Info */}
      <div className="bg-white border-t border-gray-200 px-6 py-2 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Device: {previewDevice}</span>
          <span>Width: {getCanvasStyles().maxWidth}</span>
          <span>Components: {template.components.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className={showComments ? 'text-blue-600' : 'text-gray-500'}
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Comments ({comments.filter(c => !c.resolved).length})
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper function to get consistent colors for collaborators
function getCollaboratorColor(userId: string): string {
  const colors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', 
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
  ];
  
  const hash = userId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
}