"use client";

import Button from "@/components/button/Button";
import Grid from "@/components/common/Grid";
import Paragraph from "@/components/common/Paragraph";
import TextSmall from "@/components/common/TextSmall";
import Title from "@/components/common/Title";
import VideoContainer from "@/components/video/VideoContainer";
import styling from "@/data/modules/styling.json";
import applications from "@/lists/applications";
import videos from "@/lists/videos";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function VideoModulePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedAppId = searchParams.get("appId");
  const selectedVideoId = searchParams.get("videoId");

  // Helper to get video data for an app
  const getAppVideos = (appId) => {
    const appConfig = applications[appId];
    if (!appConfig?.video) return [];

    // video key in lists/videos.js (e.g., loyalboards_video)
    const videoKey = appConfig.video.override || appConfig.video.default;
    const videoData = videos[videoKey];

    return videoData?.videos || [];
  };

  // Find the selected video if params exist
  let activeVideo = null;
  if (selectedAppId && selectedVideoId) {
    const appVideos = getAppVideos(selectedAppId);
    activeVideo = appVideos.find((v) => v.id === selectedVideoId);
  }

  // If a video is selected and found, render the player
  if (activeVideo) {
    return (
      <div className="relative min-h-screen bg-base-200">
        <VideoContainer video={activeVideo} />
      </div>
    );
  }

  // Get list of apps that have video modules
  const appsWithVideo = Object.keys(applications).filter((appId) => {
    const config = applications[appId];
    return config.video && (config.video.override || config.video.default);
  });

  // Dashboard / Gallery View
  return (
    <div
      className={`min-h-screen bg-base-200 px-4 ${styling.general.section_padding || ""}`}
    >
      <div className={styling.general.container}>
        <div className="text-center mb-12">
          <Title className={styling.section.title}>Video Generator</Title>
          <Paragraph className={styling.section.paragraph}>
            Select a video script to visualize and record.
          </Paragraph>
        </div>

        {appsWithVideo.length === 0 && (
          <div className="alert alert-warning">
            No applications found with video module configuration.
          </div>
        )}

        <div className="space-y-12">
          {appsWithVideo.map((appId) => {
            const appVideos = getAppVideos(appId);
            if (appVideos.length === 0) return null;

            return (
              <div key={appId}>
                <Title
                  tag="h2"
                  className={`text-2xl font-bold capitalize mb-4 border-b border-base-300 pb-2 ${styling.components.header}`}
                >
                  {appId}
                </Title>
                <Grid>
                  {appVideos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() =>
                        router.push(
                          `${pathname}?appId=${appId}&videoId=${video.id}`,
                        )
                      }
                      className={`${styling.components.card} cursor-pointer hover:scale-[1.02] transition-transform`}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="card-body">
                        <Title
                          tag="h3"
                          className="card-title text-primary text-lg"
                        >
                          {video.title}
                        </Title>
                        <div className="badge badge-outline">
                          {video.format}
                        </div>
                        <TextSmall className="mt-2 text-base-content/60">
                          {video.slides.length} slides • {video.width}x
                          {video.height}
                        </TextSmall>
                        <div className="card-actions justify-end mt-4">
                          <Button size="btn-sm" variant="btn-primary">
                            Launch Player
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </Grid>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
