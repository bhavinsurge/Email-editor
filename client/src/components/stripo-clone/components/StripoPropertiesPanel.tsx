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
  Settings, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic,
  Underline,
  Palette,
  Layout,
  Type,
  Smartphone,
  Monitor,
  Zap
} from 'lucide-react';
import { StripoComponent, StripoEmailTemplate, StripoGlobalStyles, StripoComponentStyles } from '../types/stripo.types';

interface StripoPropertiesPanelProps {
  selectedComponent?: StripoComponent | null;
  template?: StripoEmailTemplate;
  onComponentUpdate: (componentId: string, updates: Partial<StripoComponent>) => void;
  onGlobalStylesUpdate: (updates: Partial<StripoGlobalStyles>) => void;
  customFontsEnabled?: boolean;
  ampSupport?: boolean;
  globalStyles: StripoGlobalStyles;
}

const fontFamilies = [
  'Arial, sans-serif',
  'Helvetica, Arial, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Verdana, sans-serif',
  'Trebuchet MS, sans-serif',
  'Impact, sans-serif',
  'Palatino, serif',
  'Courier New, monospace',
  'Comic Sans MS, cursive'
];

const fontSizes = ['10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px', '36px', '48px', '64px'];
const fontWeights = ['300', '400', '500', '600', '700', '800', '900'];

export function StripoPropertiesPanel({
  selectedComponent,
  template,
  onComponentUpdate,
  onGlobalStylesUpdate,
  customFontsEnabled = true,
  ampSupport = true,
  globalStyles
}: StripoPropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'settings' | 'global'>('content');
  const [showMobileStyles, setShowMobileStyles] = useState(false);

  if (!selectedComponent && activeTab !== 'global') {
    return (
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
          <p className="text-sm text-gray-500 mt-1">Select a component to edit properties</p>
        </div>
        
        <div className="p-8 text-center text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-sm mb-4">Click on any component in the email to start editing its properties</p>
          
          <Button
            variant="outline"
            onClick={() => setActiveTab('global')}
            className="w-full"
          >
            <Palette className="w-4 h-4 mr-2" />
            Edit Global Styles
          </Button>
        </div>
      </div>
    );
  }

  const updateComponentStyles = (styleUpdates: Partial<StripoComponentStyles>) => {
    if (selectedComponent) {
      onComponentUpdate(selectedComponent.id, {
        styles: { ...selectedComponent.styles, ...styleUpdates }
      });
    }
  };

  const updateComponentContent = (contentUpdates: any) => {
    if (selectedComponent) {
      onComponentUpdate(selectedComponent.id, {
        content: { ...selectedComponent.content, ...contentUpdates }
      });
    }
  };

  const updateComponentSettings = (settingsUpdates: any) => {
    if (selectedComponent) {
      onComponentUpdate(selectedComponent.id, {
        settings: { ...selectedComponent.settings, ...settingsUpdates }
      });
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
        {selectedComponent && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs capitalize">
              {selectedComponent.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {selectedComponent.id.slice(0, 8)}
            </Badge>
          </div>
        )}
      </div>

      {/* Property Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1">
        <TabsList className="grid grid-cols-4 mx-4 mt-4">
          <TabsTrigger value="content" className="text-xs" disabled={!selectedComponent}>Content</TabsTrigger>
          <TabsTrigger value="design" className="text-xs" disabled={!selectedComponent}>Design</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs" disabled={!selectedComponent}>Settings</TabsTrigger>
          <TabsTrigger value="global" className="text-xs">Global</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="p-4 space-y-4">
          {selectedComponent && (
            <>
              {/* Component Name */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Component Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="componentName" className="text-sm font-medium">Name</Label>
                    <Input
                      id="componentName"
                      value={selectedComponent.name || ''}
                      onChange={(e) => onComponentUpdate(selectedComponent.id, { name: e.target.value })}
                      className="mt-2"
                      placeholder="Component name"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Text Content */}
              {(selectedComponent.type === 'text' || selectedComponent.type === 'footer') && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Type className="w-4 h-4 mr-2" />
                      Text Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="content" className="text-sm font-medium">Content</Label>
                      <Textarea
                        id="content"
                        rows={6}
                        value={selectedComponent.content?.text || ''}
                        onChange={(e) => updateComponentContent({ text: e.target.value })}
                        className="mt-2 font-mono text-sm"
                        placeholder="Your content here... Use {{variables}} for personalization"
                      />
                    </div>
                    
                    {/* Merge Tags for Text */}
                    <div>
                      <Label className="text-sm font-medium">Merge Tags</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {[
                          { label: 'First Name', tag: '{{first_name}}' },
                          { label: 'Last Name', tag: '{{last_name}}' },
                          { label: 'Email', tag: '{{email}}' },
                          { label: 'Company', tag: '{{company}}' },
                          { label: 'Custom', tag: '{{custom_field}}' },
                          { label: 'Date', tag: '{{date}}' }
                        ].map((item) => (
                          <Button
                            key={item.tag}
                            variant="outline"
                            size="sm"
                            className="text-xs justify-start"
                            onClick={() => {
                              const currentText = selectedComponent.content?.text || '';
                              updateComponentContent({ text: currentText + item.tag });
                            }}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Click to add merge tags to your content. These will be replaced with actual values when the email is sent.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Heading Content */}
              {selectedComponent.type === 'heading' && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Heading Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                      <Input
                        id="title"
                        value={selectedComponent.content?.title || selectedComponent.content?.text || ''}
                        onChange={(e) => updateComponentContent({ title: e.target.value, text: e.target.value })}
                        className="mt-2"
                        placeholder="Heading text"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subtitle" className="text-sm font-medium">Subtitle (Optional)</Label>
                      <Input
                        id="subtitle"
                        value={selectedComponent.content?.subtitle || ''}
                        onChange={(e) => updateComponentContent({ subtitle: e.target.value })}
                        className="mt-2"
                        placeholder="Subtitle text"
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
                        value={selectedComponent.content?.src || ''}
                        onChange={(e) => updateComponentContent({ src: e.target.value })}
                        className="mt-2"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="alt" className="text-sm font-medium">Alt Text</Label>
                      <Input
                        id="alt"
                        value={selectedComponent.content?.alt || ''}
                        onChange={(e) => updateComponentContent({ alt: e.target.value })}
                        className="mt-2"
                        placeholder="Describe the image"
                      />
                    </div>
                    <div>
                      <Label htmlFor="href" className="text-sm font-medium">Link URL (Optional)</Label>
                      <Input
                        id="href"
                        type="url"
                        value={selectedComponent.content?.href || ''}
                        onChange={(e) => updateComponentContent({ href: e.target.value })}
                        className="mt-2"
                        placeholder="https://example.com"
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
                        value={selectedComponent.content?.text || ''}
                        onChange={(e) => updateComponentContent({ text: e.target.value })}
                        className="mt-2"
                        placeholder="Click Here"
                      />
                    </div>
                    <div>
                      <Label htmlFor="href" className="text-sm font-medium">Link URL</Label>
                      <Input
                        id="href"
                        type="url"
                        value={selectedComponent.content?.href || ''}
                        onChange={(e) => updateComponentContent({ href: e.target.value })}
                        className="mt-2"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="target" className="text-sm font-medium">Link Target</Label>
                      <Select 
                        value={selectedComponent.content?.target || '_blank'} 
                        onValueChange={(value) => updateComponentContent({ target: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_blank">New Window</SelectItem>
                          <SelectItem value="_self">Same Window</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Social Content */}
              {selectedComponent.type === 'social' && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Social Media Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((platform) => (
                      <div key={platform}>
                        <Label className="text-sm font-medium capitalize">{platform} URL</Label>
                        <Input
                          type="url"
                          value={selectedComponent.content?.[platform] || ''}
                          onChange={(e) => updateComponentContent({ [platform]: e.target.value })}
                          className="mt-2"
                          placeholder={`https://${platform}.com/yourprofile`}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Spacer Content */}
              {selectedComponent.type === 'spacer' && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Spacer Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="height" className="text-sm font-medium">Height</Label>
                      <Input
                        id="height"
                        type="number"
                        value={selectedComponent.content?.height || '20'}
                        onChange={(e) => updateComponentContent({ height: e.target.value })}
                        className="mt-2"
                        placeholder="20"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Video Content */}
              {selectedComponent.type === 'video' && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Video Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="videoUrl" className="text-sm font-medium">Video URL</Label>
                      <Input
                        id="videoUrl"
                        type="url"
                        value={selectedComponent.content?.src || ''}
                        onChange={(e) => updateComponentContent({ src: e.target.value })}
                        className="mt-2"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="poster" className="text-sm font-medium">Poster Image</Label>
                      <Input
                        id="poster"
                        type="url"
                        value={selectedComponent.content?.poster || ''}
                        onChange={(e) => updateComponentContent({ poster: e.target.value })}
                        className="mt-2"
                        placeholder="https://example.com/poster.jpg"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Autoplay</Label>
                      <input
                        type="checkbox"
                        checked={selectedComponent.content?.autoplay || false}
                        onChange={(e) => updateComponentContent({ autoplay: e.target.checked })}
                        className="rounded"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Timer/Countdown Content */}
              {selectedComponent.type === 'timer' && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Countdown Timer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="endDate" className="text-sm font-medium">End Date & Time</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={selectedComponent.content?.endDate || ''}
                        onChange={(e) => updateComponentContent({ endDate: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiredText" className="text-sm font-medium">Expired Message</Label>
                      <Input
                        id="expiredText"
                        value={selectedComponent.content?.expiredText || 'Offer has expired'}
                        onChange={(e) => updateComponentContent({ expiredText: e.target.value })}
                        className="mt-2"
                        placeholder="Offer has expired"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Columns Layout Content */}
              {selectedComponent.type === 'columns' && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Column Layout</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="columnCount" className="text-sm font-medium">Number of Columns</Label>
                      <Select 
                        value={selectedComponent.content?.columns?.toString() || '2'} 
                        onValueChange={(value) => updateComponentContent({ columns: parseInt(value) })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Column</SelectItem>
                          <SelectItem value="2">2 Columns</SelectItem>
                          <SelectItem value="3">3 Columns</SelectItem>
                          <SelectItem value="4">4 Columns</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="gap" className="text-sm font-medium">Column Gap</Label>
                      <Input
                        id="gap"
                        value={selectedComponent.content?.gap || '16px'}
                        onChange={(e) => updateComponentContent({ gap: e.target.value })}
                        className="mt-2"
                        placeholder="16px"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* Design Tab */}
        <TabsContent value="design" className="p-4 space-y-4">
          {selectedComponent && (
            <>
              {/* Responsive Design Toggle */}
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Design Mode</Label>
                <div className="flex bg-gray-100 rounded-md p-1">
                  <Button
                    variant={!showMobileStyles ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setShowMobileStyles(false)}
                    className="px-2 py-1"
                  >
                    <Monitor className="w-3 h-3 mr-1" />
                    Desktop
                  </Button>
                  <Button
                    variant={showMobileStyles ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setShowMobileStyles(true)}
                    className="px-2 py-1"
                  >
                    <Smartphone className="w-3 h-3 mr-1" />
                    Mobile
                  </Button>
                </div>
              </div>

              {/* Typography */}
              {(selectedComponent.type === 'text' || selectedComponent.type === 'heading' || selectedComponent.type === 'button' || selectedComponent.type === 'footer') && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Type className="w-4 h-4 mr-2" />
                      Typography
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium">Font Size</Label>
                        <Select 
                          value={selectedComponent.styles.fontSize || '16px'} 
                          onValueChange={(value) => updateComponentStyles({ fontSize: value })}
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
                          onValueChange={(value) => updateComponentStyles({ fontWeight: value })}
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
                                 weight === '800' ? 'Extra Bold' : 
                                 weight === '900' ? 'Black' : weight}
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
                        onValueChange={(value) => updateComponentStyles({ fontFamily: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontFamilies.map(family => (
                            <SelectItem key={family} value={family}>
                              {family.split(',')[0]}
                            </SelectItem>
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
                          onClick={() => updateComponentStyles({ textAlign: 'left' })}
                        >
                          <AlignLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={selectedComponent.styles.textAlign === 'center' ? 'default' : 'ghost'}
                          size="sm"
                          className="flex-1 rounded-none"
                          onClick={() => updateComponentStyles({ textAlign: 'center' })}
                        >
                          <AlignCenter className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={selectedComponent.styles.textAlign === 'right' ? 'default' : 'ghost'}
                          size="sm"
                          className="flex-1 rounded-none"
                          onClick={() => updateComponentStyles({ textAlign: 'right' })}
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
                <CardContent className="space-y-4">
                  {(selectedComponent.type === 'text' || selectedComponent.type === 'heading' || selectedComponent.type === 'button' || selectedComponent.type === 'footer') && (
                    <div>
                      <Label className="text-sm font-medium">Text Color</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <input
                          type="color"
                          value={selectedComponent.styles.color || '#333333'}
                          onChange={(e) => updateComponentStyles({ color: e.target.value })}
                          className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={selectedComponent.styles.color || '#333333'}
                          onChange={(e) => updateComponentStyles({ color: e.target.value })}
                          className="flex-1"
                          placeholder="#333333"
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
                        onChange={(e) => updateComponentStyles({ backgroundColor: e.target.value })}
                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={selectedComponent.styles.backgroundColor || '#ffffff'}
                        onChange={(e) => updateComponentStyles({ backgroundColor: e.target.value })}
                        className="flex-1"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Spacing & Layout */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Layout className="w-4 h-4 mr-2" />
                    Spacing & Layout
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-medium">Padding</Label>
                      <Input
                        type="text"
                        value={selectedComponent.styles.padding || '16px'}
                        onChange={(e) => updateComponentStyles({ padding: e.target.value })}
                        className="mt-2"
                        placeholder="16px"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Margin</Label>
                      <Input
                        type="text"
                        value={selectedComponent.styles.margin || '8px 0'}
                        onChange={(e) => updateComponentStyles({ margin: e.target.value })}
                        className="mt-2"
                        placeholder="8px 0"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-medium">Border Radius</Label>
                      <Input
                        type="text"
                        value={selectedComponent.styles.borderRadius || '0px'}
                        onChange={(e) => updateComponentStyles({ borderRadius: e.target.value })}
                        className="mt-2"
                        placeholder="0px"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Border</Label>
                      <Input
                        type="text"
                        value={selectedComponent.styles.border || 'none'}
                        onChange={(e) => updateComponentStyles({ border: e.target.value })}
                        className="mt-2"
                        placeholder="1px solid #ccc"
                      />
                    </div>
                  </div>

                  {selectedComponent.type === 'image' && (
                    <div>
                      <Label className="text-sm font-medium">Width</Label>
                      <Input
                        type="text"
                        value={selectedComponent.styles.width || '100%'}
                        onChange={(e) => updateComponentStyles({ width: e.target.value })}
                        className="mt-2"
                        placeholder="100%"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="p-4 space-y-4">
          {selectedComponent && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Component Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Visible</Label>
                      <input
                        type="checkbox"
                        checked={selectedComponent.settings?.visible !== false}
                        onChange={(e) => updateComponentSettings({ visible: e.target.checked })}
                        className="rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Hide on Mobile</Label>
                      <input
                        type="checkbox"
                        checked={selectedComponent.settings?.hiddenOnMobile || false}
                        onChange={(e) => updateComponentSettings({ hiddenOnMobile: e.target.checked })}
                        className="rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Hide on Desktop</Label>
                      <input
                        type="checkbox"
                        checked={selectedComponent.settings?.hiddenOnDesktop || false}
                        onChange={(e) => updateComponentSettings({ hiddenOnDesktop: e.target.checked })}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Lock Component</Label>
                      <input
                        type="checkbox"
                        checked={selectedComponent.locked || false}
                        onChange={(e) => onComponentUpdate(selectedComponent.id, { locked: e.target.checked })}
                        className="rounded"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {ampSupport && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-green-600" />
                      AMP Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">AMP Compatible</Label>
                      <input
                        type="checkbox"
                        checked={selectedComponent.settings?.ampValidation !== false}
                        onChange={(e) => updateComponentSettings({ ampValidation: e.target.checked })}
                        className="rounded"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">AMP Attributes</Label>
                      <Textarea
                        rows={3}
                        placeholder='{"layout": "responsive", "width": 300, "height": 200}'
                        className="mt-2 font-mono text-xs"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* Global Styles Tab */}
        <TabsContent value="global" className="p-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Global Email Styles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Max Width</Label>
                <Input
                  value={globalStyles.container.maxWidth}
                  onChange={(e) => onGlobalStylesUpdate({
                    container: { ...globalStyles.container, maxWidth: e.target.value }
                  })}
                  className="mt-2"
                  placeholder="600px"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Background Color</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="color"
                    value={globalStyles.colors.background}
                    onChange={(e) => onGlobalStylesUpdate({
                      colors: { ...globalStyles.colors, background: e.target.value }
                    })}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    value={globalStyles.colors.background}
                    onChange={(e) => onGlobalStylesUpdate({
                      colors: { ...globalStyles.colors, background: e.target.value }
                    })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Primary Color</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="color"
                    value={globalStyles.colors.primary}
                    onChange={(e) => onGlobalStylesUpdate({
                      colors: { ...globalStyles.colors, primary: e.target.value }
                    })}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    value={globalStyles.colors.primary}
                    onChange={(e) => onGlobalStylesUpdate({
                      colors: { ...globalStyles.colors, primary: e.target.value }
                    })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Default Font Family</Label>
                <Select 
                  value={globalStyles.typography.bodyFont} 
                  onValueChange={(value) => onGlobalStylesUpdate({
                    typography: { ...globalStyles.typography, bodyFont: value }
                  })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map(family => (
                      <SelectItem key={family} value={family}>
                        {family.split(',')[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}