import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  Maximize,
  Minimize,
  Settings,
  Users,
  History,
  Palette,
  Zap,
  FileText,
  Mail,
  ChevronDown,
  Play,
  Code,
  Globe,
  Share
} from 'lucide-react';
import { StripoEmailTemplate, StripoUser } from '../types/stripo.types';

interface StripoToolbarProps {
  template?: StripoEmailTemplate;
  onSave: () => void;
  onExport: (format: 'html' | 'amp') => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onPreview: () => void;
  onTemplateLibrary: () => void;
  onVersionHistory: () => void;
  onCollaboration: () => void;
  previewDevice: 'desktop' | 'mobile' | 'tablet';
  onPreviewDeviceChange: (device: 'desktop' | 'mobile' | 'tablet') => void;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
  collaborators: StripoUser[];
  activeUsers: StripoUser[];
  user?: StripoUser;
  aiAssistantEnabled?: boolean;
  gameGeneratorEnabled?: boolean;
  ampSupport?: boolean;
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
  onVersionHistory,
  onCollaboration,
  previewDevice,
  onPreviewDeviceChange,
  isFullscreen,
  onFullscreenToggle,
  collaborators,
  activeUsers,
  user,
  aiAssistantEnabled = true,
  gameGeneratorEnabled = true,
  ampSupport = true
}: StripoToolbarProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [templateName, setTemplateName] = useState(template?.name || 'Untitled Template');

  const handleNameSubmit = () => {
    setIsEditingName(false);
    // Update template name through parent component
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
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
      {/* Left Section - Branding & Template Info */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 hidden sm:block">Stripo</span>
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
              className="text-lg font-medium bg-transparent border-2 border-blue-500 focus:border-blue-600 max-w-xs"
              autoFocus
            />
          ) : (
            <h1
              className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
              onClick={() => setIsEditingName(true)}
            >
              {templateName}
            </h1>
          )}

          {/* Template Status */}
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Draft
            </Badge>
            
            {template && (
              <Badge variant="outline" className="text-xs">
                <FileText className="w-3 h-3 mr-1" />
                {template.metadata.components} components
              </Badge>
            )}

            {ampSupport && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                <Zap className="w-3 h-3 mr-1" />
                AMP Ready
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Center Section - Main Actions */}
      <div className="flex items-center space-x-2">
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

        {/* Preview Controls */}
        <div className="flex items-center bg-gray-100 rounded-md p-1">
          <Button
            variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPreviewDeviceChange('desktop')}
            className="px-2 py-1"
            title="Desktop Preview"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPreviewDeviceChange('tablet')}
            className="px-2 py-1"
            title="Tablet Preview"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPreviewDeviceChange('mobile')}
            className="px-2 py-1"
            title="Mobile Preview"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onPreview}
          className="flex items-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Preview</span>
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* AI & Special Features */}
        {aiAssistantEnabled && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="hidden sm:inline">AI Assistant</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              <DropdownMenuItem>
                <Palette className="w-4 h-4 mr-2" />
                Generate Content
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Globe className="w-4 h-4 mr-2" />
                Translate Text
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="w-4 h-4 mr-2" />
                Optimize Subject
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                Generate Alt Text
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {gameGeneratorEnabled && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Games</span>
          </Button>
        )}
      </div>

      {/* Right Section - Save & Export */}
      <div className="flex items-center space-x-2">
        {/* Collaboration */}
        {collaborators.length > 0 && (
          <div className="flex items-center space-x-1">
            <div className="flex -space-x-2">
              {activeUsers.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="relative w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 overflow-hidden"
                  title={user.name}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                  {user.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
            
            {activeUsers.length > 3 && (
              <span className="text-sm text-gray-500">+{activeUsers.length - 3}</span>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onCollaboration}
              className="p-2"
              title="Collaboration"
            >
              <Users className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Version History */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onVersionHistory}
          className="p-2"
          title="Version History"
        >
          <History className="w-4 h-4" />
        </Button>

        {/* Template Library */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onTemplateLibrary}
          className="p-2"
          title="Template Library"
        >
          <FileText className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Export Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport('html')}>
              <Code className="w-4 h-4 mr-2" />
              Export as HTML
            </DropdownMenuItem>
            {ampSupport && (
              <DropdownMenuItem onClick={() => onExport('amp')}>
                <Zap className="w-4 h-4 mr-2 text-green-600" />
                Export as AMP
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Share className="w-4 h-4 mr-2" />
              Share Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Fullscreen Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onFullscreenToggle}
          className="p-2"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </Button>

        {/* Save Button */}
        <Button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2"
          size="sm"
          title="Save Template (Ctrl+S)"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </Button>
      </div>
    </div>
  );
}