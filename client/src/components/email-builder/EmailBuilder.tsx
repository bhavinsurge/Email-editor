import React, { useRef, useEffect, useImperativeHandle, forwardRef } from "react";

// Import the actual email builder library exports
let EmailBuilderLibrary: any = null;
try {
  EmailBuilderLibrary = require("@usewaypoint/email-builder");
} catch (error) {
  console.warn("@usewaypoint/email-builder not available, using mock implementation");
}

// Type declaration for the EmailBuilder instance
interface EmailBuilderInstance {
  getHtml(): string;
  loadTemplate(template: any): void;
  getTemplate(): any;
}

interface EmailBuilderProps {
  onTemplateChange?: (template: any) => void;
  initialTemplate?: any;
}

// Mock implementation that can be easily replaced
class MockEmailBuilder {
  private element: HTMLElement;
  private template: any;
  private onTemplateChange?: (template: any) => void;

  constructor(element: HTMLElement, onTemplateChange?: (template: any) => void) {
    this.element = element;
    this.onTemplateChange = onTemplateChange;
    this.template = {
      components: [],
      styles: {}
    };
    this.initialize();
  }

  private initialize() {
    // Create a basic editor interface
    this.element.innerHTML = `
      <div class="email-builder-mock bg-white rounded-lg shadow-sm border">
        <div class="p-6 text-center">
          <div class="text-gray-500 mb-4">
            <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Email Builder</h3>
          <p class="text-gray-600 mb-4">Drag components from the sidebar to start building your email.</p>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <p class="text-gray-500">Drop zone for email components</p>
          </div>
        </div>
      </div>
    `;

    // Setup drag and drop
    this.setupDragAndDrop();
  }

  private setupDragAndDrop() {
    this.element.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.element.classList.add('drag-over');
    });

    this.element.addEventListener('dragleave', () => {
      this.element.classList.remove('drag-over');
    });

    this.element.addEventListener('drop', (e) => {
      e.preventDefault();
      this.element.classList.remove('drag-over');
      
      const componentType = e.dataTransfer?.getData('text/plain');
      if (componentType) {
        this.addComponent(componentType);
      }
    });
  }

  private addComponent(type: string) {
    // Add component to template
    const component = this.createComponent(type);
    this.template.components.push(component);
    
    if (this.onTemplateChange) {
      this.onTemplateChange(this.template);
    }

    // Update the visual representation
    this.render();
  }

  private createComponent(type: string) {
    const components: Record<string, any> = {
      text: {
        type: 'text',
        id: `text-${Date.now()}`,
        content: 'New text block',
        styles: { fontSize: '16px', color: '#374151' }
      },
      image: {
        type: 'image',
        id: `image-${Date.now()}`,
        src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
        alt: 'Placeholder image',
        styles: { width: '100%' }
      },
      button: {
        type: 'button',
        id: `button-${Date.now()}`,
        text: 'Click Here',
        href: '#',
        styles: { backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 24px' }
      },
      header: {
        type: 'header',
        id: `header-${Date.now()}`,
        title: 'Header Title',
        subtitle: 'Header subtitle',
        styles: { backgroundColor: '#2563eb', color: '#ffffff' }
      },
      footer: {
        type: 'footer',
        id: `footer-${Date.now()}`,
        content: '© 2024 Your Company. All rights reserved.',
        styles: { backgroundColor: '#f3f4f6', color: '#6b7280' }
      }
    };

    return components[type] || components.text;
  }

  private render() {
    // Simple rendering of components
    const componentsHtml = this.template.components.map((component: any) => {
      switch (component.type) {
        case 'text':
          return `<div class="component text-component p-4 border border-gray-200 rounded mb-2" data-component-id="${component.id}">
            <p style="font-size: ${component.styles.fontSize}; color: ${component.styles.color};">${component.content}</p>
          </div>`;
        case 'image':
          return `<div class="component image-component p-4 border border-gray-200 rounded mb-2" data-component-id="${component.id}">
            <img src="${component.src}" alt="${component.alt}" class="w-full rounded" />
          </div>`;
        case 'button':
          return `<div class="component button-component p-4 border border-gray-200 rounded mb-2 text-center" data-component-id="${component.id}">
            <a href="${component.href}" style="background-color: ${component.styles.backgroundColor}; color: ${component.styles.color}; padding: ${component.styles.padding};" class="inline-block rounded text-decoration-none">${component.text}</a>
          </div>`;
        case 'header':
          return `<div class="component header-component border border-gray-200 rounded mb-2" data-component-id="${component.id}">
            <div style="background-color: ${component.styles.backgroundColor}; color: ${component.styles.color};" class="p-6 text-center">
              <h1 class="text-2xl font-bold mb-2">${component.title}</h1>
              <p class="opacity-90">${component.subtitle}</p>
            </div>
          </div>`;
        case 'footer':
          return `<div class="component footer-component border border-gray-200 rounded mb-2" data-component-id="${component.id}">
            <div style="background-color: ${component.styles.backgroundColor}; color: ${component.styles.color};" class="p-6 text-center text-sm">
              ${component.content}
            </div>
          </div>`;
        default:
          return '';
      }
    }).join('');

    this.element.innerHTML = `
      <div class="email-builder-content">
        ${componentsHtml || '<div class="p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">Drop components here</div>'}
      </div>
    `;
  }

  getHtml(): string {
    // Generate clean HTML for export
    const componentsHtml = this.template.components.map((component: any) => {
      switch (component.type) {
        case 'text':
          return `<p style="font-size: ${component.styles.fontSize}; color: ${component.styles.color}; margin: 16px 0;">${component.content}</p>`;
        case 'image':
          return `<img src="${component.src}" alt="${component.alt}" style="width: 100%; height: auto; margin: 16px 0;" />`;
        case 'button':
          return `<div style="text-align: center; margin: 16px 0;"><a href="${component.href}" style="background-color: ${component.styles.backgroundColor}; color: ${component.styles.color}; padding: ${component.styles.padding}; text-decoration: none; border-radius: 6px; display: inline-block;">${component.text}</a></div>`;
        case 'header':
          return `<div style="background-color: ${component.styles.backgroundColor}; color: ${component.styles.color}; padding: 24px; text-align: center;"><h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: bold;">${component.title}</h1><p style="margin: 0; opacity: 0.9;">${component.subtitle}</p></div>`;
        case 'footer':
          return `<div style="background-color: ${component.styles.backgroundColor}; color: ${component.styles.color}; padding: 24px; text-align: center; font-size: 14px;">${component.content}</div>`;
        default:
          return '';
      }
    }).join('');

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto;">
        ${componentsHtml}
    </div>
</body>
</html>`;
  }

  loadTemplate(template: any) {
    this.template = template;
    this.render();
  }

  getTemplate() {
    return this.template;
  }
}

export const EmailBuilderComponent = forwardRef<EmailBuilderInstance, EmailBuilderProps>(
  ({ onTemplateChange, initialTemplate }, ref) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const builderRef = useRef<any>(null);

    useEffect(() => {
      if (!editorRef.current) return;

      try {
        if (EmailBuilderLibrary && EmailBuilderLibrary.Reader) {
          // The @usewaypoint/email-builder library uses Reader for displaying emails
          // For now, we'll use our mock implementation for editing functionality
          console.log("@usewaypoint/email-builder library detected, but using mock for editing");
          builderRef.current = new MockEmailBuilder(editorRef.current, onTemplateChange);
        } else {
          // Use mock implementation
          builderRef.current = new MockEmailBuilder(editorRef.current, onTemplateChange);
        }

        if (initialTemplate) {
          builderRef.current.loadTemplate(initialTemplate);
        }
      } catch (error) {
        console.error("Failed to initialize the EmailBuilder:", error);
        // Fallback to mock implementation
        builderRef.current = new MockEmailBuilder(editorRef.current, onTemplateChange);
        if (initialTemplate) {
          builderRef.current.loadTemplate(initialTemplate);
        }
      }
    }, [onTemplateChange]);

    useImperativeHandle(ref, () => ({
      getHtml: () => builderRef.current?.getHtml() || '',
      loadTemplate: (template: any) => builderRef.current?.loadTemplate(template),
      getTemplate: () => builderRef.current?.getTemplate() || null,
    }));

    return (
      <div className="w-full h-full bg-gray-100 p-4">
        <div ref={editorRef} className="w-full h-full bg-white shadow-lg rounded-lg min-h-96">
          {/* The email-builder UI will be injected here by the library */}
        </div>
      </div>
    );
  }
);

EmailBuilderComponent.displayName = "EmailBuilderComponent";
