import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Type,
  Image,
  MousePointer,
  Heading,
  Minus,
  GripHorizontal,
  Columns,
  AlignLeft,
  Plus,
  Video,
  Code,
  Timer,
  Share2,
  Grid3X3,
  Mail,
  User,
  Star,
  Gift,
  Calendar,
  ShoppingCart,
  Zap,
  Play,
  FileText,
  Palette,
  Search,
  Filter
} from 'lucide-react';
import { StripoComponentType } from '../types/stripo.types';

interface StripoSidebarProps {
  onAddComponent: (type: StripoComponentType) => void;
  selectedComponentType?: StripoComponentType;
  gameGeneratorEnabled?: boolean;
  customFontsEnabled?: boolean;
  ampSupport?: boolean;
}

const basicComponents = [
  { type: 'text' as const, label: 'Text', icon: Type, description: 'Add text content with merge tags' },
  { type: 'heading' as const, label: 'Heading', icon: Heading, description: 'Page titles and headings' },
  { type: 'image' as const, label: 'Image', icon: Image, description: 'Add responsive images' },
  { type: 'button' as const, label: 'Button', icon: MousePointer, description: 'Call-to-action buttons' },
  { type: 'divider' as const, label: 'Divider', icon: Minus, description: 'Horizontal separator lines' },
  { type: 'spacer' as const, label: 'Spacer', icon: GripHorizontal, description: 'Add vertical spacing' }
];

const layoutComponents = [
  { type: 'container' as const, label: 'Container', icon: Grid3X3, description: 'Content wrapper' },
  { type: 'row' as const, label: 'Row', icon: Columns, description: 'Horizontal layout' },
  { type: 'column' as const, label: 'Column', icon: AlignLeft, description: 'Vertical content area' }
];

const mediaComponents = [
  { type: 'video' as const, label: 'Video', icon: Video, description: 'Embed videos and GIFs' },
  { type: 'social' as const, label: 'Social', icon: Share2, description: 'Social media links' },
  { type: 'html' as const, label: 'HTML', icon: Code, description: 'Custom HTML code' }
];

const advancedComponents = [
  { type: 'timer' as const, label: 'Timer', icon: Timer, description: 'Countdown timers' },
  { type: 'product' as const, label: 'Product', icon: ShoppingCart, description: 'Product showcases' },
  { type: 'testimonial' as const, label: 'Testimonial', icon: User, description: 'Customer reviews' },
  { type: 'pricing' as const, label: 'Pricing', icon: Star, description: 'Pricing tables' },
  { type: 'gallery' as const, label: 'Gallery', icon: Grid3X3, description: 'Image galleries' }
];

const ampComponents = [
  { type: 'amp-carousel' as const, label: 'AMP Carousel', icon: Play, description: 'Interactive image carousel' },
  { type: 'amp-accordion' as const, label: 'AMP Accordion', icon: AlignLeft, description: 'Collapsible content' },
  { type: 'amp-form' as const, label: 'AMP Form', icon: FileText, description: 'Interactive forms' },
  { type: 'amp-list' as const, label: 'AMP List', icon: AlignLeft, description: 'Dynamic content lists' }
];

const gameComponents = [
  { type: 'game' as const, label: 'Quiz Game', icon: Play, description: 'Interactive quiz' },
  { type: 'survey' as const, label: 'Survey', icon: FileText, description: 'Customer surveys' },
  { type: 'form' as const, label: 'Contact Form', icon: Mail, description: 'Lead capture forms' }
];

const savedModules = [
  { id: '1', name: 'Company Header', type: 'header', thumbnail: '🏢' },
  { id: '2', name: 'Newsletter Footer', type: 'footer', thumbnail: '📰' },
  { id: '3', name: 'Product Grid', type: 'product', thumbnail: '🛍️' },
  { id: '4', name: 'Social Links', type: 'social', thumbnail: '🔗' }
];

const quickTemplates = [
  { id: 'welcome', name: 'Welcome Email', components: ['header', 'text', 'button', 'footer'] },
  { id: 'newsletter', name: 'Newsletter', components: ['header', 'image', 'text', 'columns', 'footer'] },
  { id: 'promotion', name: 'Promotional', components: ['header', 'timer', 'product', 'button', 'footer'] },
  { id: 'transactional', name: 'Receipt', components: ['header', 'text', 'product', 'text', 'footer'] }
];

export function StripoSidebar({ 
  onAddComponent, 
  selectedComponentType,
  gameGeneratorEnabled = true,
  customFontsEnabled = true,
  ampSupport = true 
}: StripoSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('components');

  const ComponentButton = ({ 
    component, 
    onClick 
  }: { 
    component: { type: StripoComponentType; label: string; icon: any; description: string }; 
    onClick: () => void;
  }) => {
    const Icon = component.icon;
    const isSelected = selectedComponentType === component.type;
    
    return (
      <div
        className={`p-3 border-2 border-dashed rounded-lg cursor-pointer transition-all group ${
          isSelected 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-blue-400 hover:bg-blue-25'
        }`}
        onClick={onClick}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', component.type);
          e.dataTransfer.effectAllowed = 'copy';
        }}
      >
        <div className="flex items-start space-x-3">
          <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
            isSelected 
              ? 'text-blue-600' 
              : 'text-gray-400 group-hover:text-blue-500'
          }`} />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${
              isSelected 
                ? 'text-blue-700' 
                : 'text-gray-900 group-hover:text-blue-700'
            }`}>
              {component.label}
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-tight">
              {component.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const filteredComponents = (components: any[]) => {
    if (!searchQuery.trim()) return components;
    const query = searchQuery.toLowerCase();
    return components.filter(comp => 
      comp.label.toLowerCase().includes(query) ||
      comp.description.toLowerCase().includes(query)
    );
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Components</h2>
          <Button variant="ghost" size="sm" className="p-1">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="components" className="text-xs">Components</TabsTrigger>
            <TabsTrigger value="modules" className="text-xs">Modules</TabsTrigger>
            <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
          </TabsList>

          {/* Components Tab */}
          <TabsContent value="components" className="flex-1 p-4 space-y-4">
            <Accordion type="multiple" defaultValue={["basic", "layout"]} className="space-y-2">
              {/* Basic Components */}
              <AccordionItem value="basic">
                <AccordionTrigger className="text-sm font-medium">
                  Basic Components
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filteredComponents(basicComponents).length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {filteredComponents(basicComponents).map((component) => (
                    <ComponentButton
                      key={component.type}
                      component={component}
                      onClick={() => onAddComponent(component.type)}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Layout Components */}
              <AccordionItem value="layout">
                <AccordionTrigger className="text-sm font-medium">
                  Layout
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filteredComponents(layoutComponents).length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {filteredComponents(layoutComponents).map((component) => (
                    <ComponentButton
                      key={component.type}
                      component={component}
                      onClick={() => onAddComponent(component.type)}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Media Components */}
              <AccordionItem value="media">
                <AccordionTrigger className="text-sm font-medium">
                  Media & Content
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filteredComponents(mediaComponents).length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {filteredComponents(mediaComponents).map((component) => (
                    <ComponentButton
                      key={component.type}
                      component={component}
                      onClick={() => onAddComponent(component.type)}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Advanced Components */}
              <AccordionItem value="advanced">
                <AccordionTrigger className="text-sm font-medium">
                  Advanced
                  <Badge variant="outline" className="ml-2 text-xs border-orange-200 text-orange-700">
                    Pro
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {filteredComponents(advancedComponents).map((component) => (
                    <ComponentButton
                      key={component.type}
                      component={component}
                      onClick={() => onAddComponent(component.type)}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* AMP Components */}
              {ampSupport && (
                <AccordionItem value="amp">
                  <AccordionTrigger className="text-sm font-medium">
                    AMP Interactive
                    <Badge variant="outline" className="ml-2 text-xs border-green-200 text-green-700">
                      <Zap className="w-3 h-3 mr-1" />
                      AMP
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    {filteredComponents(ampComponents).map((component) => (
                      <ComponentButton
                        key={component.type}
                        component={component}
                        onClick={() => onAddComponent(component.type)}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Game Components */}
              {gameGeneratorEnabled && (
                <AccordionItem value="games">
                  <AccordionTrigger className="text-sm font-medium">
                    Interactive Games
                    <Badge variant="outline" className="ml-2 text-xs border-purple-200 text-purple-700">
                      <Play className="w-3 h-3 mr-1" />
                      Games
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    {filteredComponents(gameComponents).map((component) => (
                      <ComponentButton
                        key={component.type}
                        component={component}
                        onClick={() => onAddComponent(component.type)}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </TabsContent>

          {/* Saved Modules Tab */}
          <TabsContent value="modules" className="flex-1 p-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Saved Modules</h3>
                <Button variant="outline" size="sm" className="text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  Save Current
                </Button>
              </div>

              {savedModules.map((module) => (
                <Card key={module.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{module.thumbnail}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{module.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{module.type} module</p>
                      </div>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Separator className="my-4" />

              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Synchronized Modules
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  Edit once, update everywhere automatically
                </p>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Palette className="w-3 h-3 mr-1" />
                  Create Sync Module
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Quick Templates Tab */}
          <TabsContent value="templates" className="flex-1 p-4 space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Quick Start Templates</h3>
              
              {quickTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{template.name}</p>
                        <p className="text-xs text-gray-500">
                          {template.components.length} components
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => {
                          // Add all components in sequence
                          template.components.forEach((componentType, index) => {
                            setTimeout(() => {
                              onAddComponent(componentType as StripoComponentType);
                            }, index * 100);
                          });
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Separator className="my-4" />

              <Button variant="outline" className="w-full" onClick={() => {}}>
                <FileText className="w-4 h-4 mr-2" />
                Browse All Templates
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}