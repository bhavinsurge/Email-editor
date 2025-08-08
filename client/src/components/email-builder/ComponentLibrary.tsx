import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Square, 
  Columns, 
  Type, 
  Image, 
  MousePointer, 
  Heading, 
  Minus,
  Share2,
  Code,
  GripHorizontal,
  Plus,
  FolderOpen,
  Settings
} from "lucide-react";

interface ComponentLibraryProps {
  onNewTemplate?: () => void;
  onLoadTemplate?: () => void;
}

interface ComponentItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'structure' | 'content' | 'advanced';
}

const components: ComponentItem[] = [
  // Structure Components
  { id: 'container', name: 'Container', icon: <Square className="w-4 h-4" />, category: 'structure' },
  { id: 'columns', name: 'Columns', icon: <Columns className="w-4 h-4" />, category: 'structure' },
  { id: 'spacer', name: 'Spacer', icon: <GripHorizontal className="w-4 h-4" />, category: 'structure' },
  
  // Content Components
  { id: 'text', name: 'Text', icon: <Type className="w-4 h-4" />, category: 'content' },
  { id: 'image', name: 'Image', icon: <Image className="w-4 h-4" />, category: 'content' },
  { id: 'button', name: 'Button', icon: <MousePointer className="w-4 h-4" />, category: 'content' },
  { id: 'header', name: 'Header', icon: <Heading className="w-4 h-4" />, category: 'content' },
  { id: 'footer', name: 'Footer', icon: <Minus className="w-4 h-4" />, category: 'content' },
  
  // Advanced Components
  { id: 'social', name: 'Social Links', icon: <Share2 className="w-4 h-4" />, category: 'advanced' },
  { id: 'divider', name: 'Divider', icon: <Minus className="w-4 h-4" />, category: 'advanced' },
  { id: 'html', name: 'HTML Block', icon: <Code className="w-4 h-4" />, category: 'advanced' },
];

const templates = [
  {
    id: 'newsletter',
    name: 'Newsletter Template',
    category: 'Marketing',
    thumbnail: 'bg-gradient-to-br from-blue-100 to-blue-200'
  },
  {
    id: 'welcome',
    name: 'Welcome Email',
    category: 'Onboarding',
    thumbnail: 'bg-gradient-to-br from-green-100 to-green-200'
  },
  {
    id: 'promotional',
    name: 'Promotional Email',
    category: 'Marketing',
    thumbnail: 'bg-gradient-to-br from-purple-100 to-purple-200'
  },
];

export function ComponentLibrary({ onNewTemplate, onLoadTemplate }: ComponentLibraryProps) {
  const [activeTab, setActiveTab] = useState<'components' | 'templates'>('components');

  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    e.dataTransfer.setData('text/plain', componentId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const renderComponentsByCategory = (category: ComponentItem['category']) => {
    const categoryComponents = components.filter(comp => comp.category === category);
    
    return categoryComponents.map((component) => (
      <div
        key={component.id}
        className="p-3 border-2 border-dashed border-gray-200 rounded-lg cursor-grab hover:border-blue-500 hover:bg-blue-50 transition-colors active:cursor-grabbing"
        draggable
        onDragStart={(e) => handleDragStart(e, component.id)}
      >
        <div className="flex items-center">
          <span className="text-gray-400 mr-3">
            {component.icon}
          </span>
          <span className="text-sm font-medium">{component.name}</span>
        </div>
      </div>
    ));
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Email Builder</h1>
          <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-gray-600">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Template Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={onNewTemplate}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
          <Button 
            onClick={onLoadTemplate}
            variant="outline" 
            size="sm"
            className="px-3"
          >
            <FolderOpen className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Component Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'components'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('components')}
        >
          Components
        </button>
        <button
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'templates'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
      </div>

      {/* Components Panel */}
      {activeTab === 'components' && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Structure Components */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Structure
              </h3>
              <div className="space-y-2">
                {renderComponentsByCategory('structure')}
              </div>
            </div>

            {/* Content Components */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Content
              </h3>
              <div className="space-y-2">
                {renderComponentsByCategory('content')}
              </div>
            </div>

            {/* Advanced Components */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Advanced
              </h3>
              <div className="space-y-2">
                {renderComponentsByCategory('advanced')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Panel */}
      {activeTab === 'templates' && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className={`aspect-[4/3] rounded mb-2 ${template.thumbnail}`}></div>
                  <p className="text-sm font-medium">{template.name}</p>
                  <p className="text-xs text-gray-500">{template.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
