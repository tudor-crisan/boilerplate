"use client";

import Button from "@/components/button/Button";
import Grid from "@/components/common/Grid";
import Label from "@/components/common/Label";
import Modal from "@/components/common/Modal";
import Paragraph from "@/components/common/Paragraph";
import TextSmall from "@/components/common/TextSmall";
import Title from "@/components/common/Title";
import Input from "@/components/input/Input";
import Select from "@/components/select/Select";
import VideoContainer from "@/components/video/VideoContainer";
import { useStyling } from "@/context/ContextStyling";
import { toast } from "@/libs/toast";
import applications from "@/lists/applications";
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function VideoModulePage() {
  const { styling } = useStyling();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const selectedAppId = searchParams.get("appId");
  const selectedVideoId = searchParams.get("videoId");

  const [videos, setVideos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null); // null = create mode
  const [formData, setFormData] = useState({
    title: "",
    format: "16:9",
    width: 1920,
    height: 1080,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/video");
      const data = await res.json();
      if (data.success) {
        setVideos(data.videos || []);
      } else {
        toast.error(data.error || "Failed to load videos");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  // Helper to get video data for an app (now uses local state)
  const getAppVideos = (appId) => {
    // We assume all videos belong to the current context for now,
    // or filtering based on some criteria if needed.
    // The original code filtered by 'videos[videoKey]', but since we only have one file/list
    // we'll use the fetched 'videos' state for the 'loyalboards' app
    // or any app that uses this module.
    // Ideally we would filter by some 'appId' property if videos were shared,
    // but the task implies we are editing the 'loyalboards/video.json'.
    // So we return all videos for any app that has video enabled, as they likely share the source in this boilerplate.
    return videos;
  };

  // Find the selected video if params exist
  let activeVideo = null;
  if (selectedAppId && selectedVideoId) {
    activeVideo = videos.find((v) => v.id === selectedVideoId);
  }

  const handleOpenCreate = () => {
    setEditingVideo(null);
    setFormData({
      title: "",
      format: "16:9",
      width: 1920,
      height: 1080,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e, video) => {
    e.stopPropagation();
    setEditingVideo(video);
    setFormData({
      title: video.title,
      format: video.format,
      width: video.width,
      height: video.height,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) return toast.error("Title is required");

    startTransition(async () => {
      const newVideo = {
        ...(editingVideo || {}),
        id: editingVideo?.id || `video-${Date.now()}`,
        ...formData,
        slides: editingVideo?.slides || [], // Keep existing slides or empty
        music: editingVideo?.music || "",
        voVolume: editingVideo?.voVolume ?? 1,
        musicVolume: editingVideo?.musicVolume ?? 0.3,
      };

      try {
        const res = await fetch("/api/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newVideo),
        });
        const data = await res.json();

        if (data.success) {
          toast.success(editingVideo ? "Video updated" : "Video created");
          setVideos((prev) => {
            const idx = prev.findIndex((v) => v.id === newVideo.id);
            if (idx !== -1) {
              const next = [...prev];
              next[idx] = newVideo;
              return next;
            }
            return [...prev, newVideo];
          });
          setIsModalOpen(false);
        } else {
          toast.error(data.error || "Failed to save video");
        }
      } catch (error) {
        toast.error("Network error");
      }
    });
  };

  const handleDeleteClick = (e, videoId) => {
    e.stopPropagation();
    setVideoToDelete(videoId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!videoToDelete) return;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/video?id=${videoToDelete}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.success) {
          toast.success("Video deleted");
          setVideos((prev) => prev.filter((v) => v.id !== videoToDelete));
          if (selectedVideoId === videoToDelete) {
            router.push(pathname);
          }
          setIsDeleteModalOpen(false);
          setVideoToDelete(null);
        } else {
          toast.error(data.error || "Failed to delete video");
        }
      } catch (error) {
        toast.error("Network error");
      }
    });
  };

  const handleFormatChange = (e) => {
    const format = e.target.value;
    let width = 1920;
    let height = 1080;
    if (format === "9:16") {
      width = 1080;
      height = 1920;
    }
    setFormData((prev) => ({ ...prev, format, width, height }));
  };

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

  return (
    <>
      <div
        className={`min-h-screen bg-base-200 px-4 ${styling.general.section_padding || ""}`}
      >
        <div className={styling.general.container}>
          <div className="text-center mb-12 relative">
            <Title className={styling.section.title}>Video Generator</Title>
            <Paragraph className={styling.section.paragraph}>
              Select a video script to visualize and record, or create a new
              one.
            </Paragraph>
            <div className="mt-4">
              <Button onClick={handleOpenCreate} variant="btn-primary">
                + Create New Video
              </Button>
            </div>
          </div>

          {appsWithVideo.length === 0 && (
            <div className="alert alert-warning">
              No applications found with video module configuration.
            </div>
          )}

          <div className="space-y-12">
            {appsWithVideo.map((appId) => {
              const appVideos = getAppVideos(appId);
              // if (appVideos.length === 0) return null; // Update: Don't hide if empty, maybe user wants to create? But logic above relies on "appsWithVideo" keys.

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
                        className={`${styling.components.card} cursor-pointer hover:scale-[1.02] transition-transform group relative`}
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
                            {video.slides?.length || 0} slides • {video.width}x
                            {video.height}
                          </TextSmall>
                          <div className="card-actions justify-end mt-4">
                            <Button size="btn-sm" variant="btn-primary">
                              Launch Player
                            </Button>
                          </div>

                          {/* Edit/Delete Actions */}
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              onClick={(e) => handleOpenEdit(e, video)}
                              variant="btn-ghost btn-square"
                              size="btn-xs"
                              className="bg-base-100/80"
                              title="Edit"
                            >
                              ✏️
                            </Button>
                            <Button
                              onClick={(e) => handleDeleteClick(e, video.id)}
                              variant="btn-ghost btn-square"
                              size="btn-xs"
                              className="bg-base-100/80 text-error"
                              title="Delete"
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Grid>
                  {appVideos.length === 0 && (
                    <div className="text-center py-8">
                      <Paragraph>
                        No videos found. Create one to get started.
                      </Paragraph>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVideo ? "Edit Video" : "Create New Video"}
        actions={
          <div className="flex gap-2">
            <Button
              variant="btn-ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="btn-primary"
              onClick={handleSave}
              isLoading={isPending}
              disabled={isPending}
            >
              {editingVideo ? "Save Changes" : "Create Video"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <Label className="mb-2">Title</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Promo Video"
            />
          </div>
          <div>
            <Label className="mb-2">Format</Label>
            <Select
              className="w-full"
              value={formData.format}
              onChange={handleFormatChange}
              options={[
                { label: "Landscape (16:9)", value: "16:9" },
                { label: "Portrait (9:16)", value: "9:16" },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Width</Label>
              <Input
                type="number"
                value={formData.width}
                disabled={true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    width: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <Label className="mb-2">Height</Label>
              <Input
                type="number"
                value={formData.height}
                disabled={true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    height: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        contentClassName="p-0! pb-2!"
        actions={
          <>
            <Button
              className="btn-ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="btn-error btn-outline"
              onClick={handleConfirmDelete}
              isLoading={isPending}
            >
              Delete
            </Button>
          </>
        }
      >
        <Paragraph className={`${styling.general.element} text-center`}>
          Are you sure you want to delete this video?
        </Paragraph>
      </Modal>
    </>
  );
}
