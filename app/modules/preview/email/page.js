"use client";
import Button from "@/components/button/Button";
import Label from "@/components/common/Label";
import Tooltip from "@/components/common/Tooltip";
import { getEmailBranding } from "@/components/emails/email-theme";
import Input from "@/components/input/Input";
import Select from "@/components/select/Select";
import { useStyling } from "@/context/ContextStyling";
import useApiRequest from "@/hooks/useApiRequest";
import { clientApi } from "@/libs/api";
import { defaultSetting as settings } from "@/libs/defaults";
import { toast } from "@/libs/toast";
import emailTemplates from "@/lists/emailTemplates";
import { useEffect, useMemo, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useSession } from "next-auth/react";

const { QuickLinkTemplate, WeeklyDigestTemplate } = emailTemplates;

const MOCK_BOARDS = [
  {
    name: "Product Feedback",
    stats: { views: 123, posts: 12, votes: 45, comments: 8 },
  },
  {
    name: "Feature Requests",
    stats: { views: 456, posts: 23, votes: 89, comments: 15 },
  },
];

const TEMPLATES = {
  "Quick Link": {
    component: (data, styling) => (
      <QuickLinkTemplate host={data.host} url={data.url} styling={styling} />
    ),
    subject: (data, styling) =>
      `Sign in to ${getEmailBranding(styling).appName}`,
  },
  "Weekly Digest": {
    component: (data, styling) => (
      <WeeklyDigestTemplate
        styling={styling}
        baseUrl={data.baseUrl}
        userName={data.userName}
        boards={data.boards}
      />
    ),
    subject: () => "Your Weekly Board Stats 📈",
  },
};

export default function EmailPreviewPage() {
  const { styling } = useStyling();
  const { data: session } = useSession();
  const [selectedTemplate, setSelectedTemplate] = useState("Quick Link");
  const [host, setHost] = useState("/");

  const { loading: isSending, request } = useApiRequest();

  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setHost(window.location.host);
    setMounted(true);
    setCurrentTime(new Date().toLocaleTimeString());
  }, []);

  const data = useMemo(
    () => ({
      host: host,
      url: "https://" + host + "/",
      baseUrl:
        typeof window !== "undefined"
          ? window.location.protocol + "//" + host
          : "https://" + host,
      // Add mock data here so it is available for both preview and API
      userName: "John Doe",
      boards: MOCK_BOARDS,
    }),
    [host],
  );
  const html = useMemo(() => {
    const template = TEMPLATES[selectedTemplate];
    if (!template) return "";

    try {
      const markup = renderToStaticMarkup(template.component(data, styling));
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

  const testSubject = useMemo(() => {
    const template = TEMPLATES[selectedTemplate];
    if (!template) return "";
    const timePrefix = mounted ? `[TEST ${currentTime}] ` : "[TEST] ";
    return timePrefix + template.subject(data, styling);
  }, [selectedTemplate, data, styling, mounted, currentTime]);

  const handleSendTestEmail = () => {
    if (!session?.user?.email) {
      toast.error("You must be logged in to send a test email");
      return;
    }

    request(
      async () => {
        return await clientApi.post(settings.paths.api.resendTestEmail, {
          template: selectedTemplate,
          data: data,
          styling: styling,
        });
      },
      {
        showToast: false,
        onSuccess: () => {
          toast.success("Test email successfully sent");
        },
      },
    );
  };

  return (
    <div className={`h-screen ${styling.flex.col} sm:flex-row`}>
      <div
        className={`bg-base-100 px-0 sm:px-4 pb-4 pt-6 mx-auto max-w-88 flex flex-row sm:flex-col gap-4`}
      >
        <div className="flex-1 w-full">
          <Label>Email preview</Label>
          <Select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            options={Object.keys(TEMPLATES)}
            withNavigation={true}
          />
        </div>
        <div className="flex-1 p-2 sm:p-2 max-h-32 sm:max-h-24">
          <Label>Send Test Email</Label>
          <div className={` ${styling.flex.col} sm:flex-row gap-2 items-end`}>
            <div className="flex-1">
              <Tooltip text="Email cannot be changed">
                <Input
                  value={session?.user?.email || "Not logged in"}
                  disabled={true}
                  className="w-full"
                />
              </Tooltip>
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
      <div className={`flex-1 bg-base-100 ${styling.flex.col}`}>
        <div className="p-4 border-b border-base-200 bg-base-200/50">
          <p className="text-sm font-medium opacity-70 mb-1">Subject:</p>
          <p className="font-semibold">{testSubject}</p>
        </div>
        <div className="flex-1">
          <iframe
            srcDoc={html}
            className="w-full h-full border-0"
            title="Email Preview"
          />
        </div>
      </div>
    </div>
  );
}
