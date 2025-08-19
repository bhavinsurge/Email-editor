import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  Video,
  Code,
  Timer,
  Share2,
  Grid3X3,
  Mail,
  User,
  Star,
  ShoppingCart,
  Search,
  Tag
} from 'lucide-react';
import { StripoComponentType } from '../types/stripo.types';

interface StripoSidebarProps {
  onAddComponent: (type: StripoComponentType) => void;
  selectedComponentType?: StripoComponentType;
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

const formComponents = [
  { type: 'form' as const, label: 'Contact Form', icon: Mail, description: 'Lead capture forms' },
  { type: 'survey' as const, label: 'Survey', icon: User, description: 'Customer surveys' }
];

// Comprehensive merge tags from the provided file
const mergeTags = {
  user: [
    '{{userId}}', '{{firstName}}', '{{lastName}}', '{{fullName}}', '{{email}}', '{{phone}}',
    '{{gender}}', '{{dob}}', '{{age}}', '{{language}}', '{{timezone}}', '{{profileImage}}',
    '{{middleName}}', '{{nickname}}', '{{title}}'
  ],
  address: [
    '{{address}}', '{{addressLine1}}', '{{addressLine2}}', '{{city}}', '{{state}}',
    '{{postalCode}}', '{{country}}', '{{region}}', '{{county}}'
  ],
  company: [
    '{{companyId}}', '{{companyName}}', '{{department}}', '{{jobTitle}}', '{{role}}',
    '{{industry}}', '{{companySize}}', '{{website}}', '{{companyPhone}}', '{{companyEmail}}'
  ],
  account: [
    '{{username}}', '{{signupDate}}', '{{lastLogin}}', '{{accountStatus}}', '{{membershipLevel}}',
    '{{subscriptionPlan}}', '{{subscriptionStart}}', '{{subscriptionEnd}}', '{{passwordResetLink}}',
    '{{verificationLink}}', '{{twoFactorEnabled}}'
  ],
  orders: [
    '{{orderId}}', '{{orderDate}}', '{{orderStatus}}', '{{orderTotal}}', '{{currency}}',
    '{{paymentMethod}}', '{{transactionId}}', '{{invoiceId}}', '{{discountCode}}',
    '{{shippingMethod}}', '{{trackingNumber}}', '{{deliveryDate}}'
  ],
  products: [
    '{{productId}}', '{{productName}}', '{{productDescription}}', '{{productCategory}}',
    '{{productPrice}}', '{{productQuantity}}', '{{sku}}', '{{brand}}', '{{color}}',
    '{{size}}', '{{weight}}', '{{stockStatus}}'
  ],
  campaign: [
    '{{campaignId}}', '{{campaignName}}', '{{campaignType}}', '{{campaignStatus}}',
    '{{currentDate}}', '{{currentTime}}', '{{unsubscribeLink}}', '{{preferencesLink}}',
    '{{supportEmail}}', '{{companyWebsite}}', '{{systemName}}', '{{systemUrl}}',
    '{{appName}}', '{{appVersion}}', '{{customField}}'
  ]
};

export function StripoSidebar({ 
  onAddComponent, 
  selectedComponentType
}: StripoSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('components');

  const ComponentButton = ({ 
    component 
  }: { 
    component: { type: StripoComponentType; label: string; icon: any; description: string }; 
  }) => {
    const Icon = component.icon;
    
    const [{ isDragging }, drag] = useDrag({
      type: 'component',
      item: { type: component.type },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    });
    
    return (
      <div
        ref={drag}
        className={`p-3 border-2 border-dashed rounded-lg cursor-grab transition-all group border-gray-200 hover:border-blue-400 hover:bg-blue-50 ${isDragging ? 'opacity-50 cursor-grabbing' : ''}`}
        title={`Drag to add ${component.label}`}
        data-testid={`component-${component.type}`}
      >
        <div className="flex items-start space-x-3">
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-400 group-hover:text-blue-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
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

  const MergeTagButton = ({ tag }: { tag: string }) => {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-auto p-2 text-xs font-mono justify-start bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-300"
        onClick={() => {
          // Copy to clipboard
          navigator.clipboard.writeText(tag);
        }}
        data-testid={`merge-tag-${tag.replace(/[{}]/g, '')}`}
      >
        <Tag className="w-3 h-3 mr-1" />
        {tag}
      </Button>
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

  const filteredMergeTags = (tags: string[]) => {
    if (!searchQuery.trim()) return tags;
    const query = searchQuery.toLowerCase();
    return tags.filter(tag => 
      tag.toLowerCase().includes(query)
    );
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Components</h2>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-components"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="components" className="text-xs" data-testid="tab-components">Components</TabsTrigger>
            <TabsTrigger value="merge-tags" className="text-xs" data-testid="tab-merge-tags">Merge Tags</TabsTrigger>
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
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Form Components */}
              <AccordionItem value="forms">
                <AccordionTrigger className="text-sm font-medium">
                  Forms & Surveys
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filteredComponents(formComponents).length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {filteredComponents(formComponents).map((component) => (
                    <ComponentButton
                      key={component.type}
                      component={component}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* Merge Tags Tab */}
          <TabsContent value="merge-tags" className="flex-1 p-4 space-y-4">
            <Accordion type="multiple" defaultValue={["user", "company"]} className="space-y-2">
              {/* User/Customer Tags */}
              <AccordionItem value="user">
                <AccordionTrigger className="text-sm font-medium">
                  👤 User / Customer
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filteredMergeTags(mergeTags.user).length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-2">
                  {filteredMergeTags(mergeTags.user).map((tag) => (
                    <MergeTagButton key={tag} tag={tag} />
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Address Tags */}
              <AccordionItem value="address">
                <AccordionTrigger className="text-sm font-medium">
                  🏠 Address
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filteredMergeTags(mergeTags.address).length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-2">
                  {filteredMergeTags(mergeTags.address).map((tag) => (
                    <MergeTagButton key={tag} tag={tag} />
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Company Tags */}
              <AccordionItem value="company">
                <AccordionTrigger className="text-sm font-medium">
                  🏢 Company / Organization
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filteredMergeTags(mergeTags.company).length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-2">
                  {filteredMergeTags(mergeTags.company).map((tag) => (
                    <MergeTagButton key={tag} tag={tag} />
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Account Tags */}
              <AccordionItem value="account">
                <AccordionTrigger className="text-sm font-medium">
                  🔐 Account
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filteredMergeTags(mergeTags.account).length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-2">
                  {filteredMergeTags(mergeTags.account).map((tag) => (
                    <MergeTagButton key={tag} tag={tag} />
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Orders Tags */}
              <AccordionItem value="orders">
                <AccordionTrigger className="text-sm font-medium">
                  🛒 Orders
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filteredMergeTags(mergeTags.orders).length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-2">
                  {filteredMergeTags(mergeTags.orders).map((tag) => (
                    <MergeTagButton key={tag} tag={tag} />
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Products Tags */}
              <AccordionItem value="products">
                <AccordionTrigger className="text-sm font-medium">
                  📦 Products
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filteredMergeTags(mergeTags.products).length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-2">
                  {filteredMergeTags(mergeTags.products).map((tag) => (
                    <MergeTagButton key={tag} tag={tag} />
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Campaign/System Tags */}
              <AccordionItem value="campaign">
                <AccordionTrigger className="text-sm font-medium">
                  🎯 Campaign / System
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filteredMergeTags(mergeTags.campaign).length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-2">
                  {filteredMergeTags(mergeTags.campaign).map((tag) => (
                    <MergeTagButton key={tag} tag={tag} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}