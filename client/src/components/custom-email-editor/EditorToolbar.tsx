import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Undo, 
  Redo, 
  Save, 
  Download, 
  Eye,
  Code,
  Palette,
  Circle,
  Smartphone,
  Monitor,
  Zap,
  FileText,
  Mail
} from 'lucide-react';

interface EditorToolbarProps {
  templateName?: string;
  onTemplateNameChange?: (name: string) => void;
  onSave?: () => void;
  onExportHtml?: () => void;
  onExportAmp?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  currentView?: 'design' | 'preview' | 'mobile';
  onViewChange?: (view: 'design' | 'preview' | 'mobile') => void;
  ampSupport?: boolean;
  componentCount?: number;
}

export function EditorToolbar({
  templateName = "Untitled Template",
  onTemplateNameChange,
  onSave,
  onExportHtml,
  onExportAmp,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  currentView = 'design',
  onViewChange,
  ampSupport = false,
  componentCount = 0
}: EditorToolbarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(templateName);

  const handleNameSubmit = () => {
    if (onTemplateNameChange) {
      onTemplateNameChange(editingName);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
    if (e.key === 'Escape') {
      setEditingName(templateName);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Template Name */}
          {isEditing ? (
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleKeyPress}
              className="text-lg font-semibold bg-transparent border-2 border-blue-500 focus:border-blue-600 max-w-sm"
              autoFocus
            />
          ) : (
            <h1
              className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 px-2 py-1 rounded hover:bg-gray-50"
              onClick={() => setIsEditing(true)}
            >
              {templateName}
            </h1>
          )}
          
          {/* Status Badges */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              <Circle className="w-2 h-2 mr-1 fill-current text-yellow-500" />
              Draft
            </Badge>
            
            <Badge variant="outline" className="text-xs">
              <FileText className="w-3 h-3 mr-1" />
              {componentCount} components
            </Badge>
            
            {ampSupport && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                <Zap className="w-3 h-3 mr-1" />
                AMP Ready
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Undo/Redo */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={currentView === 'design' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange?.('design')}
              className="px-3 py-1 text-sm font-medium rounded-md"
              title="Design View"
            >
              <Palette className="w-4 h-4 mr-1" />
              Design
            </Button>
            <Button
              variant={currentView === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange?.('preview')}
              className="px-3 py-1 text-sm font-medium rounded-md"
              title="Desktop Preview"
            >
              <Monitor className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button
              variant={currentView === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange?.('mobile')}
              className="px-3 py-1 text-sm font-medium rounded-md"
              title="Mobile Preview"
            >
              <Smartphone className="w-4 h-4 mr-1" />
              Mobile
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Export Options */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportHtml}
              className="px-3 py-2"
              title="Export as HTML"
            >
              <Code className="w-4 h-4 mr-1" />
              HTML
            </Button>
            
            {ampSupport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExportAmp}
                className="px-3 py-2 border-green-300 text-green-700 hover:bg-green-50"
                title="Export as AMP Email"
              >
                <Zap className="w-4 h-4 mr-1" />
                AMP
              </Button>
            )}
          </div>

          {/* Save Button */}
          <Button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
            size="sm"
            title="Save Template (Ctrl+S)"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}