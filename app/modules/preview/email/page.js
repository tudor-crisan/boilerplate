"use client";
import { useState, useMemo, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import emailTemplates from '@/lists/emailTemplates';
import Select from '@/components/select/Select';
import Label from "@/components/common/Label";
import { useStyling } from "@/context/ContextStyling";

const { MagicLinkTemplate, WeeklyDigestTemplate } = emailTemplates;

const TEMPLATES = {
  'Magic Link': (data, styling) => <MagicLinkTemplate host={data.host} url={data.url} styling={styling} />,
  'Weekly Digest': (data, styling) => <WeeklyDigestTemplate styling={styling} baseUrl={data.baseUrl} userName="John Doe" boards={[
    { name: "Product Feedback", stats: { views: 123, posts: 12, votes: 45, comments: 8 } },
    { name: "Feature Requests", stats: { views: 456, posts: 23, votes: 89, comments: 15 } }
  ]} />
};

export default function EmailPreviewPage() {
  const { styling } = useStyling();
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
      url: 'https://' + host + '/',
      baseUrl: typeof window !== 'undefined' ? window.location.protocol + '//' + host : 'https://' + host
    };

    try {
      const markup = renderToStaticMarkup(Component(data, styling));
      return `<!DOCTYPE html>${markup}`;
    } catch (e) {
      console.error(e);
      return `Error rendering template: ${e.message}`;
    }
  }, [selectedTemplate, host, styling]);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-base-100 pb-4 pt-2 mx-auto w-1/2 sm:w-1/3">
        <Label>
          Email preview
        </Label>
        <Select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          options={Object.keys(TEMPLATES)}
          withNavigation={true}
        />
      </div>
      <div className="flex-1 bg-base-100">
        <iframe
          srcDoc={html}
          className="w-full h-full border-0"
          title="Email Preview"
        />
      </div>
    </div>
  );
}
