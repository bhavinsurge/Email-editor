import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Save,
  Download,
  Undo,
  Redo,
  Eye,
  Monitor,
  Smartphone,
  Tablet,
  Mail,
  ChevronDown
} from 'lucide-react';
import { StripoEmailTemplate } from '../types/stripo.types';

interface StripoToolbarProps {
  template?: StripoEmailTemplate;
  onSave: () => void;
  onExport: (format: 'html') => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onPreview: () => void;
  onTemplateLibrary: () => void;
  previewDevice: 'desktop' | 'mobile' | 'tablet';
  onPreviewDeviceChange: (device: 'desktop' | 'mobile' | 'tablet') => void;
}

export function StripoToolbar({
  template,
  onSave,
  onExport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onPreview,
  onTemplateLibrary,
  previewDevice,
  onPreviewDeviceChange
}: StripoToolbarProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [templateName, setTemplateName] = useState(template?.name || 'Untitled Template');

  const handleNameSubmit = () => {
    setIsEditingName(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
    if (e.key === 'Escape') {
      setTemplateName(template?.name || 'Untitled Template');
      setIsEditingName(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center justify-between shadow-sm">
      {/* Left Section - Branding & Template Info */}
      <div className="flex items-center space-x-3">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-gray-100 hidden sm:block">Email Builder</span>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Template Name */}
        <div className="flex items-center space-x-2">
          {isEditingName ? (
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleKeyPress}
              className="text-sm font-medium bg-transparent border border-blue-500 focus:border-blue-600 max-w-xs h-8"
              autoFocus
              data-testid="input-template-name"
            />
          ) : (
            <h1
              className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsEditingName(true)}
              data-testid="text-template-name"
            >
              {templateName}
            </h1>
          )}

          <Badge variant="secondary" className="text-xs">
            Draft
          </Badge>
        </div>
      </div>

      {/* Center Section - Main Actions */}
      <div className="flex items-center space-x-1">
        {/* Undo/Redo */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-8 w-8 p-0"
            title="Undo (Ctrl+Z)"
            data-testid="button-undo"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-8 w-8 p-0"
            title="Redo (Ctrl+Y)"
            data-testid="button-redo"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Preview Controls */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-1">
          <Button
            variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPreviewDeviceChange('desktop')}
            className="h-7 w-7 p-0"
            title="Desktop Preview"
            data-testid="button-preview-desktop"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPreviewDeviceChange('tablet')}
            className="h-7 w-7 p-0"
            title="Tablet Preview"
            data-testid="button-preview-tablet"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPreviewDeviceChange('mobile')}
            className="h-7 w-7 p-0"
            title="Mobile Preview"
            data-testid="button-preview-mobile"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onPreview}
          className="flex items-center space-x-1 h-8 px-3"
          data-testid="button-preview"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Preview</span>
        </Button>
      </div>

      {/* Right Section - Save & Export */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onTemplateLibrary}
          className="h-8 px-3 text-xs"
          data-testid="button-templates"
        >
          Templates
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          className="h-8 px-3 text-xs"
          data-testid="button-save"
        >
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="default" 
              size="sm" 
              className="h-8 px-3 text-xs"
              data-testid="button-export"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport('html')} data-testid="menu-export-html">
              Export as HTML
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}