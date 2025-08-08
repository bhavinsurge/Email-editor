import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  X,
  Monitor,
  Smartphone,
  Tablet,
  Mail,
  Send,
  Eye,
  Download,
  Share,
  Zap
} from 'lucide-react';
import { StripoEmailTemplate } from '../types/stripo.types';

interface StripoPreviewModalProps {
  template?: StripoEmailTemplate;
  device: 'desktop' | 'mobile' | 'tablet';
  onDeviceChange: (device: 'desktop' | 'mobile' | 'tablet') => void;
  onClose: () => void;
  onSendTest: (email: string) => void;
  onInboxPreview: () => void;
  ampSupport?: boolean;
}

export function StripoPreviewModal({
  template,
  device,
  onDeviceChange,
  onClose,
  onSendTest,
  onInboxPreview,
  ampSupport = true
}: StripoPreviewModalProps) {
  const [testEmail, setTestEmail] = useState('');
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [previewFormat, setPreviewFormat] = useState<'html' | 'amp'>('html');

  if (!template) return null;

  const getDeviceStyles = () => {
    switch (device) {
      case 'mobile':
        return { maxWidth: '375px', height: '667px' };
      case 'tablet':
        return { maxWidth: '768px', height: '1024px' };
      default:
        return { maxWidth: '1200px', height: '800px' };
    }
  };

  const handleSendTest = () => {
    if (testEmail.trim()) {
      onSendTest(testEmail);
      setShowTestDialog(false);
      setTestEmail('');
    }
  };

  // Mock preview content (in real app, this would be generated from template)
  const generatePreviewContent = () => {
    const processedSubject = template.subject.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const mockData: Record<string, string> = {
        firstName: 'John',
        lastName: 'Doe',
        company: 'Acme Corp',
        email: 'john@example.com'
      };
      return mockData[key] || match;
    });

    return `
      <!DOCTYPE html>
      <html${previewFormat === 'amp' ? ' ⚡4email' : ''}>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${processedSubject}</title>
        ${previewFormat === 'amp' ? '<script async src="https://cdn.ampproject.org/v0.js"></script>' : ''}
        <style>
          body { margin: 0; padding: 20px; font-family: ${template.globalStyles.typography.bodyFont}; background-color: ${template.settings.backgroundColor}; }
          .email-container { max-width: ${template.settings.width}px; margin: 0 auto; background-color: ${template.settings.contentAreaBackgroundColor}; }
          .preview-note { background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 12px; margin-bottom: 16px; color: #0369a1; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="preview-note">
            ✨ This is a preview of your email template with sample data
          </div>
          ${template.components.map(component => `
            <div style="padding: 16px;">
              ${component.type === 'header' ? `
                <div style="background-color: ${component.styles.backgroundColor}; color: ${component.styles.color}; text-align: ${component.styles.textAlign}; padding: ${component.styles.padding};">
                  <h1 style="margin: 0 0 8px 0; font-size: 24px;">${component.content?.title?.replace(/\{\{company\}\}/g, 'Acme Corp') || 'Header'}</h1>
                  <p style="margin: 0; opacity: 0.9;">${component.content?.subtitle || ''}</p>
                </div>
              ` : component.type === 'text' ? `
                <div style="font-size: ${component.styles.fontSize}; color: ${component.styles.color}; line-height: 1.6;">
                  ${component.content?.text?.replace(/\{\{firstName\}\}/g, 'John').replace(/\{\{company\}\}/g, 'Acme Corp') || 'Text content'}
                </div>
              ` : component.type === 'image' ? `
                <img src="${component.content?.src}" alt="${component.content?.alt}" style="width: 100%; height: auto; border-radius: ${component.styles.borderRadius};" />
              ` : component.type === 'button' ? `
                <div style="text-align: ${component.styles.textAlign};">
                  <a href="${component.content?.href}" style="background-color: ${component.styles.backgroundColor}; color: ${component.styles.color}; padding: ${component.styles.padding}; border-radius: ${component.styles.borderRadius}; text-decoration: none; display: inline-block;">
                    ${component.content?.text || 'Button'}
                  </a>
                </div>
              ` : component.type === 'footer' ? `
                <div style="background-color: ${component.styles.backgroundColor}; color: ${component.styles.color}; font-size: ${component.styles.fontSize}; text-align: ${component.styles.textAlign}; padding: ${component.styles.padding};">
                  ${component.content?.text?.replace(/\{\{company\}\}/g, 'Acme Corp') || 'Footer content'}
                </div>
              ` : `
                <div style="padding: 16px; border: 1px dashed #ccc; text-align: center; color: #666;">
                  ${component.type} component
                </div>
              `}
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">Email Preview</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Subject:</span>
                <span className="font-medium">{template.subject.replace(/\{\{(\w+)\}\}/g, 'John')}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Format Toggle for AMP */}
              {ampSupport && (
                <div className="flex bg-gray-100 rounded-md p-1">
                  <Button
                    variant={previewFormat === 'html' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewFormat('html')}
                    className="px-3 py-1"
                  >
                    HTML
                  </Button>
                  <Button
                    variant={previewFormat === 'amp' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewFormat('amp')}
                    className="px-3 py-1"
                  >
                    <Zap className="w-3 h-3 mr-1 text-green-600" />
                    AMP
                  </Button>
                </div>
              )}

              {/* Device Selector */}
              <div className="flex bg-gray-100 rounded-md p-1">
                <Button
                  variant={device === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onDeviceChange('desktop')}
                  className="px-2 py-1"
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={device === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onDeviceChange('tablet')}
                  className="px-2 py-1"
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={device === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onDeviceChange('mobile')}
                  className="px-2 py-1"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>

              {/* Actions */}
              <Button variant="outline" size="sm" onClick={() => setShowTestDialog(true)}>
                <Send className="w-4 h-4 mr-1" />
                Send Test
              </Button>
              
              <Button variant="outline" size="sm" onClick={onInboxPreview}>
                <Eye className="w-4 h-4 mr-1" />
                Inbox Preview
              </Button>

              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Main Preview */}
            <div className="flex-1 bg-gray-100 p-8 overflow-auto">
              <div className="flex justify-center">
                <div
                  className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
                  style={getDeviceStyles()}
                >
                  <iframe
                    src={`data:text/html;charset=utf-8,${encodeURIComponent(generatePreviewContent())}`}
                    className="w-full h-full border-0"
                    title="Email Preview"
                  />
                </div>
              </div>
            </div>

            {/* Side Panel with Details */}
            <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
              <Tabs defaultValue="details" className="h-full">
                <TabsList className="grid grid-cols-3 mx-4 mt-4">
                  <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
                  <TabsTrigger value="checklist" className="text-xs">Checklist</TabsTrigger>
                  <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="p-4 space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Template Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{template.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Components:</span>
                        <span className="font-medium">{template.components.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Width:</span>
                        <span className="font-medium">{template.settings.width}px</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">AMP Support:</span>
                        <span className="font-medium">{template.settings.ampSupport ? 'Yes' : 'No'}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Merge Tags Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {template.settings.mergeTags.map((tag) => (
                          <div key={tag.key} className="flex items-center justify-between text-sm">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {`{{${tag.key}}}`}
                            </code>
                            <span className="text-gray-600">{tag.label}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="checklist" className="p-4 space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Email Checklist</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { check: 'Subject line added', status: !!template.subject },
                        { check: 'Preheader text added', status: !!template.preheader },
                        { check: 'Call-to-action present', status: template.components.some(c => c.type === 'button') },
                        { check: 'Images have alt text', status: template.components.filter(c => c.type === 'image').every(c => c.content?.alt) },
                        { check: 'Mobile responsive', status: true },
                        { check: 'Unsubscribe link', status: template.components.some(c => c.content?.text?.includes('unsubscribe')) }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div className={`w-3 h-3 rounded-full ${item.status ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className={item.status ? 'text-gray-900' : 'text-gray-500'}>{item.check}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="p-4 space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Predicted Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spam Score:</span>
                        <span className="font-medium text-green-600">Low</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Readability:</span>
                        <span className="font-medium text-green-600">Good</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Est. Open Rate:</span>
                        <span className="font-medium">22-28%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Est. Click Rate:</span>
                        <span className="font-medium">3-5%</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Preview with sample data • Device: {device} • Format: {previewFormat.toUpperCase()}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button onClick={onClose}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Send Test Dialog */}
      {showTestDialog && (
        <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Test Email</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="testEmail">Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="mt-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowTestDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendTest} disabled={!testEmail.trim()}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Test
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}