import React, { useState, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EmailEditorCore, EmailEditorRef, EmailTemplate, MergeTag } from './EmailEditorCore';
import { ComponentSidebar } from './ComponentSidebar';
import { PropertiesEditor } from './PropertiesEditor';
import { EditorToolbar } from './EditorToolbar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface CustomEmailEditorProps {
  initialTemplate?: EmailTemplate;
  onTemplateChange?: (template: EmailTemplate) => void;
  onSave?: (template: EmailTemplate) => void;
  mergeTags?: MergeTag[];
  ampSupport?: boolean;
}

const defaultMergeTags: MergeTag[] = [
  { key: 'firstName', label: 'First Name', type: 'text', defaultValue: 'John' },
  { key: 'lastName', label: 'Last Name', type: 'text', defaultValue: 'Doe' },
  { key: 'email', label: 'Email Address', type: 'email', defaultValue: 'john@example.com' },
  { key: 'company', label: 'Company Name', type: 'text', defaultValue: 'Acme Corp' },
  { key: 'phone', label: 'Phone Number', type: 'text', defaultValue: '+1 (555) 123-4567' },
  { key: 'orderNumber', label: 'Order Number', type: 'text', defaultValue: '#12345' },
  { key: 'amount', label: 'Amount', type: 'number', defaultValue: '$99.99' },
  { key: 'productName', label: 'Product Name', type: 'text', defaultValue: 'Premium Package' },
  { key: 'websiteUrl', label: 'Website URL', type: 'url', defaultValue: 'https://example.com' }
];

export function CustomEmailEditor({ 
  initialTemplate, 
  onTemplateChange, 
  onSave,
  mergeTags = defaultMergeTags,
  ampSupport = true 
}: CustomEmailEditorProps) {
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | undefined>(initialTemplate);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'html' | 'amp'>('html');
  const [exportedContent, setExportedContent] = useState('');
  const [history, setHistory] = useState<EmailTemplate[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const editorRef = useRef<EmailEditorRef>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Save template mutation
  const saveTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      if (currentTemplate?.id && currentTemplate.id !== 'new') {
        return apiRequest('PUT', `/api/templates/${currentTemplate.id}`, templateData);
      } else {
        return apiRequest('POST', '/api/templates', templateData);
      }
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({
        title: "Success",
        description: "Template saved successfully",
      });
      // Update the current template with the saved ID
      if (response && response.id) {
        setCurrentTemplate(prev => prev ? { ...prev, id: response.id } : prev);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    },
  });

  // Handle template changes and history
  const handleTemplateChange = useCallback((template: EmailTemplate) => {
    setCurrentTemplate(template);
    onTemplateChange?.(template);
    
    // Add to history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(template);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [onTemplateChange, history, historyIndex]);

  // Undo/Redo functionality
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevTemplate = history[historyIndex - 1];
      setCurrentTemplate(prevTemplate);
      setHistoryIndex(historyIndex - 1);
      editorRef.current?.setTemplate(prevTemplate);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextTemplate = history[historyIndex + 1];
      setCurrentTemplate(nextTemplate);
      setHistoryIndex(historyIndex + 1);
      editorRef.current?.setTemplate(nextTemplate);
    }
  }, [history, historyIndex]);

  // Save functionality
  const handleSave = useCallback(async () => {
    if (!currentTemplate) return;
    
    try {
      const htmlContent = editorRef.current?.exportHtml() || '';
      
      const templateData = {
        name: currentTemplate.name,
        subject: currentTemplate.subject,
        content: currentTemplate,
        htmlContent: htmlContent,
      };

      if (onSave) {
        onSave(currentTemplate);
      } else {
        saveTemplateMutation.mutate(templateData);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  }, [currentTemplate, onSave, saveTemplateMutation, toast]);

  // Export functionality
  const handleExport = useCallback((format: 'html' | 'amp') => {
    if (!editorRef.current) return;
    
    let content = '';
    if (format === 'html') {
      content = editorRef.current.exportHtml();
    } else if (format === 'amp') {
      content = editorRef.current.exportAmp();
    }
    
    setExportFormat(format);
    setExportedContent(content);
    setShowExportModal(true);
  }, []);

  // Copy to clipboard
  const handleCopyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportedContent);
      toast({
        title: "Success",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  }, [exportedContent, toast]);

  // Download file
  const handleDownload = useCallback(() => {
    const blob = new Blob([exportedContent], { 
      type: exportFormat === 'html' ? 'text/html' : 'text/html' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentTemplate?.name || 'email-template'}.${exportFormat === 'amp' ? 'amp.html' : 'html'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [exportedContent, exportFormat, currentTemplate?.name]);

  // Handle component selection
  const handleComponentSelect = useCallback((componentId: string | null) => {
    setSelectedComponentId(componentId);
  }, []);

  // Get selected component
  const selectedComponent = currentTemplate?.components.find(c => c.id === selectedComponentId) || null;

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [handleSave, handleUndo, handleRedo]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left Sidebar - Components */}
      <ComponentSidebar 
        onAddComponent={(type) => editorRef.current?.addComponent(type)}
        mergeTags={mergeTags}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <EditorToolbar
          templateName={currentTemplate?.name}
          onTemplateNameChange={(name) => {
            if (currentTemplate) {
              const updatedTemplate = { ...currentTemplate, name };
              handleTemplateChange(updatedTemplate);
            }
          }}
          onSave={handleSave}
          onExportHtml={() => handleExport('html')}
          onExportAmp={() => handleExport('amp')}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          ampSupport={ampSupport}
          componentCount={currentTemplate?.components.length || 0}
        />

        {/* Editor Core */}
        <EmailEditorCore
          ref={editorRef}
          initialTemplate={currentTemplate}
          onTemplateChange={handleTemplateChange}
          mergeTags={mergeTags}
          ampSupport={ampSupport}
        />
      </div>

      {/* Right Sidebar - Properties */}
      <PropertiesEditor
        selectedComponent={selectedComponent}
        onUpdateComponent={(id, updates) => editorRef.current?.updateComponent(id, updates)}
        mergeTags={mergeTags}
      />

      {/* Export Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Export Email {exportFormat === 'amp' ? 'AMP' : 'HTML'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <Select value={exportFormat} onValueChange={(value: 'html' | 'amp') => {
                setExportFormat(value);
                handleExport(value);
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">HTML Email</SelectItem>
                  {ampSupport && <SelectItem value="amp">AMP Email</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Generated Code
              </label>
              <Textarea
                value={exportedContent}
                readOnly
                rows={15}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCopyToClipboard}>
              Copy to Clipboard
            </Button>
            <div className="space-x-3">
              <Button variant="outline" onClick={() => setShowExportModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                Download {exportFormat.toUpperCase()}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}