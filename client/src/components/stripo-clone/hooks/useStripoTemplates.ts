import { useState, useCallback, useMemo } from 'react';
import { StripoTemplate, StripoTemplateCategory, StripoEmailTemplate } from '../types/stripo.types';
import { nanoid } from 'nanoid';

interface UseStripoTemplatesReturn {
  templates: StripoTemplate[];
  categories: StripoTemplateCategory[];
  loading: boolean;
  searchTemplates: (query: string, filters?: TemplateFilters) => StripoTemplate[];
  getTemplateById: (id: string) => StripoEmailTemplate | null;
  saveTemplate: (template: StripoEmailTemplate, isPublic?: boolean) => void;
  favoriteTemplate: (templateId: string) => void;
  getTemplatesByCategory: (categoryId: string) => StripoTemplate[];
  getFeaturedTemplates: () => StripoTemplate[];
  getRecentTemplates: () => StripoTemplate[];
}

interface TemplateFilters {
  category?: string;
  industry?: string[];
  purpose?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isPremium?: boolean;
  isFree?: boolean;
}

// Mock template data (in real app, this would come from API)
const mockCategories: StripoTemplateCategory[] = [
  {
    id: 'newsletters',
    name: 'Newsletters',
    icon: '📰',
    description: 'Weekly updates and content digests',
    templateCount: 45,
    subcategories: [
      { id: 'news', name: 'News & Updates', templateCount: 15 },
      { id: 'content', name: 'Content Digest', templateCount: 20 },
      { id: 'company', name: 'Company News', templateCount: 10 }
    ]
  },
  {
    id: 'promotional',
    name: 'Promotional',
    icon: '🎯',
    description: 'Sales and marketing campaigns',
    templateCount: 62,
    subcategories: [
      { id: 'sales', name: 'Sales Campaigns', templateCount: 25 },
      { id: 'product-launch', name: 'Product Launch', templateCount: 18 },
      { id: 'seasonal', name: 'Seasonal Offers', templateCount: 19 }
    ]
  },
  {
    id: 'transactional',
    name: 'Transactional',
    icon: '🧾',
    description: 'Order confirmations and receipts',
    templateCount: 38,
    subcategories: [
      { id: 'receipts', name: 'Order Receipts', templateCount: 12 },
      { id: 'confirmations', name: 'Confirmations', templateCount: 15 },
      { id: 'shipping', name: 'Shipping Updates', templateCount: 11 }
    ]
  },
  {
    id: 'welcome',
    name: 'Welcome',
    icon: '👋',
    description: 'Onboarding and welcome sequences',
    templateCount: 28,
    subcategories: [
      { id: 'onboarding', name: 'User Onboarding', templateCount: 15 },
      { id: 'welcome-series', name: 'Welcome Series', templateCount: 13 }
    ]
  },
  {
    id: 'events',
    name: 'Events',
    icon: '📅',
    description: 'Event invitations and announcements',
    templateCount: 22,
    subcategories: [
      { id: 'invitations', name: 'Event Invitations', templateCount: 12 },
      { id: 'webinars', name: 'Webinar Announcements', templateCount: 10 }
    ]
  }
];

const createMockTemplate = (
  id: string, 
  name: string, 
  category: string, 
  industry: string[],
  purpose: string[],
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
  isPremium: boolean = false
): StripoTemplate => ({
  id,
  name,
  category,
  subcategory: mockCategories.find(c => c.id === category)?.subcategories[0]?.id,
  thumbnail: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400&h=300&fit=crop`,
  previewImages: [
    `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=600&h=800&fit=crop`,
    `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400&h=600&fit=crop`
  ],
  description: `Professional ${name.toLowerCase()} template perfect for ${industry.join(', ')} businesses`,
  tags: [...industry, ...purpose, category],
  industry,
  purpose,
  difficulty,
  isPremium,
  isFree: !isPremium,
  isNew: Math.random() > 0.8,
  isPopular: Math.random() > 0.7,
  rating: 4 + Math.random(),
  downloads: Math.floor(Math.random() * 10000) + 100,
  components: Math.floor(Math.random() * 15) + 5,
  template: createMockEmailTemplate(id, name),
  created: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  updated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
});

const createMockEmailTemplate = (id: string, name: string): StripoEmailTemplate => ({
  id,
  name,
  subject: `${name} - {{firstName}}`,
  preheader: `Preview of our latest ${name.toLowerCase()}`,
  components: [], // Would be populated with actual components
  globalStyles: {
    container: {
      maxWidth: '600px',
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      padding: '0'
    },
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b',
      text: '#1f2937',
      background: '#ffffff',
      link: '#2563eb',
      border: '#e5e7eb'
    },
    typography: {
      headingFont: 'Arial, sans-serif',
      bodyFont: 'Arial, sans-serif',
      h1Size: '32px',
      h2Size: '24px',
      h3Size: '20px',
      bodySize: '16px',
      smallSize: '14px'
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '16px'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    responsive: {
      mobile: '320px',
      tablet: '768px',
      desktop: '1024px'
    }
  },
  settings: {
    width: 600,
    backgroundColor: '#f5f5f5',
    contentAreaBackgroundColor: '#ffffff',
    direction: 'ltr',
    language: 'en',
    outlookCompatibility: true,
    appleMail: true,
    gmail: true,
    yahooMail: true,
    darkModeSupport: false,
    ampSupport: false,
    interactiveElements: true,
    openTracking: true,
    clickTracking: true,
    unsubscribeLink: true,
    mergeTags: [],
    dynamicContent: false,
    conditionalContent: false
  },
  metadata: {
    description: '',
    industry: '',
    purpose: '',
    difficulty: 'beginner',
    estimatedTime: 30,
    components: 0,
    size: 0,
    version: '1.0.0',
    changelog: []
  },
  created: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  createdBy: 'system',
  modifiedBy: 'system',
  version: 1,
  tags: [],
  category: 'template'
});

// Mock templates
const mockTemplates: StripoTemplate[] = [
  // Newsletter templates
  createMockTemplate('tpl-1', 'Modern Newsletter', 'newsletters', ['technology', 'startup'], ['newsletter', 'updates']),
  createMockTemplate('tpl-2', 'Weekly Digest', 'newsletters', ['media', 'content'], ['digest', 'weekly'], 'beginner'),
  createMockTemplate('tpl-3', 'Company Updates', 'newsletters', ['corporate', 'enterprise'], ['internal', 'updates'], 'intermediate'),
  
  // Promotional templates
  createMockTemplate('tpl-4', 'Black Friday Sale', 'promotional', ['retail', 'ecommerce'], ['sale', 'promotion'], 'beginner'),
  createMockTemplate('tpl-5', 'Product Launch', 'promotional', ['technology', 'saas'], ['launch', 'announcement'], 'intermediate'),
  createMockTemplate('tpl-6', 'Summer Collection', 'promotional', ['fashion', 'retail'], ['seasonal', 'collection'], 'beginner'),
  
  // Transactional templates
  createMockTemplate('tpl-7', 'Order Confirmation', 'transactional', ['ecommerce', 'retail'], ['receipt', 'confirmation'], 'beginner'),
  createMockTemplate('tpl-8', 'Shipping Notification', 'transactional', ['logistics', 'ecommerce'], ['shipping', 'tracking'], 'beginner'),
  createMockTemplate('tpl-9', 'Payment Receipt', 'transactional', ['finance', 'saas'], ['payment', 'receipt'], 'intermediate'),
  
  // Welcome templates
  createMockTemplate('tpl-10', 'Welcome Aboard', 'welcome', ['saas', 'technology'], ['onboarding', 'welcome'], 'beginner'),
  createMockTemplate('tpl-11', 'Getting Started Guide', 'welcome', ['education', 'saas'], ['tutorial', 'guide'], 'intermediate'),
  
  // Event templates
  createMockTemplate('tpl-12', 'Webinar Invitation', 'events', ['education', 'technology'], ['webinar', 'invitation'], 'beginner'),
  createMockTemplate('tpl-13', 'Conference Announcement', 'events', ['business', 'technology'], ['conference', 'event'], 'intermediate'),
  
  // Premium templates
  createMockTemplate('tpl-14', 'Premium Newsletter Pro', 'newsletters', ['luxury', 'premium'], ['newsletter', 'exclusive'], 'advanced', true),
  createMockTemplate('tpl-15', 'Advanced Sales Funnel', 'promotional', ['saas', 'b2b'], ['sales', 'conversion'], 'advanced', true)
];

export function useStripoTemplates(): UseStripoTemplatesReturn {
  const [templates] = useState<StripoTemplate[]>(mockTemplates);
  const [categories] = useState<StripoTemplateCategory[]>(mockCategories);
  const [loading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const searchTemplates = useCallback((query: string, filters?: TemplateFilters): StripoTemplate[] => {
    let filtered = templates;

    // Text search
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchTerm) ||
        template.description.toLowerCase().includes(searchTerm) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply filters
    if (filters) {
      if (filters.category) {
        filtered = filtered.filter(template => template.category === filters.category);
      }
      
      if (filters.industry?.length) {
        filtered = filtered.filter(template => 
          template.industry.some(industry => filters.industry!.includes(industry))
        );
      }
      
      if (filters.purpose?.length) {
        filtered = filtered.filter(template => 
          template.purpose.some(purpose => filters.purpose!.includes(purpose))
        );
      }
      
      if (filters.difficulty) {
        filtered = filtered.filter(template => template.difficulty === filters.difficulty);
      }
      
      if (filters.isPremium !== undefined) {
        filtered = filtered.filter(template => template.isPremium === filters.isPremium);
      }
      
      if (filters.isFree !== undefined) {
        filtered = filtered.filter(template => template.isFree === filters.isFree);
      }
    }

    return filtered;
  }, [templates]);

  const getTemplateById = useCallback((id: string): StripoEmailTemplate | null => {
    const template = templates.find(t => t.id === id);
    return template ? template.template : null;
  }, [templates]);

  const saveTemplate = useCallback((template: StripoEmailTemplate, isPublic: boolean = false) => {
    // In a real app, this would save to the backend
    console.log('Saving template:', template.name, { isPublic });
  }, []);

  const favoriteTemplate = useCallback((templateId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(templateId)) {
        newFavorites.delete(templateId);
      } else {
        newFavorites.add(templateId);
      }
      return newFavorites;
    });
  }, []);

  const getTemplatesByCategory = useCallback((categoryId: string): StripoTemplate[] => {
    return templates.filter(template => template.category === categoryId);
  }, [templates]);

  const getFeaturedTemplates = useCallback((): StripoTemplate[] => {
    return templates
      .filter(template => template.isPopular || template.isNew)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, [templates]);

  const getRecentTemplates = useCallback((): StripoTemplate[] => {
    return [...templates]
      .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
      .slice(0, 6);
  }, [templates]);

  // Add favorites to templates
  const templatesWithFavorites = useMemo(() => {
    return templates.map(template => ({
      ...template,
      isFavorite: favorites.has(template.id)
    }));
  }, [templates, favorites]);

  return {
    templates: templatesWithFavorites,
    categories,
    loading,
    searchTemplates,
    getTemplateById,
    saveTemplate,
    favoriteTemplate,
    getTemplatesByCategory,
    getFeaturedTemplates,
    getRecentTemplates
  };
}