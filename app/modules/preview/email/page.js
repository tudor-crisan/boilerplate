"use client";
import { useState, useMemo, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import emailTemplates from '@/lists/emailTemplates';
import Select from '@/components/select/Select';
import Label from "@/components/common/Label";
import { useStyling } from "@/context/ContextStyling";
import Input from "@/components/input/Input";
import Button from "@/components/button/Button";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import useApiRequest from "@/hooks/useApiRequest";
import { clientApi } from "@/libs/api";
import { defaultSetting as settings } from "@/libs/defaults";

const { QuickLinkTemplate, WeeklyDigestTemplate } = emailTemplates;

const MOCK_BOARDS = [
  { name: "Product Feedback", stats: { views: 123, posts: 12, votes: 45, comments: 8 } },
  { name: "Feature Requests", stats: { views: 456, posts: 23, votes: 89, comments: 15 } }
];

const TEMPLATES = {
  'Quick Link': (data, styling) => <QuickLinkTemplate host={data.host} url={data.url} styling={styling} />,
  'Weekly Digest': (data, styling) => <WeeklyDigestTemplate styling={styling} baseUrl={data.baseUrl} userName={data.userName} boards={data.boards} />
};

export default function EmailPreviewPage() {
  const { styling } = useStyling();
  const { data: session } = useSession();
  const [selectedTemplate, setSelectedTemplate] = useState('Quick Link');
  const [host, setHost] = useState('/');

  const { loading: isSending, request } = useApiRequest();

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  const data = useMemo(() => ({
    host: host,
    url: 'https://' + host + '/',
    baseUrl: typeof window !== 'undefined' ? window.location.protocol + '//' + host : 'https://' + host,
    // Add mock data here so it is available for both preview and API
    userName: "John Doe",
    boards: MOCK_BOARDS
  }), [host]);

  const html = useMemo(() => {
    const Component = TEMPLATES[selectedTemplate];
    if (!Component) return '';

    try {
      const markup = renderToStaticMarkup(Component(data, styling));
      // Inject styles to disable interactions in the preview
      const previewStyles = `
        <style>
          a, button {
            pointer-events: none !important;
            cursor: default !important;
          }
        </style>
      `;
      return `<!DOCTYPE html>${previewStyles}${markup}`;
    } catch (e) {
      console.error(e);
      return `Error rendering template: ${e.message}`;
    }
  }, [selectedTemplate, data, styling]);

  const handleSendTestEmail = () => {
    if (!session?.user?.email) {
      toast.error("You must be logged in to send a test email");
      return;
    }

    request(async () => {
      return await clientApi.post(settings.paths.api.resendTestEmail, {
        template: selectedTemplate,
        data: data,
        styling: styling
      });
    }, {
      showToast: false,
      onSuccess: (msg, result) => {
        toast.success("Test email successfully sent");
      }
    });
  };

  return (
    <div className="h-screen flex flex-col sm:flex-row">
      <div className="bg-base-100 px-0 sm:px-4 pb-4 pt-6 mx-auto max-w-88 flex flex-row sm:flex-col gap-4">
        <div className="flex-1 w-full">
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
        <div className="flex-1 p-2 sm:p-2 max-h-32 sm:max-h-24">
          <Label>Send Test Email</Label>
          <div className=" flex flex-col sm:flex-row gap-2 items-end">
            <div className="flex-1">
              <Input
                value={session?.user?.email || "Not logged in"}
                disabled={true}
                className="w-full"
              />
            </div>
            <Button
              onClick={handleSendTestEmail}
              isLoading={isSending}
              disabled={!session?.user?.email}
              className="w-full sm:w-auto"
            >
              Send
            </Button>
          </div>
        </div>
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
