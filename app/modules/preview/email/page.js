"use client";
import { useState, useMemo, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import emailTemplates from '@/lists/emailTemplates';
import Select from '@/components/select/Select';
import Label from "@/components/common/Label";

const { MagicLinkTemplate } = emailTemplates;

const TEMPLATES = {
  'Magic Link': (data) => <MagicLinkTemplate host={data.host} url={data.url} />,
};

export default function EmailPreviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('Magic Link');
  const [host, setHost] = useState('/');

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  const html = useMemo(() => {
    const Component = TEMPLATES[selectedTemplate];
    if (!Component) return '';

    // Choose mock data based on template roughly, or just use generic mocks
    // For now we only have Magic Link
    const data = {
      host: host,
      url: 'https://' + host + '/'
    };

    try {
      const markup = renderToStaticMarkup(Component(data));
      return `<!DOCTYPE html>${markup}`;
    } catch (e) {
      console.error(e);
      return `Error rendering template: ${e.message}`;
    }
  }, [selectedTemplate, host]);

  return (
    <div className="min-h-screen flex flex-col h-screen">
      <div className="bg-base-100 p-4 flex flex-col items-center gap-1">
        <Label>
          Email Preview
        </Label>
        <Select
          className="select-sm w-full max-w-xs"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          options={Object.keys(TEMPLATES)}
        />
      </div>
      <div className="flex-1 bg-base-100 px-0 py-2 sm:px-8 sm:py-4 overflow-hidden relative">
        <iframe
          srcDoc={html}
          className="w-full h-full border-0"
          title="Email Preview"
        />
      </div>
    </div>
  );
}
