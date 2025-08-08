import React from 'react';
import { CustomEmailEditor } from '@/components/custom-email-editor/CustomEmailEditor';
import { EmailTemplate, MergeTag } from '@/components/custom-email-editor/EmailEditorCore';

// Sample merge tags for demo
const sampleMergeTags: MergeTag[] = [
  { key: 'firstName', label: 'First Name', type: 'text', defaultValue: 'John' },
  { key: 'lastName', label: 'Last Name', type: 'text', defaultValue: 'Doe' },
  { key: 'email', label: 'Email Address', type: 'email', defaultValue: 'john@example.com' },
  { key: 'company', label: 'Company Name', type: 'text', defaultValue: 'Acme Corp' },
  { key: 'phone', label: 'Phone Number', type: 'text', defaultValue: '+1 (555) 123-4567' },
  { key: 'orderNumber', label: 'Order Number', type: 'text', defaultValue: '#ORD-12345' },
  { key: 'amount', label: 'Total Amount', type: 'number', defaultValue: '$99.99' },
  { key: 'productName', label: 'Product Name', type: 'text', defaultValue: 'Premium Package' },
  { key: 'websiteUrl', label: 'Website URL', type: 'url', defaultValue: 'https://example.com' },
  { key: 'supportEmail', label: 'Support Email', type: 'email', defaultValue: 'support@example.com' }
];

// Sample initial template
const initialTemplate: EmailTemplate = {
  id: 'sample-template',
  name: 'Welcome Email Template',
  subject: 'Welcome to {{company}}, {{firstName}}!',
  components: [
    {
      id: 'header-1',
      type: 'header',
      title: 'Welcome to {{company}}!',
      subtitle: 'We\'re excited to have you on board, {{firstName}}',
      styles: {
        backgroundColor: '#2563eb',
        color: '#ffffff',
        textAlign: 'center',
        padding: '32px 16px'
      }
    },
    {
      id: 'text-1',
      type: 'text',
      content: 'Hi {{firstName}},<br><br>Thank you for joining {{company}}! We\'re thrilled to welcome you to our community of amazing customers.',
      styles: {
        fontSize: '16px',
        color: '#374151',
        padding: '24px 16px',
        lineHeight: '1.6'
      }
    },
    {
      id: 'button-1',
      type: 'button',
      text: 'Get Started',
      href: '{{websiteUrl}}/get-started',
      styles: {
        backgroundColor: '#2563eb',
        color: '#ffffff',
        textAlign: 'center',
        padding: '12px 24px',
        borderRadius: '6px',
        textDecoration: 'none',
        display: 'inline-block',
        margin: '16px 0'
      }
    },
    {
      id: 'text-2',
      type: 'text',
      content: 'If you have any questions, feel free to reach out to our support team at {{supportEmail}}.',
      styles: {
        fontSize: '14px',
        color: '#6b7280',
        padding: '16px',
        textAlign: 'center'
      }
    },
    {
      id: 'footer-1',
      type: 'footer',
      content: '© 2024 {{company}}. All rights reserved.<br>Need help? Contact us at {{supportEmail}}',
      styles: {
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        textAlign: 'center',
        fontSize: '12px',
        padding: '24px 16px'
      }
    }
  ],
  styles: {
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px'
  },
  mergeTagData: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    company: 'Acme Corporation',
    phone: '+1 (555) 123-4567',
    orderNumber: '#ORD-12345',
    amount: '$99.99',
    productName: 'Premium Package',
    websiteUrl: 'https://acme.com',
    supportEmail: 'support@acme.com'
  }
};

export default function CustomEmailBuilderPage() {
  const handleTemplateChange = (template: EmailTemplate) => {
    console.log('Template changed:', template);
  };

  const handleSave = (template: EmailTemplate) => {
    console.log('Saving template:', template);
    // Here you would typically save to your backend
  };

  return (
    <div className="h-screen">
      <CustomEmailEditor
        initialTemplate={initialTemplate}
        onTemplateChange={handleTemplateChange}
        onSave={handleSave}
        mergeTags={sampleMergeTags}
        ampSupport={true}
      />
    </div>
  );
}