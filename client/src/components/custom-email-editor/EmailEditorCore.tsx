import React, { useState, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { nanoid } from 'nanoid';

// Types for email components
export interface EmailComponent {
  id: string;
  type: 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'columns' | 'header' | 'footer';
  content?: string;
  src?: string;
  alt?: string;
  href?: string;
  text?: string;
  title?: string;
  subtitle?: string;
  columns?: EmailComponent[];
  styles: ComponentStyles;
  variables?: MergeTag[];
}

export interface ComponentStyles {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  width?: string;
  height?: string;
  lineHeight?: string;
  textDecoration?: string;
  display?: string;
  fontFamily?: string;
  gap?: string;
}

export interface MergeTag {
  key: string;
  label: string;
  defaultValue?: string;
  type: 'text' | 'email' | 'number' | 'date' | 'url';
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  components: EmailComponent[];
  styles: {
    backgroundColor: string;
    fontFamily: string;
    maxWidth: string;
  };
  mergeTagData?: Record<string, any>;
}

interface EmailEditorCoreProps {
  initialTemplate?: EmailTemplate;
  onTemplateChange?: (template: EmailTemplate) => void;
  mergeTags?: MergeTag[];
  ampSupport?: boolean;
}

export interface EmailEditorRef {
  getTemplate: () => EmailTemplate;
  setTemplate: (template: EmailTemplate) => void;
  exportHtml: () => string;
  exportAmp: () => string;
  addComponent: (type: EmailComponent['type']) => void;
  updateComponent: (id: string, updates: Partial<EmailComponent>) => void;
  deleteComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
}

export const EmailEditorCore = forwardRef<EmailEditorRef, EmailEditorCoreProps>(
  ({ initialTemplate, onTemplateChange, mergeTags = [], ampSupport = false }, ref) => {
    const [template, setTemplate] = useState<EmailTemplate>(() => {
      return initialTemplate || {
        id: nanoid(),
        name: 'Untitled Email',
        subject: 'Your Subject Here',
        components: [],
        styles: {
          backgroundColor: '#f5f5f5',
          fontFamily: 'Arial, sans-serif',
          maxWidth: '600px'
        }
      };
    });

    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
    const [draggedComponent, setDraggedComponent] = useState<EmailComponent['type'] | null>(null);
    const [previewMode, setPreviewMode] = useState<'design' | 'preview' | 'mobile'>('design');
    const editorRef = useRef<HTMLDivElement>(null);

    // Update template and notify parent
    const updateTemplate = useCallback((newTemplate: EmailTemplate) => {
      setTemplate(newTemplate);
      onTemplateChange?.(newTemplate);
    }, [onTemplateChange]);

    // Component creation helpers
    const createComponent = useCallback((type: EmailComponent['type']): EmailComponent => {
      const baseComponent = {
        id: nanoid(),
        type,
        styles: {
          padding: '16px',
          margin: '8px 0',
        }
      };

      switch (type) {
        case 'text':
          return {
            ...baseComponent,
            content: 'Your text content here. You can use {{name}} for personalization.',
            styles: {
              ...baseComponent.styles,
              fontSize: '16px',
              color: '#333333',
              lineHeight: '1.5'
            }
          };
        case 'header':
          return {
            ...baseComponent,
            title: 'Email Header',
            subtitle: 'Welcome to our newsletter',
            styles: {
              ...baseComponent.styles,
              backgroundColor: '#2563eb',
              color: '#ffffff',
              textAlign: 'center' as const,
              padding: '32px 16px'
            }
          };
        case 'image':
          return {
            ...baseComponent,
            src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=300&fit=crop',
            alt: 'Placeholder image',
            styles: {
              ...baseComponent.styles,
              width: '100%',
              borderRadius: '8px'
            }
          };
        case 'button':
          return {
            ...baseComponent,
            text: 'Click Here',
            href: 'https://example.com',
            styles: {
              ...baseComponent.styles,
              backgroundColor: '#2563eb',
              color: '#ffffff',
              textAlign: 'center' as const,
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              display: 'inline-block'
            }
          };
        case 'divider':
          return {
            ...baseComponent,
            styles: {
              ...baseComponent.styles,
              height: '1px',
              backgroundColor: '#e5e5e5',
              margin: '24px 0'
            }
          };
        case 'spacer':
          return {
            ...baseComponent,
            styles: {
              ...baseComponent.styles,
              height: '32px',
              backgroundColor: 'transparent'
            }
          };
        case 'columns':
          return {
            ...baseComponent,
            columns: [
              createComponent('text'),
              createComponent('text')
            ],
            styles: {
              ...baseComponent.styles,
              display: 'flex',
              gap: '16px'
            }
          };
        case 'footer':
          return {
            ...baseComponent,
            content: '© 2024 Your Company. All rights reserved.',
            styles: {
              ...baseComponent.styles,
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              textAlign: 'center' as const,
              fontSize: '14px',
              padding: '24px 16px'
            }
          };
        default:
          return baseComponent as EmailComponent;
      }
    }, []);

    // Component management functions
    const addComponent = useCallback((type: EmailComponent['type'], index?: number) => {
      const newComponent = createComponent(type);
      const newComponents = [...template.components];
      
      if (index !== undefined) {
        newComponents.splice(index, 0, newComponent);
      } else {
        newComponents.push(newComponent);
      }

      updateTemplate({
        ...template,
        components: newComponents
      });

      setSelectedComponentId(newComponent.id);
    }, [template, updateTemplate, createComponent]);

    const updateComponent = useCallback((id: string, updates: Partial<EmailComponent>) => {
      const newComponents = template.components.map(component => 
        component.id === id 
          ? { ...component, ...updates, styles: { ...component.styles, ...updates.styles } }
          : component
      );

      updateTemplate({
        ...template,
        components: newComponents
      });
    }, [template, updateTemplate]);

    const deleteComponent = useCallback((id: string) => {
      const newComponents = template.components.filter(component => component.id !== id);
      updateTemplate({
        ...template,
        components: newComponents
      });
      
      if (selectedComponentId === id) {
        setSelectedComponentId(null);
      }
    }, [template, updateTemplate, selectedComponentId]);

    const duplicateComponent = useCallback((id: string) => {
      const componentToDuplicate = template.components.find(c => c.id === id);
      if (!componentToDuplicate) return;

      const duplicated = {
        ...componentToDuplicate,
        id: nanoid()
      };

      const componentIndex = template.components.findIndex(c => c.id === id);
      const newComponents = [...template.components];
      newComponents.splice(componentIndex + 1, 0, duplicated);

      updateTemplate({
        ...template,
        components: newComponents
      });
    }, [template, updateTemplate]);

    // Merge tag processing
    const processMergeTags = useCallback((content: string, data: Record<string, any> = {}) => {
      return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] || match;
      });
    }, []);

    // HTML Export
    const exportHtml = useCallback(() => {
      const renderComponent = (component: EmailComponent): string => {
        const styles = Object.entries(component.styles)
          .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
          .join('; ');

        switch (component.type) {
          case 'text':
            return `<div style="${styles}">${processMergeTags(component.content || '', template.mergeTagData)}</div>`;
          case 'header':
            return `
              <div style="${styles}">
                <h1 style="margin: 0 0 8px 0; font-size: 24px;">${component.title}</h1>
                <p style="margin: 0; opacity: 0.9;">${component.subtitle}</p>
              </div>`;
          case 'image':
            return `<img src="${component.src}" alt="${component.alt}" style="${styles}" />`;
          case 'button':
            return `<div style="text-align: ${component.styles.textAlign || 'center'}; margin: ${component.styles.margin || '16px 0'};">
              <a href="${component.href}" style="${styles}">${component.text}</a>
            </div>`;
          case 'divider':
            return `<hr style="${styles}" />`;
          case 'spacer':
            return `<div style="${styles}"></div>`;
          case 'columns':
            const columnHtml = component.columns?.map(col => `
              <td style="vertical-align: top; width: ${100 / (component.columns?.length || 2)}%;">
                ${renderComponent(col)}
              </td>
            `).join('') || '';
            return `<table style="width: 100%; ${styles}"><tr>${columnHtml}</tr></table>`;
          case 'footer':
            return `<div style="${styles}">${component.content}</div>`;
          default:
            return '';
        }
      };

      const componentsHtml = template.components.map(renderComponent).join('\n');

      return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${template.subject}</title>
    <style>
        body { margin: 0; padding: 20px; font-family: ${template.styles.fontFamily}; background-color: ${template.styles.backgroundColor}; }
        .email-container { max-width: ${template.styles.maxWidth}; margin: 0 auto; background-color: #ffffff; }
        table { border-collapse: collapse; width: 100%; }
        td { padding: 0; }
    </style>
</head>
<body>
    <div class="email-container">
        ${componentsHtml}
    </div>
</body>
</html>`;
    }, [template, processMergeTags]);

    // AMP Export (basic implementation)
    const exportAmp = useCallback(() => {
      if (!ampSupport) return exportHtml();

      const componentsAmp = template.components.map(component => {
        switch (component.type) {
          case 'image':
            return `<amp-img src="${component.src}" alt="${component.alt}" width="600" height="300" layout="responsive"></amp-img>`;
          default:
            return exportHtml(); // Fallback to HTML for unsupported AMP components
        }
      }).join('\n');

      return `<!doctype html>
<html ⚡4email>
<head>
    <meta charset="utf-8">
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <style amp4email-boilerplate>body{visibility:hidden}</style>
    <style amp-custom>
        body { font-family: ${template.styles.fontFamily}; }
        .email-container { max-width: ${template.styles.maxWidth}; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="email-container">
        ${componentsAmp}
    </div>
</body>
</html>`;
    }, [template, ampSupport, exportHtml]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getTemplate: () => template,
      setTemplate: (newTemplate: EmailTemplate) => updateTemplate(newTemplate),
      exportHtml,
      exportAmp,
      addComponent,
      updateComponent,
      deleteComponent,
      duplicateComponent
    }));

    // Drag and drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      const componentType = e.dataTransfer.getData('text/plain') as EmailComponent['type'];
      if (componentType) {
        addComponent(componentType);
      }
    }, [addComponent]);

    // Render component in design mode
    const renderDesignComponent = (component: EmailComponent) => {
      const isSelected = selectedComponentId === component.id;
      
      return (
        <div
          key={component.id}
          className={`component-wrapper relative group cursor-pointer border-2 transition-all duration-200 ${
            isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedComponentId(component.id);
          }}
        >
          {/* Component controls */}
          {isSelected && (
            <div className="absolute -top-8 left-0 flex gap-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateComponent(component.id);
                }}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Duplicate
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteComponent(component.id);
                }}
                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}

          {/* Component content */}
          <div style={component.styles}>
            {component.type === 'text' && (
              <div dangerouslySetInnerHTML={{ __html: processMergeTags(component.content || '', template.mergeTagData) }} />
            )}
            {component.type === 'header' && (
              <div style={{ textAlign: component.styles.textAlign }}>
                <h1 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>{component.title}</h1>
                <p style={{ margin: '0', opacity: 0.9 }}>{component.subtitle}</p>
              </div>
            )}
            {component.type === 'image' && (
              <img src={component.src} alt={component.alt} style={{ width: '100%', height: 'auto' }} />
            )}
            {component.type === 'button' && (
              <div style={{ textAlign: component.styles.textAlign }}>
                <a href={component.href} style={component.styles}>{component.text}</a>
              </div>
            )}
            {component.type === 'divider' && <hr style={component.styles} />}
            {component.type === 'spacer' && <div style={component.styles}></div>}
            {component.type === 'footer' && (
              <div dangerouslySetInnerHTML={{ __html: component.content || '' }} />
            )}
            {component.type === 'columns' && (
              <div style={{ display: 'flex', gap: '16px' }}>
                {component.columns?.map((col, idx) => (
                  <div key={idx} style={{ flex: 1 }}>
                    {renderDesignComponent(col)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="email-editor-core flex-1 bg-gray-50">
        {/* Preview Mode Toggle */}
        <div className="bg-white border-b px-4 py-2 flex gap-2">
          <button
            onClick={() => setPreviewMode('design')}
            className={`px-3 py-1 rounded ${previewMode === 'design' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Design
          </button>
          <button
            onClick={() => setPreviewMode('preview')}
            className={`px-3 py-1 rounded ${previewMode === 'preview' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Preview
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`px-3 py-1 rounded ${previewMode === 'mobile' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Mobile
          </button>
        </div>

        {/* Editor Canvas */}
        <div className="p-6 overflow-auto">
          <div 
            ref={editorRef}
            className={`mx-auto bg-white shadow-lg ${
              previewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'
            }`}
            style={{
              backgroundColor: template.styles.backgroundColor,
              fontFamily: template.styles.fontFamily
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => setSelectedComponentId(null)}
          >
            {template.components.length === 0 ? (
              <div className="p-12 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-lg mb-4">Start building your email</p>
                <p>Drag components from the sidebar to get started</p>
              </div>
            ) : (
              <div className="min-h-96">
                {previewMode === 'design' 
                  ? template.components.map(renderDesignComponent)
                  : <div dangerouslySetInnerHTML={{ __html: exportHtml() }} />
                }
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

EmailEditorCore.displayName = 'EmailEditorCore';