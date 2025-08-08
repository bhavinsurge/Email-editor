import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Type, 
  Image, 
  MousePointer, 
  Heading, 
  Minus,
  GripHorizontal,
  Columns,
  AlignLeft,
  Plus
} from 'lucide-react';
import type { EmailComponent, MergeTag } from './EmailEditorCore';

interface ComponentSidebarProps {
  onAddComponent: (type: EmailComponent['type']) => void;
  mergeTags?: MergeTag[];
  onInsertMergeTag?: (tag: MergeTag) => void;
}

const componentTypes = [
  { type: 'text' as const, label: 'Text Block', icon: Type, description: 'Add text content with merge tag support' },
  { type: 'header' as const, label: 'Header', icon: Heading, description: 'Email header with title and subtitle' },
  { type: 'image' as const, label: 'Image', icon: Image, description: 'Add images with responsive sizing' },
  { type: 'button' as const, label: 'Button', icon: MousePointer, description: 'Call-to-action button' },
  { type: 'columns' as const, label: 'Columns', icon: Columns, description: 'Multi-column layout' },
  { type: 'divider' as const, label: 'Divider', icon: Minus, description: 'Horizontal line separator' },
  { type: 'spacer' as const, label: 'Spacer', icon: GripHorizontal, description: 'Add vertical spacing' },
  { type: 'footer' as const, label: 'Footer', icon: AlignLeft, description: 'Email footer content' },
];

const defaultMergeTags: MergeTag[] = [
  { key: 'name', label: 'First Name', type: 'text', defaultValue: 'John' },
  { key: 'lastName', label: 'Last Name', type: 'text', defaultValue: 'Doe' },
  { key: 'email', label: 'Email Address', type: 'email', defaultValue: 'john@example.com' },
  { key: 'company', label: 'Company Name', type: 'text', defaultValue: 'Acme Corp' },
  { key: 'phone', label: 'Phone Number', type: 'text', defaultValue: '+1 (555) 123-4567' },
  { key: 'date', label: 'Current Date', type: 'date', defaultValue: new Date().toLocaleDateString() },
  { key: 'orderNumber', label: 'Order Number', type: 'text', defaultValue: '#12345' },
  { key: 'amount', label: 'Amount', type: 'number', defaultValue: '$99.99' },
  { key: 'productName', label: 'Product Name', type: 'text', defaultValue: 'Premium Package' },
  { key: 'websiteUrl', label: 'Website URL', type: 'url', defaultValue: 'https://example.com' }
];

export function ComponentSidebar({ onAddComponent, mergeTags = defaultMergeTags, onInsertMergeTag }: ComponentSidebarProps) {
  const handleDragStart = (e: React.DragEvent, componentType: EmailComponent['type']) => {
    e.dataTransfer.setData('text/plain', componentType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const copyMergeTagToClipboard = async (tag: MergeTag) => {
    try {
      await navigator.clipboard.writeText(`{{${tag.key}}}`);
      // You might want to show a toast notification here
    } catch (error) {
      console.error('Failed to copy merge tag:', error);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Email Components</h2>
        <p className="text-sm text-gray-600 mt-1">Drag components to the canvas</p>
      </div>

      {/* Components Section */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
          Components
        </h3>
        <div className="space-y-2">
          {componentTypes.map((component) => {
            const Icon = component.icon;
            return (
              <div
                key={component.type}
                className="p-3 border-2 border-dashed border-gray-200 rounded-lg cursor-grab hover:border-blue-500 hover:bg-blue-50 transition-colors active:cursor-grabbing group"
                draggable
                onDragStart={(e) => handleDragStart(e, component.type)}
                onClick={() => onAddComponent(component.type)}
              >
                <div className="flex items-start">
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                      {component.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-tight">
                      {component.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Merge Tags Section */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
          Personalization Tags
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Click to copy merge tags for personalization
        </p>
        
        <div className="space-y-2">
          {mergeTags.map((tag) => (
            <Card key={tag.key} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{tag.label}</p>
                    <p className="text-xs text-gray-500 font-mono">
                      {`{{${tag.key}}}`}
                    </p>
                    {tag.defaultValue && (
                      <p className="text-xs text-blue-600 mt-1">
                        Preview: {tag.defaultValue}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyMergeTagToClipboard(tag)}
                    className="ml-2 p-1 h-auto"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Merge Tag Input */}
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Custom Tags</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-gray-500 mb-2">
              You can create custom merge tags like:
            </p>
            <div className="space-y-1 text-xs font-mono bg-gray-50 p-2 rounded">
              <div>{'{{firstName}}'}</div>
              <div>{'{{orderTotal}}'}</div>
              <div>{'{{companyName}}'}</div>
              <div>{'{{customField}}'}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Templates Section */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
          Quick Templates
        </h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              // Add a welcome email template
              onAddComponent('header');
              setTimeout(() => onAddComponent('text'), 100);
              setTimeout(() => onAddComponent('button'), 200);
              setTimeout(() => onAddComponent('footer'), 300);
            }}
          >
            <Heading className="w-4 h-4 mr-2" />
            Welcome Email
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              // Add a newsletter template
              onAddComponent('header');
              setTimeout(() => onAddComponent('image'), 100);
              setTimeout(() => onAddComponent('text'), 200);
              setTimeout(() => onAddComponent('columns'), 300);
              setTimeout(() => onAddComponent('footer'), 400);
            }}
          >
            <Type className="w-4 h-4 mr-2" />
            Newsletter
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              // Add a promotional template
              onAddComponent('header');
              setTimeout(() => onAddComponent('image'), 100);
              setTimeout(() => onAddComponent('text'), 200);
              setTimeout(() => onAddComponent('button'), 300);
              setTimeout(() => onAddComponent('divider'), 400);
              setTimeout(() => onAddComponent('footer'), 500);
            }}
          >
            <MousePointer className="w-4 h-4 mr-2" />
            Promotional
          </Button>
        </div>
      </div>
    </div>
  );
}