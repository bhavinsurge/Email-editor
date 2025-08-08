import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MousePointer, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface PropertiesPanelProps {
  selectedComponent?: any;
  onComponentUpdate?: (componentId: string, updates: any) => void;
}

export function PropertiesPanel({ selectedComponent, onComponentUpdate }: PropertiesPanelProps) {
  const [textAlign, setTextAlign] = useState('left');

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
          <p className="text-sm text-gray-500 mt-1">Configure the selected component</p>
        </div>
        
        <div className="p-4 text-center text-gray-500">
          <MousePointer className="w-8 h-8 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleUpdate = (field: string, value: any) => {
    if (onComponentUpdate && selectedComponent.id) {
      onComponentUpdate(selectedComponent.id, { [field]: value });
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
        <p className="text-sm text-gray-500 mt-1">Configure the selected component</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Text Properties */}
        {(selectedComponent.type === 'text' || selectedComponent.type === 'header') && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Text Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content" className="text-sm font-medium">Content</Label>
                <Textarea
                  id="content"
                  rows={4}
                  value={selectedComponent.content || selectedComponent.title || ''}
                  onChange={(e) => handleUpdate('content', e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="fontSize" className="text-sm font-medium">Font Size</Label>
                  <Select value={selectedComponent.styles?.fontSize || '16px'} onValueChange={(value) => handleUpdate('styles.fontSize', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12px">12px</SelectItem>
                      <SelectItem value="14px">14px</SelectItem>
                      <SelectItem value="16px">16px</SelectItem>
                      <SelectItem value="18px">18px</SelectItem>
                      <SelectItem value="20px">20px</SelectItem>
                      <SelectItem value="24px">24px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fontWeight" className="text-sm font-medium">Font Weight</Label>
                  <Select value={selectedComponent.styles?.fontWeight || 'normal'} onValueChange={(value) => handleUpdate('styles.fontWeight', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="semibold">Semibold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="textColor" className="text-sm font-medium">Text Color</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="color"
                    value={selectedComponent.styles?.color || '#374151'}
                    onChange={(e) => handleUpdate('styles.color', e.target.value)}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={selectedComponent.styles?.color || '#374151'}
                    onChange={(e) => handleUpdate('styles.color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Text Alignment</Label>
                <div className="flex border border-gray-300 rounded-lg overflow-hidden mt-2">
                  <Button
                    variant={textAlign === 'left' ? 'default' : 'ghost'}
                    size="sm"
                    className="flex-1 rounded-none"
                    onClick={() => {
                      setTextAlign('left');
                      handleUpdate('styles.textAlign', 'left');
                    }}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={textAlign === 'center' ? 'default' : 'ghost'}
                    size="sm"
                    className="flex-1 rounded-none"
                    onClick={() => {
                      setTextAlign('center');
                      handleUpdate('styles.textAlign', 'center');
                    }}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={textAlign === 'right' ? 'default' : 'ghost'}
                    size="sm"
                    className="flex-1 rounded-none"
                    onClick={() => {
                      setTextAlign('right');
                      handleUpdate('styles.textAlign', 'right');
                    }}
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Properties */}
        {selectedComponent.type === 'image' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Image Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="imageSrc" className="text-sm font-medium">Image URL</Label>
                <Input
                  id="imageSrc"
                  type="url"
                  value={selectedComponent.src || ''}
                  onChange={(e) => handleUpdate('src', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="imageAlt" className="text-sm font-medium">Alt Text</Label>
                <Input
                  id="imageAlt"
                  value={selectedComponent.alt || ''}
                  onChange={(e) => handleUpdate('alt', e.target.value)}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Button Properties */}
        {selectedComponent.type === 'button' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Button Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="buttonText" className="text-sm font-medium">Button Text</Label>
                <Input
                  id="buttonText"
                  value={selectedComponent.text || ''}
                  onChange={(e) => handleUpdate('text', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="buttonHref" className="text-sm font-medium">Link URL</Label>
                <Input
                  id="buttonHref"
                  type="url"
                  value={selectedComponent.href || ''}
                  onChange={(e) => handleUpdate('href', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="buttonColor" className="text-sm font-medium">Background Color</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="color"
                    value={selectedComponent.styles?.backgroundColor || '#2563eb'}
                    onChange={(e) => handleUpdate('styles.backgroundColor', e.target.value)}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={selectedComponent.styles?.backgroundColor || '#2563eb'}
                    onChange={(e) => handleUpdate('styles.backgroundColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Spacing & Layout */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Spacing & Layout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="padding" className="text-sm font-medium">Padding</Label>
                <Input
                  id="padding"
                  type="number"
                  value={selectedComponent.styles?.padding?.replace('px', '') || '16'}
                  onChange={(e) => handleUpdate('styles.padding', `${e.target.value}px`)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="margin" className="text-sm font-medium">Margin</Label>
                <Input
                  id="margin"
                  type="number"
                  value={selectedComponent.styles?.margin?.replace('px', '') || '8'}
                  onChange={(e) => handleUpdate('styles.margin', `${e.target.value}px`)}
                  className="mt-2"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="backgroundColor" className="text-sm font-medium">Background Color</Label>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="color"
                  value={selectedComponent.styles?.backgroundColor || '#ffffff'}
                  onChange={(e) => handleUpdate('styles.backgroundColor', e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  type="text"
                  value={selectedComponent.styles?.backgroundColor || '#ffffff'}
                  onChange={(e) => handleUpdate('styles.backgroundColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Options */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Advanced</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cssClass" className="text-sm font-medium">CSS Class</Label>
              <Input
                id="cssClass"
                placeholder="custom-class"
                value={selectedComponent.cssClass || ''}
                onChange={(e) => handleUpdate('cssClass', e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="customCss" className="text-sm font-medium">Custom CSS</Label>
              <Textarea
                id="customCss"
                rows={3}
                placeholder="color: red;"
                value={selectedComponent.customCss || ''}
                onChange={(e) => handleUpdate('customCss', e.target.value)}
                className="mt-2 font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
