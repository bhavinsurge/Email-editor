import React from 'react';
import { StripoEditor } from '@/components/stripo-clone/StripoEditor';
import { StripoEmailTemplate, StripoUser } from '@/components/stripo-clone/types/stripo.types';

// Mock user for demo
const currentUser: StripoUser = {
  id: 'user-current',
  name: 'Current User',
  email: 'user@example.com',
  role: 'owner',
  isOnline: true,
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
};

// Sample initial template with Stripo-like components
const initialTemplate: StripoEmailTemplate = {
  id: 'stripo-template-1',
  name: 'Professional Newsletter Template',
  subject: 'Welcome to {{company}} Newsletter - {{firstName}}!',
  preheader: 'Your monthly dose of industry insights and updates',
  components: [
    {
      id: 'header-1',
      type: 'header',
      name: 'Email Header',
      locked: false,
      hidden: false,
      order: 0,
      content: {
        title: 'Welcome to {{company}}',
        subtitle: 'Your trusted source for industry insights'
      },
      styles: {
        backgroundColor: '#2563eb',
        color: '#ffffff',
        textAlign: 'center',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        fontWeight: '600'
      },
      settings: {
        visible: true,
        hiddenOnMobile: false,
        hiddenOnDesktop: false,
        mobileVisible: true,
        tabletVisible: true,
        autoHeight: true,
        overflow: 'visible',
        ampValidation: true
      }
    },
    {
      id: 'text-1',
      type: 'text',
      name: 'Welcome Text',
      locked: false,
      hidden: false,
      order: 1,
      content: {
        text: 'Hi {{firstName}},<br><br>Welcome to our newsletter! We\'re excited to share the latest industry trends, insights, and updates with you. This month, we\'ve curated some amazing content that we think you\'ll love.',
        variables: [
          { key: 'firstName', label: 'First Name', type: 'text', defaultValue: 'John' }
        ]
      },
      styles: {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        color: '#374151',
        lineHeight: '1.6',
        padding: '30px 20px',
        textAlign: 'left'
      },
      settings: {
        visible: true,
        hiddenOnMobile: false,
        hiddenOnDesktop: false,
        mobileVisible: true,
        tabletVisible: true,
        autoHeight: true,
        overflow: 'visible',
        ampValidation: true
      }
    },
    {
      id: 'image-1',
      type: 'image',
      name: 'Feature Image',
      locked: false,
      hidden: false,
      order: 2,
      content: {
        src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=300&fit=crop',
        alt: 'Newsletter feature image',
        href: 'https://example.com/featured-article'
      },
      styles: {
        width: '100%',
        padding: '20px',
        borderRadius: '8px'
      },
      settings: {
        visible: true,
        hiddenOnMobile: false,
        hiddenOnDesktop: false,
        mobileVisible: true,
        tabletVisible: true,
        autoHeight: true,
        overflow: 'visible',
        ampValidation: true
      }
    },
    {
      id: 'button-1',
      type: 'button',
      name: 'CTA Button',
      locked: false,
      hidden: false,
      order: 3,
      content: {
        text: 'Read Full Article',
        href: 'https://example.com/article'
      },
      styles: {
        backgroundColor: '#2563eb',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontWeight: '500',
        textAlign: 'center',
        margin: '20px auto',
        display: 'inline-block'
      },
      settings: {
        visible: true,
        hiddenOnMobile: false,
        hiddenOnDesktop: false,
        mobileVisible: true,
        tabletVisible: true,
        autoHeight: true,
        overflow: 'visible',
        ampValidation: true
      }
    },
    {
      id: 'divider-1',
      type: 'divider',
      name: 'Section Divider',
      locked: false,
      hidden: false,
      order: 4,
      content: {},
      styles: {
        height: '1px',
        backgroundColor: '#e5e7eb',
        margin: '30px 20px',
        border: 'none'
      },
      settings: {
        visible: true,
        hiddenOnMobile: false,
        hiddenOnDesktop: false,
        mobileVisible: true,
        tabletVisible: true,
        autoHeight: true,
        overflow: 'visible',
        ampValidation: true
      }
    },
    {
      id: 'social-1',
      type: 'social',
      name: 'Social Links',
      locked: false,
      hidden: false,
      order: 5,
      content: {
        items: [
          { id: 'fb', type: 'facebook', content: 'https://facebook.com/company' },
          { id: 'tw', type: 'twitter', content: 'https://twitter.com/company' },
          { id: 'in', type: 'linkedin', content: 'https://linkedin.com/company/company' },
          { id: 'ig', type: 'instagram', content: 'https://instagram.com/company' }
        ]
      },
      styles: {
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        padding: '20px'
      },
      settings: {
        visible: true,
        hiddenOnMobile: false,
        hiddenOnDesktop: false,
        mobileVisible: true,
        tabletVisible: true,
        autoHeight: true,
        overflow: 'visible',
        ampValidation: true
      }
    },
    {
      id: 'footer-1',
      type: 'footer',
      name: 'Email Footer',
      locked: false,
      hidden: false,
      order: 6,
      content: {
        text: '© 2024 {{company}}. All rights reserved.<br><br>You received this email because you subscribed to our newsletter.<br><a href="{{unsubscribe_url}}" style="color: #6b7280;">Unsubscribe</a> | <a href="{{preferences_url}}" style="color: #6b7280;">Update Preferences</a>',
        variables: [
          { key: 'company', label: 'Company Name', type: 'text', defaultValue: 'Your Company' },
          { key: 'unsubscribe_url', label: 'Unsubscribe URL', type: 'url', defaultValue: '#' },
          { key: 'preferences_url', label: 'Preferences URL', type: 'url', defaultValue: '#' }
        ]
      },
      styles: {
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        fontSize: '12px',
        textAlign: 'center',
        padding: '30px 20px',
        lineHeight: '1.5'
      },
      settings: {
        visible: true,
        hiddenOnMobile: false,
        hiddenOnDesktop: false,
        mobileVisible: true,
        tabletVisible: true,
        autoHeight: true,
        overflow: 'visible',
        ampValidation: true
      }
    }
  ],
  globalStyles: {
    container: {
      maxWidth: '600px',
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, Helvetica, sans-serif',
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
      headingFont: 'Arial, Helvetica, sans-serif',
      bodyFont: 'Arial, Helvetica, sans-serif',
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
    },
    customCSS: `
      /* Custom styles for email clients */
      @media only screen and (max-width: 600px) {
        .mobile-hide { display: none !important; }
        .mobile-center { text-align: center !important; }
        .mobile-full { width: 100% !important; }
      }
    `
  },
  settings: {
    width: 600,
    backgroundColor: '#f5f5f5',
    contentAreaBackgroundColor: '#ffffff',
    direction: 'ltr',
    language: 'en',
    preheaderText: 'Your monthly dose of industry insights and updates',
    outlookCompatibility: true,
    appleMail: true,
    gmail: true,
    yahooMail: true,
    darkModeSupport: true,
    ampSupport: true,
    interactiveElements: true,
    openTracking: true,
    clickTracking: true,
    unsubscribeLink: true,
    mergeTags: [
      { key: 'firstName', label: 'First Name', type: 'text', defaultValue: 'John' },
      { key: 'lastName', label: 'Last Name', type: 'text', defaultValue: 'Doe' },
      { key: 'company', label: 'Company Name', type: 'text', defaultValue: 'Your Company' },
      { key: 'email', label: 'Email Address', type: 'email', defaultValue: 'john@example.com' },
      { key: 'unsubscribe_url', label: 'Unsubscribe URL', type: 'url', defaultValue: '#' },
      { key: 'preferences_url', label: 'Preferences URL', type: 'url', defaultValue: '#' }
    ],
    dynamicContent: true,
    conditionalContent: true
  },
  metadata: {
    description: 'Professional newsletter template with modern design and AMP support',
    industry: 'General',
    purpose: 'Newsletter',
    difficulty: 'beginner',
    estimatedTime: 45,
    components: 7,
    size: 0,
    version: '2.0.0',
    changelog: [
      {
        id: 'change-1',
        timestamp: new Date().toISOString(),
        userId: 'system',
        userName: 'System',
        type: 'template_settings',
        description: 'Initial template creation with AMP support',
        data: { version: '2.0.0' }
      }
    ]
  },
  created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  lastModified: new Date().toISOString(),
  createdBy: 'system',
  modifiedBy: 'user-current',
  version: 1,
  tags: ['newsletter', 'professional', 'responsive', 'amp'],
  category: 'newsletters',
  thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
  isFavorite: false
};

export default function StripoBuilderPage() {
  const handleTemplateChange = (template: StripoEmailTemplate) => {
    console.log('Template updated:', template.name);
    // In a real app, this would sync with your backend
  };

  const handleSave = async (template: StripoEmailTemplate) => {
    console.log('Saving template:', template);
    // In a real app, this would save to your backend API
    try {
      // const response = await fetch('/api/templates', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(template)
      // });
      console.log('Template saved successfully');
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  const handleExport = async (html: string, format: 'html' | 'amp') => {
    console.log(`Exporting as ${format.toUpperCase()}:`, html);
    // In a real app, this might send to an email service provider
  };

  return (
    <div className="h-screen">
      <StripoEditor
        initialTemplate={initialTemplate}
        user={currentUser}

        onSave={handleSave}
        onExport={handleExport}
        collaborationEnabled={true}
        versionHistoryEnabled={true}
        aiAssistantEnabled={true}
        gameGeneratorEnabled={true}
        customFontsEnabled={true}
        ampSupport={true}
        className="stripo-professional-theme"
      />
    </div>
  );
}