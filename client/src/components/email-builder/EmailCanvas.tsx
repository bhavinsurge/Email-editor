import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { EmailBuilderComponent } from "./EmailBuilder";

interface EmailCanvasProps {
  template?: any;
  onTemplateChange?: (template: any) => void;
}

export interface EmailCanvasRef {
  getHtml: () => string;
  loadTemplate: (template: any) => void;
  getTemplate: () => any;
}

export const EmailCanvas = forwardRef<EmailCanvasRef, EmailCanvasProps>(
  ({ template, onTemplateChange }, ref) => {
    const builderRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      getHtml: () => builderRef.current?.getHtml() || '',
      loadTemplate: (template: any) => builderRef.current?.loadTemplate(template),
      getTemplate: () => builderRef.current?.getTemplate() || null,
    }));

    return (
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <EmailBuilderComponent
            ref={builderRef}
            initialTemplate={template}
            onTemplateChange={onTemplateChange}
          />
        </div>
      </div>
    );
  }
);

EmailCanvas.displayName = "EmailCanvas";
