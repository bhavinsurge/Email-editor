import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Download, Zap, Code, Mail, Globe, CheckCircle } from 'lucide-react';
import { StripoEmailTemplate } from '../types/stripo.types';

interface StripoExportModalProps {
  template?: StripoEmailTemplate;
  onExport: (format: 'html' | 'amp') => void;
  onClose: () => void;
  ampSupport?: boolean;
}

export function StripoExportModal({
  template,
  onExport,
  onClose,
  ampSupport = true
}: StripoExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'html' | 'amp'>('html');
  const [exportOptions, setExportOptions] = useState({
    minify: true,
    inlineCSS: true,
    removeComments: true,
    optimizeImages: false,
    includeDarkMode: false,
    includePreheader: true
  });
  const [selectedESP, setSelectedESP] = useState<string>('none');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  if (!template) return null;

  const emailServiceProviders = [
    { id: 'none', name: 'Generic HTML' },
    { id: 'mailchimp', name: 'Mailchimp' },
    { id: 'constant-contact', name: 'Constant Contact' },
    { id: 'campaign-monitor', name: 'Campaign Monitor' },
    { id: 'aweber', name: 'AWeber' },
    { id: 'getresponse', name: 'GetResponse' },
    { id: 'activecampaign', name: 'ActiveCampaign' },
    { id: 'convertkit', name: 'ConvertKit' },
    { id: 'drip', name: 'Drip' },
    { id: 'klaviyo', name: 'Klaviyo' },
    { id: 'sendgrid', name: 'SendGrid' },
    { id: 'mailgun', name: 'Mailgun' },
    { id: 'ses', name: 'Amazon SES' },
    { id: 'outlook', name: 'Outlook' },
    { id: 'gmail', name: 'Gmail' }
  ];

  const generateEmailHTML = () => {
    const processContent = (text: string) => {
      return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        const espMergeTags: Record<string, Record<string, string>> = {
          mailchimp: {
            firstName: '*|FNAME|*',
            lastName: '*|LNAME|*',
            email: '*|EMAIL|*',
            company: '*|COMPANY|*'
          },
          activecampaign: {
            firstName: '%FIRSTNAME%',
            lastName: '%LASTNAME%',
            email: '%EMAIL%',
            company: '%COMPANY%'
          },
          convertkit: {
            firstName: '{{ subscriber.first_name }}',
            lastName: '{{ subscriber.last_name }}',
            email: '{{ subscriber.email_address }}',
            company: '{{ subscriber.company }}'
          },
          sendgrid: {
            firstName: '{{first_name}}',
            lastName: '{{last_name}}',
            email: '{{email}}',
            company: '{{company}}'
          }
        };

        if (selectedESP !== 'none' && espMergeTags[selectedESP]?.[key]) {
          return espMergeTags[selectedESP][key];
        }
        return match;
      });
    };

    const generateComponentHTML = (component: any): string => {
      const styles = component.styles;
      const content = component.content;

      switch (component.type) {
        case 'header':
          return `
            <tr>
              <td style="background-color: ${styles.backgroundColor}; color: ${styles.color}; text-align: ${styles.textAlign}; padding: ${styles.padding};">
                <h1 style="margin: 0 0 8px 0; font-size: 24px; font-family: ${styles.fontFamily};">${processContent(content?.title || '')}</h1>
                ${content?.subtitle ? `<p style="margin: 0; opacity: 0.9;">${processContent(content.subtitle)}</p>` : ''}
              </td>
            </tr>
          `;

        case 'text':
          return `
            <tr>
              <td style="font-family: ${styles.fontFamily}; font-size: ${styles.fontSize}; color: ${styles.color}; line-height: ${styles.lineHeight}; padding: ${styles.padding}; text-align: ${styles.textAlign};">
                ${processContent(content?.text || '')}
              </td>
            </tr>
          `;

        case 'image':
          const imgHTML = `<img src="${content?.src}" alt="${content?.alt}" style="width: 100%; height: auto; border-radius: ${styles.borderRadius};" />`;
          return `
            <tr>
              <td style="padding: ${styles.padding};">
                ${content?.href ? `<a href="${content.href}">${imgHTML}</a>` : imgHTML}
              </td>
            </tr>
          `;

        case 'button':
          return `
            <tr>
              <td style="text-align: ${styles.textAlign}; padding: ${styles.padding};">
                <a href="${content?.href}" style="background-color: ${styles.backgroundColor}; color: ${styles.color}; padding: ${styles.padding}; border-radius: ${styles.borderRadius}; text-decoration: none; display: inline-block; font-family: ${styles.fontFamily};">
                  ${processContent(content?.text || '')}
                </a>
              </td>
            </tr>
          `;

        case 'divider':
          return `
            <tr>
              <td style="padding: ${styles.margin};">
                <hr style="height: ${styles.height}; background-color: ${styles.backgroundColor}; border: none; margin: 0;" />
              </td>
            </tr>
          `;

        case 'social':
          const socialLinks = content?.items?.map((item: any) => 
            `<a href="${item.content}" style="display: inline-block; margin: 0 4px; width: 32px; height: 32px; background-color: #3b82f6; color: white; text-align: center; line-height: 32px; border-radius: 4px; text-decoration: none;">${item.type.charAt(0).toUpperCase()}</a>`
          ).join('') || '';
          
          return `
            <tr>
              <td style="text-align: center; padding: ${styles.padding};">
                ${socialLinks}
              </td>
            </tr>
          `;

        case 'footer':
          return `
            <tr>
              <td style="background-color: ${styles.backgroundColor}; color: ${styles.color}; font-size: ${styles.fontSize}; text-align: ${styles.textAlign}; padding: ${styles.padding}; font-family: ${styles.fontFamily};">
                ${processContent(content?.text || '')}
              </td>
            </tr>
          `;

        default:
          return `
            <tr>
              <td style="padding: 16px; text-align: center; color: #666;">
                [${component.type} component]
              </td>
            </tr>
          `;
      }
    };

    const baseHTML = `<!DOCTYPE html>
<html${exportFormat === 'amp' ? ' ⚡4email' : ''} lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${processContent(template.subject)}</title>
    ${exportFormat === 'amp' ? '<script async src="https://cdn.ampproject.org/v0.js"></script>' : ''}
    ${exportOptions.includePreheader && template.preheader ? `<div style="display: none; max-height: 0; overflow: hidden;">${processContent(template.preheader)}</div>` : ''}
    <style type="text/css">
        /* Reset styles */
        body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        
        /* Remove spacing around Outlook 07, 10 tables */
        table { border-collapse: collapse !important; }
        
        /* Responsive styles */
        @media only screen and (max-width: 600px) {
            .mobile-hide { display: none !important; }
            .mobile-center { text-align: center !important; }
            .mobile-full { width: 100% !important; }
            .mobile-padding { padding: 10px !important; }
        }
        
        /* Dark mode support */
        ${exportOptions.includeDarkMode ? `
        @media (prefers-color-scheme: dark) {
            .dark-mode-bg { background-color: #1f2937 !important; }
            .dark-mode-text { color: #f9fafb !important; }
        }
        ` : ''}
        
        /* Custom global styles */
        ${template.globalStyles.customCSS || ''}
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${template.settings.backgroundColor}; font-family: ${template.globalStyles.typography.bodyFont};">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="${template.settings.width}" style="max-width: ${template.settings.width}px; background-color: ${template.settings.contentAreaBackgroundColor};">
                    ${template.components.map(generateComponentHTML).join('')}
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    // Apply export options
    let finalHTML = baseHTML;
    
    if (exportOptions.removeComments) {
      finalHTML = finalHTML.replace(/<!--[\s\S]*?-->/g, '');
    }
    
    if (exportOptions.minify) {
      finalHTML = finalHTML.replace(/\s+/g, ' ').replace(/>\s</g, '><').trim();
    }

    return finalHTML;
  };

  const handleGenerate = () => {
    const html = generateEmailHTML();
    setGeneratedCode(html);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}.${exportFormat === 'amp' ? 'amp.html' : 'html'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    handleGenerate();
  }, [exportFormat, exportOptions, selectedESP]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Export Email Template
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="options" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="options">Export Options</TabsTrigger>
              <TabsTrigger value="preview">Code Preview</TabsTrigger>
              <TabsTrigger value="esp">ESP Integration</TabsTrigger>
            </TabsList>

            <TabsContent value="options" className="flex-1 overflow-auto space-y-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Format Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Export Format</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex space-x-2">
                      <Button
                        variant={exportFormat === 'html' ? 'default' : 'outline'}
                        onClick={() => setExportFormat('html')}
                        className="flex-1"
                      >
                        <Code className="w-4 h-4 mr-2" />
                        HTML
                      </Button>
                      {ampSupport && (
                        <Button
                          variant={exportFormat === 'amp' ? 'default' : 'outline'}
                          onClick={() => setExportFormat('amp')}
                          className="flex-1"
                        >
                          <Zap className="w-4 h-4 mr-2 text-green-600" />
                          AMP Email
                        </Button>
                      )}
                    </div>
                    
                    {exportFormat === 'amp' && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          AMP emails provide interactive features but require ESP support.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Export Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Optimization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(exportOptions).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <Checkbox
                          checked={value}
                          onCheckedChange={(checked) => 
                            setExportOptions(prev => ({ ...prev, [key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Template Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Template Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Components:</span>
                      <div className="font-medium">{template.components.length}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Width:</span>
                      <div className="font-medium">{template.settings.width}px</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Merge Tags:</span>
                      <div className="font-medium">{template.settings.mergeTags.length}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-gray-600 text-sm">Used merge tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.settings.mergeTags.map((tag) => (
                        <Badge key={tag.key} variant="secondary" className="text-xs">
                          {`{{${tag.key}}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 overflow-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">Generated {exportFormat.toUpperCase()} Code</h3>
                    <Badge variant="outline">
                      {generatedCode.length.toLocaleString()} characters
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? <CheckCircle className="w-4 h-4 mr-1 text-green-600" /> : <Copy className="w-4 h-4 mr-1" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <Textarea
                  value={generatedCode}
                  readOnly
                  rows={20}
                  className="font-mono text-xs resize-none"
                />
              </div>
            </TabsContent>

            <TabsContent value="esp" className="flex-1 overflow-auto space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Service Provider
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Target ESP</Label>
                    <Select value={selectedESP} onValueChange={setSelectedESP}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {emailServiceProviders.map((esp) => (
                          <SelectItem key={esp.id} value={esp.id}>
                            {esp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedESP !== 'none' && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <Globe className="w-4 h-4 inline mr-1" />
                        Merge tags will be converted to {emailServiceProviders.find(esp => esp.id === selectedESP)?.name} format.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Integration Instructions</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  {selectedESP === 'mailchimp' && (
                    <div className="space-y-2">
                      <p>1. Copy the generated HTML code</p>
                      <p>2. In Mailchimp, create a new campaign</p>
                      <p>3. Choose "Code your own" template option</p>
                      <p>4. Paste the HTML code in the editor</p>
                      <p>5. Test and send your campaign</p>
                    </div>
                  )}
                  {selectedESP === 'none' && (
                    <p className="text-gray-600">Select an ESP above for specific integration instructions.</p>
                  )}
                  {selectedESP !== 'none' && selectedESP !== 'mailchimp' && (
                    <p className="text-gray-600">Import the generated HTML into your {emailServiceProviders.find(esp => esp.id === selectedESP)?.name} campaign editor.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download {exportFormat.toUpperCase()}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}