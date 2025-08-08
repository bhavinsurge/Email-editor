import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  MousePointer, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic,
  Underline,
  Palette,
  Layout,
  Settings
} from 'lucide-react';
import type { EmailComponent, ComponentStyles, MergeTag } from './EmailEditorCore';

interface PropertiesEditorProps {
  selectedComponent?: EmailComponent | null;
  onUpdateComponent?: (id: string, updates: Partial<EmailComponent>) => void;
  mergeTags?: MergeTag[];
}

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];
const fontWeights = ['300', '400', '500', '600', '700', '800'];
const fontFamilies = [
  'Arial, sans-serif',
  'Helvetica, Arial, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Verdana, sans-serif',
  'Trebuchet MS, sans-serif',
  'Impact, sans-serif'
];

export function PropertiesEditor({ selectedComponent, onUpdateComponent, mergeTags = [] }: PropertiesEditorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content');

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
          <p className="text-sm text-gray-500 mt-1">Select a component to edit</p>
        </div>
        
        <div className="p-8 text-center text-gray-500">
          <MousePointer className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-sm">Click on any component in the email to start editing its properties</p>
        </div>
      </div>
    );
  }

  const updateComponent = (updates: Partial<EmailComponent>) => {
    if (onUpdateComponent && selectedComponent.id) {
      onUpdateComponent(selectedComponent.id, updates);
    }
  };

  const updateStyles = (styleUpdates: Partial<ComponentStyles>) => {
    updateComponent({
      styles: { ...selectedComponent.styles, ...styleUpdates }
    });
  };

  const insertMergeTag = (field: 'content' | 'title' | 'subtitle' | 'text', tag: string) => {
    const currentValue = selectedComponent[field] || '';
    const newValue = currentValue + `{{${tag}}}`;
    updateComponent({ [field]: newValue });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            {selectedComponent.type}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {selectedComponent.id.slice(0, 8)}
          </Badge>
        </div>
      </div>

      {/* Property Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
          <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="p-4 space-y-4">
          {/* Text Content */}
          {(selectedComponent.type === 'text' || selectedComponent.type === 'footer') && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <AlignLeft className="w-4 h-4 mr-2" />
                  Text Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="content" className="text-sm font-medium">Content</Label>
                  <Textarea
                    id="content"
                    rows={4}
                    value={selectedComponent.content || ''}
                    onChange={(e) => updateComponent({ content: e.target.value })}
                    className="mt-2"
                    placeholder="Your content here..."
                  />
                </div>
                
                {/* Merge Tags for Text */}
                <div>
                  <Label className="text-sm font-medium">Insert Merge Tags</Label>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {mergeTags.slice(0, 6).map((tag) => (
                      <Button
                        key={tag.key}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => insertMergeTag('content', tag.key)}
                      >
                        {tag.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Header Content */}
          {selectedComponent.type === 'header' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Header Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                  <Input
                    id="title"
                    value={selectedComponent.title || ''}
                    onChange={(e) => updateComponent({ title: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle" className="text-sm font-medium">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={selectedComponent.subtitle || ''}
                    onChange={(e) => updateComponent({ subtitle: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Image Content */}
          {selectedComponent.type === 'image' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Image Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="src" className="text-sm font-medium">Image URL</Label>
                  <Input
                    id="src"
                    type="url"
                    value={selectedComponent.src || ''}
                    onChange={(e) => updateComponent({ src: e.target.value })}
                    className="mt-2"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="alt" className="text-sm font-medium">Alt Text</Label>
                  <Input
                    id="alt"
                    value={selectedComponent.alt || ''}
                    onChange={(e) => updateComponent({ alt: e.target.value })}
                    className="mt-2"
                    placeholder="Describe the image"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Button Content */}
          {selectedComponent.type === 'button' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Button Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="text" className="text-sm font-medium">Button Text</Label>
                  <Input
                    id="text"
                    value={selectedComponent.text || ''}
                    onChange={(e) => updateComponent({ text: e.target.value })}
                    className="mt-2"
                    placeholder="Click Here"
                  />
                </div>
                <div>
                  <Label htmlFor="href" className="text-sm font-medium">Link URL</Label>
                  <Input
                    id="href"
                    type="url"
                    value={selectedComponent.href || ''}
                    onChange={(e) => updateComponent({ href: e.target.value })}
                    className="mt-2"
                    placeholder="https://example.com"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Style Tab */}
        <TabsContent value="style" className="p-4 space-y-4">
          {/* Typography */}
          {(selectedComponent.type === 'text' || selectedComponent.type === 'header' || selectedComponent.type === 'button' || selectedComponent.type === 'footer') && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Bold className="w-4 h-4 mr-2" />
                  Typography
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium">Font Size</Label>
                    <Select 
                      value={selectedComponent.styles.fontSize || '16px'} 
                      onValueChange={(value) => updateStyles({ fontSize: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontSizes.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Font Weight</Label>
                    <Select 
                      value={selectedComponent.styles.fontWeight || '400'} 
                      onValueChange={(value) => updateStyles({ fontWeight: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontWeights.map(weight => (
                          <SelectItem key={weight} value={weight}>
                            {weight === '300' ? 'Light' : 
                             weight === '400' ? 'Normal' :
                             weight === '500' ? 'Medium' :
                             weight === '600' ? 'Semibold' :
                             weight === '700' ? 'Bold' :
                             weight === '800' ? 'Extra Bold' : weight}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Font Family</Label>
                  <Select 
                    value={selectedComponent.styles.fontFamily || 'Arial, sans-serif'} 
                    onValueChange={(value) => updateStyles({ fontFamily: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map(family => (
                        <SelectItem key={family} value={family}>{family.split(',')[0]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Text Alignment</Label>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden mt-2">
                    <Button
                      variant={selectedComponent.styles.textAlign === 'left' ? 'default' : 'ghost'}
                      size="sm"
                      className="flex-1 rounded-none"
                      onClick={() => updateStyles({ textAlign: 'left' })}
                    >
                      <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={selectedComponent.styles.textAlign === 'center' ? 'default' : 'ghost'}
                      size="sm"
                      className="flex-1 rounded-none"
                      onClick={() => updateStyles({ textAlign: 'center' })}
                    >
                      <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={selectedComponent.styles.textAlign === 'right' ? 'default' : 'ghost'}
                      size="sm"
                      className="flex-1 rounded-none"
                      onClick={() => updateStyles({ textAlign: 'right' })}
                    >
                      <AlignRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Colors */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Palette className="w-4 h-4 mr-2" />
                Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(selectedComponent.type === 'text' || selectedComponent.type === 'header' || selectedComponent.type === 'button' || selectedComponent.type === 'footer') && (
                <div>
                  <Label className="text-sm font-medium">Text Color</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="color"
                      value={selectedComponent.styles.color || '#333333'}
                      onChange={(e) => updateStyles({ color: e.target.value })}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={selectedComponent.styles.color || '#333333'}
                      onChange={(e) => updateStyles({ color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium">Background Color</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="color"
                    value={selectedComponent.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={selectedComponent.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Spacing */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Layout className="w-4 h-4 mr-2" />
                Spacing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium">Padding</Label>
                  <Input
                    type="text"
                    value={selectedComponent.styles.padding || '16px'}
                    onChange={(e) => updateStyles({ padding: e.target.value })}
                    className="mt-2"
                    placeholder="16px"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Margin</Label>
                  <Input
                    type="text"
                    value={selectedComponent.styles.margin || '8px 0'}
                    onChange={(e) => updateStyles({ margin: e.target.value })}
                    className="mt-2"
                    placeholder="8px 0"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Border Radius</Label>
                <Input
                  type="text"
                  value={selectedComponent.styles.borderRadius || '0px'}
                  onChange={(e) => updateStyles({ borderRadius: e.target.value })}
                  className="mt-2"
                  placeholder="0px"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="p-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Custom CSS</Label>
                <Textarea
                  rows={4}
                  placeholder="border: 1px solid #ccc;&#10;box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                  className="mt-2 font-mono text-sm"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">CSS Classes</Label>
                <Input
                  type="text"
                  placeholder="custom-class another-class"
                  className="mt-2"
                />
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium">Component ID</Label>
                <Input
                  type="text"
                  value={selectedComponent.id}
                  disabled
                  className="mt-2 bg-gray-50"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Component Type</Label>
                <Input
                  type="text"
                  value={selectedComponent.type}
                  disabled
                  className="mt-2 bg-gray-50"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}