import { useState, useCallback, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { StripoEmailTemplate, StripoComponent, StripoGlobalStyles } from '../types/stripo.types';

const defaultGlobalStyles: StripoGlobalStyles = {
  container: {
    maxWidth: '600px',
    backgroundColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    padding: '0'
  },
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#f59e0b',
    text: '#1f2937',
    background: '#ffffff',
    link: '#2563eb',
    border: '#e5e7eb'
  },
  typography: {
    headingFont: 'Arial, sans-serif',
    bodyFont: 'Arial, sans-serif',
    h1Size: '32px',
    h2Size: '24px',
    h3Size: '20px',
    bodySize: '16px',
    smallSize: '14px'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  responsive: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px'
  }
};

const createDefaultTemplate = (): StripoEmailTemplate => ({
  id: nanoid(),
  name: 'Untitled Email',
  subject: 'Your Email Subject',
  preheader: '',
  components: [],
  globalStyles: defaultGlobalStyles,
  settings: {
    width: 600,
    backgroundColor: '#f5f5f5',
    contentAreaBackgroundColor: '#ffffff',
    direction: 'ltr',
    language: 'en',
    outlookCompatibility: true,
    appleMail: true,
    gmail: true,
    yahooMail: true,
    darkModeSupport: false,
    ampSupport: false,
    interactiveElements: true,
    openTracking: true,
    clickTracking: true,
    unsubscribeLink: true,
    mergeTags: [],
    dynamicContent: false,
    conditionalContent: false
  },
  metadata: {
    description: '',
    industry: '',
    purpose: '',
    difficulty: 'beginner',
    estimatedTime: 30,
    components: 0,
    size: 0,
    version: '1.0.0',
    changelog: []
  },
  created: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  createdBy: 'user',
  modifiedBy: 'user',
  version: 1,
  tags: [],
  category: 'custom'
});

export function useStripoState(initialTemplate?: StripoEmailTemplate) {
  const [template, setTemplate] = useState<StripoEmailTemplate>(
    initialTemplate || createDefaultTemplate()
  );
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  const selectedComponent = useMemo(() => {
    if (!selectedComponentId) return null;
    
    const findComponent = (components: StripoComponent[]): StripoComponent | null => {
      for (const component of components) {
        if (component.id === selectedComponentId) return component;
        if (component.children) {
          const found = findComponent(component.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findComponent(template.components);
  }, [template.components, selectedComponentId]);

  const updateTemplate = useCallback((updates: Partial<StripoEmailTemplate> | StripoEmailTemplate) => {
    setTemplate(prev => ({
      ...prev,
      ...updates,
      lastModified: new Date().toISOString(),
      version: prev.version + 1,
      metadata: {
        ...prev.metadata,
        components: ('components' in updates && updates.components) 
          ? updates.components.length 
          : prev.metadata.components
      }
    }));
  }, []);

  const updateComponent = useCallback((componentId: string, updates: Partial<StripoComponent>) => {
    setTemplate(prev => {
      const updateComponentInArray = (components: StripoComponent[]): StripoComponent[] => {
        return components.map(component => {
          if (component.id === componentId) {
            return {
              ...component,
              ...updates,
              styles: updates.styles ? { ...component.styles, ...updates.styles } : component.styles,
              settings: updates.settings ? { ...component.settings, ...updates.settings } : component.settings,
              content: updates.content ? { ...component.content, ...updates.content } : component.content
            };
          }
          if (component.children) {
            return {
              ...component,
              children: updateComponentInArray(component.children)
            };
          }
          return component;
        });
      };

      return {
        ...prev,
        components: updateComponentInArray(prev.components),
        lastModified: new Date().toISOString(),
        version: prev.version + 1
      };
    });
  }, []);

  const addComponent = useCallback((
    componentType: StripoComponent['type'], 
    parentId?: string, 
    index?: number
  ) => {
    const newComponent: StripoComponent = createStripoComponent(componentType, template.globalStyles);
    
    setTemplate(prev => {
      if (!parentId) {
        // Add to root level
        const newComponents = [...prev.components];
        if (index !== undefined) {
          newComponents.splice(index, 0, newComponent);
        } else {
          newComponents.push(newComponent);
        }
        
        return {
          ...prev,
          components: newComponents.map((comp, idx) => ({ ...comp, order: idx })),
          lastModified: new Date().toISOString(),
          version: prev.version + 1,
          metadata: {
            ...prev.metadata,
            components: newComponents.length
          }
        };
      } else {
        // Add to specific parent
        const addToParent = (components: StripoComponent[]): StripoComponent[] => {
          return components.map(component => {
            if (component.id === parentId) {
              const children = component.children || [];
              if (index !== undefined) {
                children.splice(index, 0, { ...newComponent, parent: parentId });
              } else {
                children.push({ ...newComponent, parent: parentId });
              }
              return {
                ...component,
                children: children.map((child, idx) => ({ ...child, order: idx }))
              };
            }
            if (component.children) {
              return {
                ...component,
                children: addToParent(component.children)
              };
            }
            return component;
          });
        };

        return {
          ...prev,
          components: addToParent(prev.components),
          lastModified: new Date().toISOString(),
          version: prev.version + 1
        };
      }
    });

    setSelectedComponentId(newComponent.id);
    return newComponent.id;
  }, [template.globalStyles]);

  const deleteComponent = useCallback((componentId: string) => {
    setTemplate(prev => {
      const removeFromArray = (components: StripoComponent[]): StripoComponent[] => {
        return components
          .filter(component => component.id !== componentId)
          .map(component => {
            if (component.children) {
              return {
                ...component,
                children: removeFromArray(component.children)
              };
            }
            return component;
          })
          .map((comp, idx) => ({ ...comp, order: idx }));
      };

      const newComponents = removeFromArray(prev.components);
      
      return {
        ...prev,
        components: newComponents,
        lastModified: new Date().toISOString(),
        version: prev.version + 1,
        metadata: {
          ...prev.metadata,
          components: countComponents(newComponents)
        }
      };
    });

    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
  }, [selectedComponentId]);

  const duplicateComponent = useCallback((componentId: string) => {
    const component = selectedComponent;
    if (!component) return;

    const duplicatedComponent: StripoComponent = {
      ...JSON.parse(JSON.stringify(component)), // Deep clone
      id: nanoid(),
      order: component.order + 1
    };

    // Update IDs for all nested components
    const updateNestedIds = (comp: StripoComponent): StripoComponent => {
      if (comp.children) {
        comp.children = comp.children.map(child => updateNestedIds({ ...child, id: nanoid() }));
      }
      return comp;
    };

    const finalComponent = updateNestedIds(duplicatedComponent);

    setTemplate(prev => {
      const insertAfter = (components: StripoComponent[]): StripoComponent[] => {
        const result: StripoComponent[] = [];
        
        for (const comp of components) {
          result.push(comp);
          if (comp.id === componentId) {
            result.push(finalComponent);
          } else if (comp.children) {
            comp.children = insertAfter(comp.children);
          }
        }
        
        return result.map((comp, idx) => ({ ...comp, order: idx }));
      };

      const newComponents = insertAfter(prev.components);
      
      return {
        ...prev,
        components: newComponents,
        lastModified: new Date().toISOString(),
        version: prev.version + 1,
        metadata: {
          ...prev.metadata,
          components: countComponents(newComponents)
        }
      };
    });

    setSelectedComponentId(finalComponent.id);
    return finalComponent.id;
  }, [selectedComponent]);

  const reorderComponents = useCallback((dragId: string, hoverId: string, dragIndex: number, hoverIndex: number) => {
    setTemplate(prev => {
      const reorderInArray = (components: StripoComponent[]): StripoComponent[] => {
        const dragComponent = components.find(c => c.id === dragId);
        const hoverComponent = components.find(c => c.id === hoverId);
        
        if (dragComponent && hoverComponent) {
          const newComponents = [...components];
          newComponents.splice(dragIndex, 1);
          newComponents.splice(hoverIndex, 0, dragComponent);
          return newComponents.map((comp, idx) => ({ ...comp, order: idx }));
        }
        
        return components.map(component => {
          if (component.children) {
            return {
              ...component,
              children: reorderInArray(component.children)
            };
          }
          return component;
        });
      };

      return {
        ...prev,
        components: reorderInArray(prev.components),
        lastModified: new Date().toISOString(),
        version: prev.version + 1
      };
    });
  }, []);

  const updateGlobalStyles = useCallback((updates: Partial<StripoGlobalStyles>) => {
    setTemplate(prev => ({
      ...prev,
      globalStyles: {
        ...prev.globalStyles,
        ...updates,
        container: updates.container ? { ...prev.globalStyles.container, ...updates.container } : prev.globalStyles.container,
        colors: updates.colors ? { ...prev.globalStyles.colors, ...updates.colors } : prev.globalStyles.colors,
        typography: updates.typography ? { ...prev.globalStyles.typography, ...updates.typography } : prev.globalStyles.typography,
        spacing: updates.spacing ? { ...prev.globalStyles.spacing, ...updates.spacing } : prev.globalStyles.spacing,
        borderRadius: updates.borderRadius ? { ...prev.globalStyles.borderRadius, ...updates.borderRadius } : prev.globalStyles.borderRadius,
        shadows: updates.shadows ? { ...prev.globalStyles.shadows, ...updates.shadows } : prev.globalStyles.shadows,
        responsive: updates.responsive ? { ...prev.globalStyles.responsive, ...updates.responsive } : prev.globalStyles.responsive
      },
      lastModified: new Date().toISOString(),
      version: prev.version + 1
    }));
  }, []);

  const selectComponent = useCallback((componentId: string | null) => {
    setSelectedComponentId(componentId);
  }, []);

  return {
    template,
    selectedComponent,
    selectedComponentId,
    globalStyles: template.globalStyles,
    updateTemplate,
    updateComponent,
    addComponent,
    deleteComponent,
    duplicateComponent,
    reorderComponents,
    updateGlobalStyles,
    selectComponent
  };
}

// Helper function to create a new Stripo component
function createStripoComponent(type: StripoComponent['type'], globalStyles: StripoGlobalStyles): StripoComponent {
  const baseComponent: StripoComponent = {
    id: nanoid(),
    type,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Component`,
    locked: false,
    hidden: false,
    order: 0,
    styles: {},
    settings: {
      visible: true,
      hiddenOnMobile: false,
      hiddenOnDesktop: false,
      mobileVisible: true,
      tabletVisible: true,
      autoHeight: true,
      overflow: 'visible',
      ampValidation: true
    }
  };

  switch (type) {
    case 'container':
      return {
        ...baseComponent,
        styles: {
          maxWidth: globalStyles.container.maxWidth,
          backgroundColor: globalStyles.colors.background,
          padding: globalStyles.spacing.md,
          margin: '0 auto'
        },
        children: []
      };

    case 'row':
      return {
        ...baseComponent,
        styles: {
          display: 'flex',
          width: '100%',
          gap: globalStyles.spacing.sm
        },
        children: []
      };

    case 'column':
      return {
        ...baseComponent,
        styles: {
          flex: '1',
          padding: globalStyles.spacing.sm
        },
        children: []
      };

    case 'text':
      return {
        ...baseComponent,
        content: {
          text: 'Your text content here. You can personalize with {{firstName}} and other merge tags.',
          variables: []
        },
        styles: {
          fontSize: globalStyles.typography.bodySize,
          fontFamily: globalStyles.typography.bodyFont,
          color: globalStyles.colors.text,
          lineHeight: globalStyles.container.lineHeight,
          padding: globalStyles.spacing.sm
        }
      };

    case 'heading':
      return {
        ...baseComponent,
        content: {
          text: 'Your Heading Text',
          title: 'Heading'
        },
        styles: {
          fontSize: globalStyles.typography.h2Size,
          fontFamily: globalStyles.typography.headingFont,
          fontWeight: '600',
          color: globalStyles.colors.text,
          padding: globalStyles.spacing.sm,
          margin: `${globalStyles.spacing.sm} 0`
        }
      };

    case 'image':
      return {
        ...baseComponent,
        content: {
          src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=300&fit=crop',
          alt: 'Placeholder image',
          href: ''
        },
        styles: {
          width: '100%',
          height: 'auto',
          borderRadius: globalStyles.borderRadius.md,
          padding: globalStyles.spacing.sm
        }
      };

    case 'button':
      return {
        ...baseComponent,
        content: {
          text: 'Click Here',
          href: 'https://example.com'
        },
        styles: {
          backgroundColor: globalStyles.colors.primary,
          color: '#ffffff',
          padding: `${globalStyles.spacing.sm} ${globalStyles.spacing.lg}`,
          borderRadius: globalStyles.borderRadius.md,
          textDecoration: 'none',
          display: 'inline-block',
          fontWeight: '500',
          textAlign: 'center',
          border: 'none',
          cursor: 'pointer',
          margin: globalStyles.spacing.sm
        }
      };

    case 'divider':
      return {
        ...baseComponent,
        styles: {
          height: '1px',
          backgroundColor: globalStyles.colors.border,
          margin: `${globalStyles.spacing.lg} 0`,
          border: 'none'
        }
      };

    case 'spacer':
      return {
        ...baseComponent,
        styles: {
          height: globalStyles.spacing.xl,
          backgroundColor: 'transparent'
        }
      };

    case 'social':
      return {
        ...baseComponent,
        content: {
          items: [
            { id: nanoid(), type: 'facebook', content: 'https://facebook.com' },
            { id: nanoid(), type: 'twitter', content: 'https://twitter.com' },
            { id: nanoid(), type: 'instagram', content: 'https://instagram.com' }
          ]
        },
        styles: {
          display: 'flex',
          gap: globalStyles.spacing.sm,
          justifyContent: 'center',
          padding: globalStyles.spacing.md
        }
      };

    case 'video':
      return {
        ...baseComponent,
        content: {
          src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          alt: 'Video thumbnail',
          href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        styles: {
          width: '100%',
          height: '300px',
          borderRadius: globalStyles.borderRadius.md,
          padding: globalStyles.spacing.sm
        }
      };

    case 'html':
      return {
        ...baseComponent,
        content: {
          html: '<p>Custom HTML content goes here</p>'
        },
        styles: {
          padding: globalStyles.spacing.sm
        }
      };

    case 'timer':
      return {
        ...baseComponent,
        content: {
          title: 'Limited Time Offer',
          description: 'Hurry! This offer expires soon.',
          variables: [
            { key: 'endDate', label: 'End Date', type: 'date', defaultValue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }
          ]
        },
        styles: {
          textAlign: 'center',
          padding: globalStyles.spacing.lg,
          backgroundColor: globalStyles.colors.accent,
          color: '#ffffff',
          borderRadius: globalStyles.borderRadius.md
        }
      };

    default:
      return baseComponent;
  }
}

// Helper function to count total components
function countComponents(components: StripoComponent[]): number {
  let count = components.length;
  for (const component of components) {
    if (component.children) {
      count += countComponents(component.children);
    }
  }
  return count;
}