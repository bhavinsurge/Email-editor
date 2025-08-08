import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Undo, 
  Redo, 
  Save, 
  Download, 
  Eye,
  Code,
  Palette,
  Circle
} from "lucide-react";

interface EditorToolbarProps {
  templateName?: string;
  onTemplateNameChange?: (name: string) => void;
  onSave?: () => void;
  onExport?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  currentView?: 'design' | 'preview' | 'code';
  onViewChange?: (view: 'design' | 'preview' | 'code') => void;
}

export function EditorToolbar({
  templateName = "Untitled Template",
  onTemplateNameChange,
  onSave,
  onExport,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  currentView = 'design',
  onViewChange
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
              className="text-lg font-semibold bg-transparent border-2 border-blue-500 focus:border-blue-600"
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
          
          {/* Status */}
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Circle className="w-2 h-2 mr-1 fill-current text-yellow-500" />
            Draft
          </Badge>
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
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2"
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
            >
              <Palette className="w-4 h-4 mr-1" />
              Design
            </Button>
            <Button
              variant={currentView === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange?.('preview')}
              className="px-3 py-1 text-sm font-medium rounded-md"
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button
              variant={currentView === 'code' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange?.('code')}
              className="px-3 py-1 text-sm font-medium rounded-md"
            >
              <Code className="w-4 h-4 mr-1" />
              HTML
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="px-4 py-2"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          
          <Button
            onClick={onExport}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export HTML
          </Button>
        </div>
      </div>
    </div>
  );
}
