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
  Plus
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
  onAddComponent: (componentType: string, parentId?: string, index?: number) => void;
  previewDevice: 'desktop' | 'mobile' | 'tablet';
  isFullscreen: boolean;
  collaborators: StripoUser[];
  comments: StripoComment[];
  onAddComment: (componentId: string, content: string, position?: { x: number; y: number }) => void;
  user?: StripoUser;
  globalStyles: StripoGlobalStyles;
}

interface DropZoneProps {
  index: number;
  onDrop: (type: string, index: number) => void;
  isVisible: boolean;
}

function DropZone({ index, onDrop, isVisible }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item: { type: string }) => {
      onDrop(item.type, index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  return (
    <div
      ref={drop}
      className={`transition-all duration-200 ${
        isVisible || isOver 
          ? 'h-12 border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg mb-4 flex items-center justify-center' 
          : 'h-2'
      }`}
      data-testid={`drop-zone-${index}`}
    >
      {(isVisible || isOver) && (
        <div className="flex items-center space-x-2 text-blue-600 text-sm">
          <Plus className="w-4 h-4" />
          <span>{isOver ? 'Drop component here' : 'Drop zone'}</span>
        </div>
      )}
    </div>
  );
}

export function StripoCanvas({
  template,
  selectedComponentId,
  onComponentSelect,
  onComponentUpdate,
  onComponentDelete,
  onComponentDuplicate,
  onComponentReorder,
  onAddComponent,
  previewDevice,
  isFullscreen,
  collaborators,
  comments,
  onAddComment,
  user,
  globalStyles
}: StripoCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showDropZones, setShowDropZones] = useState(false);

  // Drop zone for canvas background
  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item: { type: string }, monitor) => {
      if (!monitor.didDrop()) {
        // Add component to end if not dropped on specific drop zone
        onAddComponent(item.type, undefined, template?.components.length || 0);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    }),
    hover: () => {
      setShowDropZones(true);
    }
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
    setShowDropZones(false);
  }, [onComponentSelect]);

  const handleDropComponent = useCallback((type: string, index: number) => {
    onAddComponent(type, undefined, index);
    setShowDropZones(false);
  }, [onAddComponent]);

  const handleComponentDoubleClick = useCallback((componentId: string) => {
    // Enter inline editing mode for text components
    const component = template?.components.find(c => c.id === componentId);
    if (component && (component.type === 'text' || component.type === 'heading')) {
      // Enable inline editing
      console.log('Enter edit mode for:', componentId);
    }
  }, [template]);

  const renderComponent = (component: StripoComponent, index: number) => {
    const isSelected = selectedComponentId === component.id;
    const componentComments = comments.filter(c => c.componentId === component.id && !c.resolved);
    const isHidden = (component.settings?.hiddenOnMobile && previewDevice === 'mobile') ||
                     (component.settings?.hiddenOnDesktop && previewDevice === 'desktop');

    if (isHidden) return null;

    return (
      <ContextMenu key={component.id}>
        <ContextMenuTrigger>
          <div
            className={`relative group transition-all duration-200 ${
              isSelected 
                ? 'ring-2 ring-blue-500 ring-offset-2 rounded-md' 
                : 'hover:ring-1 hover:ring-gray-300 hover:ring-offset-1 rounded-md'
            }`}
            onClick={(e) => handleComponentClick(component.id, e)}
            onDoubleClick={() => handleComponentDoubleClick(component.id)}
            data-testid={`component-${component.type}-${component.id}`}
          >
            {/* Component Toolbar */}
            {isSelected && (
              <div className="absolute -top-10 left-0 flex items-center space-x-1 bg-white shadow-lg rounded-md px-2 py-1 z-10 border">
                <Badge variant="secondary" className="text-xs capitalize">
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
                  data-testid={`button-duplicate-${component.id}`}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onComponentDelete(component.id);
                  }}
                  title="Delete"
                  data-testid={`button-delete-${component.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}

            {/* Comments Indicator */}
            {componentComments.length > 0 && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-medium z-10">
                {componentComments.length}
              </div>
            )}

            {/* Component Content */}
            <StripoComponentRenderer
              component={component}
              isSelected={isSelected}
              previewDevice={previewDevice}
              globalStyles={globalStyles}
              onUpdate={(updates) => onComponentUpdate(component.id, updates)}
            />
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={() => onComponentDuplicate(component.id)} data-testid={`menu-duplicate-${component.id}`}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onComponentDelete(component.id)} data-testid={`menu-delete-${component.id}`}>
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
          <ContextMenuItem 
            onClick={() => {
              if (index > 0) {
                onComponentReorder(component.id, template?.components[index - 1]?.id || '', index, index - 1);
              }
            }}
            disabled={index === 0}
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            Move Up
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => {
              if (index < (template?.components.length || 0) - 1) {
                onComponentReorder(component.id, template?.components[index + 1]?.id || '', index, index + 1);
              }
            }}
            disabled={index === (template?.components.length || 0) - 1}
          >
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
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">No template loaded</p>
          <p className="text-sm">Create a new template or load an existing one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Canvas Container */}
      <div
        ref={drop}
        className={`flex-1 overflow-auto p-6 ${isOver ? 'bg-blue-50 dark:bg-blue-950' : ''}`}
        onClick={handleCanvasClick}
        onDragLeave={() => setShowDropZones(false)}
        data-testid="canvas-container"
      >
        <div className="flex justify-center">
          <div
            ref={canvasRef}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300"
            style={getCanvasStyles()}
          >
            {/* Email Subject Preview */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Subject:</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{template.subject || 'Untitled Email'}</div>
              {template.preheader && (
                <>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 mt-2">Preheader:</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">{template.preheader}</div>
                </>
              )}
            </div>

            {/* Email Content */}
            <div className="min-h-96 relative p-4" data-testid="email-content">
              {template.components.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Start Building Your Email</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
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
                  {/* Drop zone at the beginning */}
                  <DropZone 
                    index={0} 
                    onDrop={handleDropComponent} 
                    isVisible={showDropZones} 
                  />
                  
                  {template.components.map((component, index) => (
                    <div key={component.id}>
                      {renderComponent(component, index)}
                      
                      {/* Drop zone after each component */}
                      <DropZone 
                        index={index + 1} 
                        onDrop={handleDropComponent} 
                        isVisible={showDropZones} 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}