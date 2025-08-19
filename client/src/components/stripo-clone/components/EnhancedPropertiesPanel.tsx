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
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
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
  Zap,
  Image,
  Video,
  Timer,
  ShoppingCart,
  Star,
  MessageSquare,
  Gamepad2,
  Globe,
  Link,
  Eye,
  EyeOff
} from 'lucide-react';
import { StripoComponent, StripoEmailTemplate, StripoGlobalStyles, StripoComponentStyles } from '../types/stripo.types';

interface EnhancedPropertiesPanelProps {
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

export function EnhancedPropertiesPanel({
  selectedComponent,
  template,
  onComponentUpdate,
  onGlobalStylesUpdate,
  customFontsEnabled = true,
  ampSupport = true,
  globalStyles
}: EnhancedPropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'settings' | 'global'>('content');
  const [showMobileStyles, setShowMobileStyles] = useState(false);

  if (!selectedComponent && activeTab !== 'global') {
    return (
      <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Properties</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select a component to edit properties</p>
        </div>
        
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <p className="text-sm mb-4">Click on any component in the email to start editing its properties</p>
          
          <Button
            variant="outline"
            onClick={() => setActiveTab('global')}
            className="w-full"
            data-testid="button-global-styles"
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

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'text': case 'heading': case 'footer': return <Type className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'button': return <Link className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'timer': case 'countdown': return <Timer className="w-4 h-4" />;
      case 'product': return <ShoppingCart className="w-4 h-4" />;
      case 'testimonial': return <MessageSquare className="w-4 h-4" />;
      case 'game': return <Gamepad2 className="w-4 h-4" />;
      case 'social': return <Globe className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const renderContentProperties = () => {
    if (!selectedComponent) return null;

    const componentType = selectedComponent.type;

    return (
      <div className="space-y-4">
        {/* Component Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              {getComponentIcon(componentType)}
              <span className="ml-2 capitalize">{componentType} Properties</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="componentName" className="text-sm font-medium">Component Name</Label>
              <Input
                id="componentName"
                value={selectedComponent.name || ''}
                onChange={(e) => onComponentUpdate(selectedComponent.id, { name: e.target.value })}
                className="mt-2"
                placeholder={`${componentType} component`}
                data-testid="input-component-name"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="componentVisible"
                checked={!selectedComponent.hidden}
                onCheckedChange={(checked) => onComponentUpdate(selectedComponent.id, { hidden: !checked })}
                data-testid="switch-component-visible"
              />
              <Label htmlFor="componentVisible" className="text-sm">Visible</Label>
              {selectedComponent.hidden ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-green-500" />}
            </div>
          </CardContent>
        </Card>

        {/* Text Components */}
        {(componentType === 'text' || componentType === 'footer') && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Type className="w-4 h-4 mr-2" />
                Text Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="textContent" className="text-sm font-medium">Content</Label>
                <Textarea
                  id="textContent"
                  rows={6}
                  value={selectedComponent.content?.text || ''}
                  onChange={(e) => updateComponentContent({ text: e.target.value })}
                  className="mt-2 font-mono text-sm"
                  placeholder="Enter your text content... Use {{variables}} for personalization"
                  data-testid="textarea-text-content"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Quick Insert</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'First Name', tag: '{{firstName}}' },
                    { label: 'Email', tag: '{{email}}' },
                    { label: 'Company', tag: '{{company}}' },
                    { label: 'Date', tag: '{{date}}' }
                  ].map((item) => (
                    <Button
                      key={item.tag}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        const currentText = selectedComponent.content?.text || '';
                        updateComponentContent({ text: currentText + ' ' + item.tag });
                      }}
                      data-testid={`button-insert-${item.label.toLowerCase().replace(' ', '-')}`}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Heading Components */}
        {componentType === 'heading' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Heading Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="headingTitle" className="text-sm font-medium">Title</Label>
                <Input
                  id="headingTitle"
                  value={selectedComponent.content?.title || selectedComponent.content?.text || ''}
                  onChange={(e) => updateComponentContent({ title: e.target.value, text: e.target.value })}
                  className="mt-2"
                  placeholder="Main heading text"
                  data-testid="input-heading-title"
                />
              </div>
              <div>
                <Label htmlFor="headingSubtitle" className="text-sm font-medium">Subtitle</Label>
                <Input
                  id="headingSubtitle"
                  value={selectedComponent.content?.subtitle || ''}
                  onChange={(e) => updateComponentContent({ subtitle: e.target.value })}
                  className="mt-2"
                  placeholder="Optional subtitle"
                  data-testid="input-heading-subtitle"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Components */}
        {componentType === 'image' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Image className="w-4 h-4 mr-2" />
                Image Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="imageSrc" className="text-sm font-medium">Image URL</Label>
                <Input
                  id="imageSrc"
                  type="url"
                  value={selectedComponent.content?.src || ''}
                  onChange={(e) => updateComponentContent({ src: e.target.value })}
                  className="mt-2"
                  placeholder="https://example.com/image.jpg"
                  data-testid="input-image-src"
                />
              </div>
              <div>
                <Label htmlFor="imageAlt" className="text-sm font-medium">Alt Text</Label>
                <Input
                  id="imageAlt"
                  value={selectedComponent.content?.alt || ''}
                  onChange={(e) => updateComponentContent({ alt: e.target.value })}
                  className="mt-2"
                  placeholder="Describe the image for accessibility"
                  data-testid="input-image-alt"
                />
              </div>
              <div>
                <Label htmlFor="imageHref" className="text-sm font-medium">Link URL (Optional)</Label>
                <Input
                  id="imageHref"
                  type="url"
                  value={selectedComponent.content?.href || ''}
                  onChange={(e) => updateComponentContent({ href: e.target.value })}
                  className="mt-2"
                  placeholder="https://example.com"
                  data-testid="input-image-href"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Button Components */}
        {componentType === 'button' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Link className="w-4 h-4 mr-2" />
                Button Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="buttonText" className="text-sm font-medium">Button Text</Label>
                <Input
                  id="buttonText"
                  value={selectedComponent.content?.text || ''}
                  onChange={(e) => updateComponentContent({ text: e.target.value })}
                  className="mt-2"
                  placeholder="Call to action text"
                  data-testid="input-button-text"
                />
              </div>
              <div>
                <Label htmlFor="buttonHref" className="text-sm font-medium">Link URL</Label>
                <Input
                  id="buttonHref"
                  type="url"
                  value={selectedComponent.content?.href || ''}
                  onChange={(e) => updateComponentContent({ href: e.target.value })}
                  className="mt-2"
                  placeholder="https://example.com/action"
                  data-testid="input-button-href"
                />
              </div>
              <div>
                <Label htmlFor="buttonTarget" className="text-sm font-medium">Link Target</Label>
                <Select 
                  value={selectedComponent.content?.target || '_blank'} 
                  onValueChange={(value) => updateComponentContent({ target: value })}
                >
                  <SelectTrigger className="mt-2" data-testid="select-button-target">
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_blank">New Tab (_blank)</SelectItem>
                    <SelectItem value="_self">Same Tab (_self)</SelectItem>
                    <SelectItem value="_parent">Parent (_parent)</SelectItem>
                    <SelectItem value="_top">Top Window (_top)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Video Components */}
        {componentType === 'video' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Video className="w-4 h-4 mr-2" />
                Video Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="videoSrc" className="text-sm font-medium">Video URL</Label>
                <Input
                  id="videoSrc"
                  type="url"
                  value={selectedComponent.content?.src || ''}
                  onChange={(e) => updateComponentContent({ src: e.target.value })}
                  className="mt-2"
                  placeholder="https://example.com/video.mp4"
                  data-testid="input-video-src"
                />
              </div>
              <div>
                <Label htmlFor="videoPoster" className="text-sm font-medium">Poster Image</Label>
                <Input
                  id="videoPoster"
                  type="url"
                  value={selectedComponent.content?.poster || ''}
                  onChange={(e) => updateComponentContent({ poster: e.target.value })}
                  className="mt-2"
                  placeholder="https://example.com/poster.jpg"
                  data-testid="input-video-poster"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="videoAutoplay"
                  checked={selectedComponent.content?.autoplay || false}
                  onCheckedChange={(checked) => updateComponentContent({ autoplay: checked })}
                  data-testid="switch-video-autoplay"
                />
                <Label htmlFor="videoAutoplay" className="text-sm">Autoplay</Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timer/Countdown Components */}
        {(componentType === 'timer' || componentType === 'countdown') && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Timer className="w-4 h-4 mr-2" />
                Timer Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="timerTitle" className="text-sm font-medium">Title</Label>
                <Input
                  id="timerTitle"
                  value={selectedComponent.content?.title || ''}
                  onChange={(e) => updateComponentContent({ title: e.target.value })}
                  className="mt-2"
                  placeholder="Limited Time Offer"
                  data-testid="input-timer-title"
                />
              </div>
              <div>
                <Label htmlFor="timerEndDate" className="text-sm font-medium">End Date</Label>
                <Input
                  id="timerEndDate"
                  type="datetime-local"
                  value={selectedComponent.content?.endDate || ''}
                  onChange={(e) => updateComponentContent({ endDate: e.target.value })}
                  className="mt-2"
                  data-testid="input-timer-end-date"
                />
              </div>
              <div>
                <Label htmlFor="timerExpiredText" className="text-sm font-medium">Expired Text</Label>
                <Input
                  id="timerExpiredText"
                  value={selectedComponent.content?.expiredText || ''}
                  onChange={(e) => updateComponentContent({ expiredText: e.target.value })}
                  className="mt-2"
                  placeholder="Offer has expired"
                  data-testid="input-timer-expired-text"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Social Components */}
        {componentType === 'social' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Social Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(selectedComponent.content?.items || []).map((item: any, index: number) => (
                <div key={item.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="capitalize">{item.type}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newItems = (selectedComponent.content?.items || []).filter((_, i) => i !== index);
                        updateComponentContent({ items: newItems });
                      }}
                      data-testid={`button-remove-social-${index}`}
                    >
                      Remove
                    </Button>
                  </div>
                  <Input
                    value={item.content}
                    onChange={(e) => {
                      const newItems = [...(selectedComponent.content?.items || [])];
                      newItems[index] = { ...item, content: e.target.value };
                      updateComponentContent({ items: newItems });
                    }}
                    placeholder={`${item.type} URL`}
                    data-testid={`input-social-${index}`}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newItem = {
                    id: `social-${Date.now()}`,
                    type: 'facebook',
                    content: 'https://facebook.com/yourpage'
                  };
                  const newItems = [...(selectedComponent.content?.items || []), newItem];
                  updateComponentContent({ items: newItems });
                }}
                className="w-full"
                data-testid="button-add-social"
              >
                Add Social Link
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderDesignProperties = () => {
    if (!selectedComponent) return null;

    return (
      <div className="space-y-4">
        {/* Typography */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Font Family</Label>
              <Select 
                value={selectedComponent.styles?.fontFamily || fontFamilies[0]} 
                onValueChange={(value) => updateComponentStyles({ fontFamily: value })}
              >
                <SelectTrigger className="mt-2" data-testid="select-font-family">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font} value={font}>{font.split(',')[0]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm font-medium">Size</Label>
                <Select 
                  value={selectedComponent.styles?.fontSize || '16px'} 
                  onValueChange={(value) => updateComponentStyles({ fontSize: value })}
                >
                  <SelectTrigger className="mt-2" data-testid="select-font-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Weight</Label>
                <Select 
                  value={selectedComponent.styles?.fontWeight || '400'} 
                  onValueChange={(value) => updateComponentStyles({ fontWeight: value })}
                >
                  <SelectTrigger className="mt-2" data-testid="select-font-weight">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeights.map((weight) => (
                      <SelectItem key={weight} value={weight}>{weight}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Text Color</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Input
                  type="color"
                  value={selectedComponent.styles?.color || '#000000'}
                  onChange={(e) => updateComponentStyles({ color: e.target.value })}
                  className="w-12 h-10 p-1"
                  data-testid="input-text-color"
                />
                <Input
                  value={selectedComponent.styles?.color || '#000000'}
                  onChange={(e) => updateComponentStyles({ color: e.target.value })}
                  placeholder="#000000"
                  className="flex-1"
                  data-testid="input-text-color-hex"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Text Alignment</Label>
              <div className="flex space-x-2">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight }
                ].map(({ value, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={selectedComponent.styles?.textAlign === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateComponentStyles({ textAlign: value as any })}
                    data-testid={`button-align-${value}`}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colors & Background */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Colors & Background</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Background Color</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Input
                  type="color"
                  value={selectedComponent.styles?.backgroundColor || '#ffffff'}
                  onChange={(e) => updateComponentStyles({ backgroundColor: e.target.value })}
                  className="w-12 h-10 p-1"
                  data-testid="input-bg-color"
                />
                <Input
                  value={selectedComponent.styles?.backgroundColor || '#ffffff'}
                  onChange={(e) => updateComponentStyles({ backgroundColor: e.target.value })}
                  placeholder="#ffffff"
                  className="flex-1"
                  data-testid="input-bg-color-hex"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Background Image</Label>
              <Input
                type="url"
                value={selectedComponent.styles?.backgroundImage || ''}
                onChange={(e) => updateComponentStyles({ backgroundImage: e.target.value ? `url(${e.target.value})` : '' })}
                className="mt-2"
                placeholder="https://example.com/image.jpg"
                data-testid="input-bg-image"
              />
            </div>
          </CardContent>
        </Card>

        {/* Spacing & Layout */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Spacing & Layout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Padding</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Top</Label>
                  <Input
                    value={selectedComponent.styles?.paddingTop || ''}
                    onChange={(e) => updateComponentStyles({ paddingTop: e.target.value })}
                    placeholder="0px"
                    className="text-xs"
                    data-testid="input-padding-top"
                  />
                </div>
                <div>
                  <Label className="text-xs">Right</Label>
                  <Input
                    value={selectedComponent.styles?.paddingRight || ''}
                    onChange={(e) => updateComponentStyles({ paddingRight: e.target.value })}
                    placeholder="0px"
                    className="text-xs"
                    data-testid="input-padding-right"
                  />
                </div>
                <div>
                  <Label className="text-xs">Bottom</Label>
                  <Input
                    value={selectedComponent.styles?.paddingBottom || ''}
                    onChange={(e) => updateComponentStyles({ paddingBottom: e.target.value })}
                    placeholder="0px"
                    className="text-xs"
                    data-testid="input-padding-bottom"
                  />
                </div>
                <div>
                  <Label className="text-xs">Left</Label>
                  <Input
                    value={selectedComponent.styles?.paddingLeft || ''}
                    onChange={(e) => updateComponentStyles({ paddingLeft: e.target.value })}
                    placeholder="0px"
                    className="text-xs"
                    data-testid="input-padding-left"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Margin</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Top</Label>
                  <Input
                    value={selectedComponent.styles?.marginTop || ''}
                    onChange={(e) => updateComponentStyles({ marginTop: e.target.value })}
                    placeholder="0px"
                    className="text-xs"
                    data-testid="input-margin-top"
                  />
                </div>
                <div>
                  <Label className="text-xs">Right</Label>
                  <Input
                    value={selectedComponent.styles?.marginRight || ''}
                    onChange={(e) => updateComponentStyles({ marginRight: e.target.value })}
                    placeholder="0px"
                    className="text-xs"
                    data-testid="input-margin-right"
                  />
                </div>
                <div>
                  <Label className="text-xs">Bottom</Label>
                  <Input
                    value={selectedComponent.styles?.marginBottom || ''}
                    onChange={(e) => updateComponentStyles({ marginBottom: e.target.value })}
                    placeholder="0px"
                    className="text-xs"
                    data-testid="input-margin-bottom"
                  />
                </div>
                <div>
                  <Label className="text-xs">Left</Label>
                  <Input
                    value={selectedComponent.styles?.marginLeft || ''}
                    onChange={(e) => updateComponentStyles({ marginLeft: e.target.value })}
                    placeholder="0px"
                    className="text-xs"
                    data-testid="input-margin-left"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Border Radius</Label>
              <Input
                value={selectedComponent.styles?.borderRadius || ''}
                onChange={(e) => updateComponentStyles({ borderRadius: e.target.value })}
                className="mt-2"
                placeholder="0px"
                data-testid="input-border-radius"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSettingsProperties = () => {
    if (!selectedComponent) return null;

    return (
      <div className="space-y-4">
        {/* Visibility Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Visibility Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Desktop</Label>
              <Switch
                checked={!selectedComponent.settings?.hiddenOnDesktop}
                onCheckedChange={(checked) => updateComponentSettings({ hiddenOnDesktop: !checked })}
                data-testid="switch-desktop-visible"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Tablet</Label>
              <Switch
                checked={selectedComponent.settings?.tabletVisible !== false}
                onCheckedChange={(checked) => updateComponentSettings({ tabletVisible: checked })}
                data-testid="switch-tablet-visible"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Mobile</Label>
              <Switch
                checked={!selectedComponent.settings?.hiddenOnMobile}
                onCheckedChange={(checked) => updateComponentSettings({ hiddenOnMobile: !checked })}
                data-testid="switch-mobile-visible"
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Lock Component</Label>
              <Switch
                checked={selectedComponent.locked || false}
                onCheckedChange={(checked) => onComponentUpdate(selectedComponent.id, { locked: checked })}
                data-testid="switch-component-locked"
              />
            </div>

            {ampSupport && (
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">AMP Compatible</Label>
                <Switch
                  checked={selectedComponent.settings?.ampValidation !== false}
                  onCheckedChange={(checked) => updateComponentSettings({ ampValidation: checked })}
                  data-testid="switch-amp-compatible"
                />
              </div>
            )}

            <div>
              <Label className="text-sm font-medium">Component Order</Label>
              <Input
                type="number"
                value={selectedComponent.order || 0}
                onChange={(e) => onComponentUpdate(selectedComponent.id, { order: parseInt(e.target.value) || 0 })}
                className="mt-2"
                data-testid="input-component-order"
              />
            </div>
          </CardContent>
        </Card>

        {/* Component Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                // Duplicate component logic would go here
                console.log('Duplicating component:', selectedComponent.id);
              }}
              data-testid="button-duplicate-component"
            >
              Duplicate Component
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                // Delete component logic would go here
                console.log('Deleting component:', selectedComponent.id);
              }}
              data-testid="button-delete-component"
            >
              Delete Component
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Properties</h3>
        {selectedComponent && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs capitalize flex items-center">
              {getComponentIcon(selectedComponent.type)}
              <span className="ml-1">{selectedComponent.type}</span>
            </Badge>
            <Badge variant="outline" className="text-xs">
              ID: {selectedComponent.id.slice(0, 8)}...
            </Badge>
            {selectedComponent.hidden && (
              <Badge variant="destructive" className="text-xs">Hidden</Badge>
            )}
          </div>
        )}
      </div>

      {/* Property Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1">
        <TabsList className="grid grid-cols-4 mx-4 mt-4 sticky top-[120px] bg-white dark:bg-gray-900 z-10">
          <TabsTrigger value="content" className="text-xs" disabled={!selectedComponent}>Content</TabsTrigger>
          <TabsTrigger value="design" className="text-xs" disabled={!selectedComponent}>Design</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs" disabled={!selectedComponent}>Settings</TabsTrigger>
          <TabsTrigger value="global" className="text-xs">Global</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="p-4">
          {renderContentProperties()}
        </TabsContent>

        {/* Design Tab */}
        <TabsContent value="design" className="p-4">
          {renderDesignProperties()}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="p-4">
          {renderSettingsProperties()}
        </TabsContent>

        {/* Global Tab */}
        <TabsContent value="global" className="p-4">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Global Email Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Email Width</Label>
                  <Input
                    type="number"
                    value={template?.settings?.width || 600}
                    onChange={(e) => {
                      // Update global settings logic
                    }}
                    className="mt-2"
                    data-testid="input-email-width"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Background Color</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      type="color"
                      value={globalStyles?.colors?.background || '#ffffff'}
                      onChange={(e) => onGlobalStylesUpdate({
                        colors: { ...globalStyles?.colors, background: e.target.value }
                      })}
                      className="w-12 h-10 p-1"
                      data-testid="input-global-bg-color"
                    />
                    <Input
                      value={globalStyles?.colors?.background || '#ffffff'}
                      onChange={(e) => onGlobalStylesUpdate({
                        colors: { ...globalStyles?.colors, background: e.target.value }
                      })}
                      placeholder="#ffffff"
                      className="flex-1"
                      data-testid="input-global-bg-color-hex"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}