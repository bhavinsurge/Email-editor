import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ComponentLibrary } from "@/components/email-builder/ComponentLibrary";
import { EmailCanvas, EmailCanvasRef } from "@/components/email-builder/EmailCanvas";
import { PropertiesPanel } from "@/components/email-builder/PropertiesPanel";
import { EditorToolbar } from "@/components/email-builder/EditorToolbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { EmailTemplate } from "@shared/schema";

export default function EmailBuilderPage() {
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [templateName, setTemplateName] = useState("Untitled Template");
  const [currentView, setCurrentView] = useState<'design' | 'preview' | 'code'>('design');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("html-inline");
  const [exportedHtml, setExportedHtml] = useState("");
  
  const canvasRef = useRef<EmailCanvasRef>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch templates
  const { data: templates = [], isLoading } = useQuery<EmailTemplate[]>({
    queryKey: ['/api/templates'],
  });

  // Save template mutation
  const saveTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      if (currentTemplate?.id) {
        return apiRequest('PUT', `/api/templates/${currentTemplate.id}`, templateData);
      } else {
        return apiRequest('POST', '/api/templates', templateData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({
        title: "Success",
        description: "Template saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    },
  });

  // Export template mutation
  const exportTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const response = await apiRequest('POST', `/api/templates/${templateId}/export`);
      return response.json();
    },
    onSuccess: (data) => {
      setExportedHtml(data.html);
      setShowExportModal(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to export template",
        variant: "destructive",
      });
    },
  });

  const handleNewTemplate = () => {
    setCurrentTemplate(null);
    setTemplateName("Untitled Template");
    canvasRef.current?.loadTemplate({
      components: [],
      styles: {}
    });
  };

  const handleLoadTemplate = () => {
    // For now, just load the first available template
    if (templates.length > 0) {
      const template = templates[0];
      setCurrentTemplate(template);
      setTemplateName(template.name);
      canvasRef.current?.loadTemplate(template.content);
    }
  };

  const handleSave = async () => {
    try {
      const template = canvasRef.current?.getTemplate();
      if (!template) return;

      const templateData = {
        name: templateName,
        subject: templateName,
        content: template,
        htmlContent: canvasRef.current?.getHtml() || '',
      };

      saveTemplateMutation.mutate(templateData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    if (currentTemplate?.id) {
      exportTemplateMutation.mutate(currentTemplate.id);
    } else {
      // Generate HTML for unsaved template
      const html = canvasRef.current?.getHtml() || '';
      setExportedHtml(html);
      setShowExportModal(true);
    }
  };

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(exportedHtml);
      toast({
        title: "Success",
        description: "HTML copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to copy HTML",
        variant: "destructive",
      });
    }
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([exportedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${templateName.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleTemplateChange = (template: any) => {
    setCurrentTemplate({ ...currentTemplate, content: template });
  };

  const handleComponentUpdate = (componentId: string, updates: any) => {
    // This would typically update the component in the email builder
    console.log('Update component:', componentId, updates);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading email builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left Sidebar - Component Library */}
      <ComponentLibrary
        onNewTemplate={handleNewTemplate}
        onLoadTemplate={handleLoadTemplate}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <EditorToolbar
          templateName={templateName}
          onTemplateNameChange={setTemplateName}
          onSave={handleSave}
          onExport={handleExport}
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        {/* Editor Content Area */}
        <div className="flex-1 flex">
          {/* Canvas Area */}
          <EmailCanvas
            ref={canvasRef}
            template={currentTemplate?.content}
            onTemplateChange={handleTemplateChange}
          />

          {/* Right Properties Panel */}
          <PropertiesPanel
            selectedComponent={selectedComponent}
            onComponentUpdate={handleComponentUpdate}
          />
        </div>
      </div>

      {/* Export Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export Email HTML</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html-inline">HTML with inline CSS</SelectItem>
                  <SelectItem value="html-embedded">HTML with embedded CSS</SelectItem>
                  <SelectItem value="html-only">HTML only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTML Preview
              </label>
              <Textarea
                value={exportedHtml}
                readOnly
                rows={12}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCopyHtml}>
              Copy to Clipboard
            </Button>
            <div className="space-x-3">
              <Button variant="outline" onClick={() => setShowExportModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleDownloadHtml} className="bg-blue-600 hover:bg-blue-700">
                Download HTML
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
