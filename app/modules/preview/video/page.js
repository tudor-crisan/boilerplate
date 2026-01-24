"use client";

import Button from "@/components/button/Button";
import FilterBar from "@/components/common/FilterBar";
import Grid from "@/components/common/Grid";
import Label from "@/components/common/Label";
import Loading from "@/components/common/Loading";
import Modal from "@/components/common/Modal";
import Paragraph from "@/components/common/Paragraph";
import ProgressBar from "@/components/common/ProgressBar";
import TextSmall from "@/components/common/TextSmall";
import Title from "@/components/common/Title";
import Input from "@/components/input/Input";
import Select from "@/components/select/Select";
import SvgEdit from "@/components/svg/SvgEdit";
import SvgTrash from "@/components/svg/SvgTrash";
import SvgView from "@/components/svg/SvgView";
import Textarea from "@/components/textarea/Textarea";
import VideoContainer from "@/components/video/VideoContainer";
import { useStyling } from "@/context/ContextStyling";
import { toast } from "@/libs/toast";
import { formattedDate } from "@/libs/utils.client";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFormat, setFilterFormat] = useState("all"); // "all", "16:9", "9:16"
  const [sortBy, setSortBy] = useState("date_desc"); // "date_desc", "date_asc", "name_asc"

  const [editingVideo, setEditingVideo] = useState(null); // null = create mode
  const [formData, setFormData] = useState({
    title: "",
    format: "16:9",
    width: 1920,
    height: 1080,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  // Exports Modal State
  const [isExportsModalOpen, setIsExportsModalOpen] = useState(false);
  const [currentExports, setCurrentExports] = useState([]);
  const [fetchingExports, setFetchingExports] = useState(false);
  const [isDeleteExportModalOpen, setIsDeleteExportModalOpen] = useState(false);
  const [exportToDelete, setExportToDelete] = useState(null);
  const [isDeletingExport, setIsDeletingExport] = useState(false);

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
    } catch {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get video data for an app (now uses local state)
  const getAppVideos = () => {
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
      youtubeTitle: video.youtubeTitle || "",
      youtubeDescription: video.youtubeDescription || "",
      xLaunchTweet: video.xLaunchTweet || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) return toast.error("Title is required");

    startTransition(async () => {
      // Default initial slide if none exist
      const defaultSlides = [
        {
          type: "title",
          title: formData.title,
          subtitle: "New Video",
          bg: "bg-neutral",
          animation: "fade",
        },
      ];

      const newVideo = {
        ...(editingVideo || {}),
        id: editingVideo?.id || `video-${Date.now()}`,
        createdAt: editingVideo?.createdAt || new Date().toISOString(),
        ...formData,
        slides:
          editingVideo?.slides && editingVideo.slides.length > 0
            ? editingVideo.slides
            : defaultSlides,
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
            // Prepend new video
            return [newVideo, ...prev];
          });
          setIsModalOpen(false);
        } else {
          toast.error(data.error || "Failed to save video");
        }
      } catch {
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
      } catch {
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

  // State for exports
  const [activeExport, setActiveExport] = useState(null);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [startingExport, setStartingExport] = useState(false);

  // Polling for active exports (Only if export is running)
  // Streaming for active exports
  useEffect(() => {
    let eventSource;

    if (isExportsModalOpen && activeExport && currentVideoId) {
      console.log("Connecting to export stream...");
      eventSource = new EventSource(
        `/api/video/exports/stream?videoId=${currentVideoId}`,
      );

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setActiveExport(data);

          if (data.phase === "finished" || data.phase === "error") {
            // Refresh list to show new file (or error state)
            fetchExports(currentVideoId, true);

            // If finished, we can stop the active state after a brief moment
            // or just let the user see "100% finished"
            if (data.phase === "finished") {
              // Keep showing finished state briefly or just close stream?
              // The stream on server keeps going, but we can close client side.
              // Actually, if we close stream, activeExport remains as last state.
              eventSource.close();
              // Optionally start a timeout to clear activeExport if desired
            }
          }
        } catch (e) {
          console.error("Stream parse error", e);
        }
      };

      eventSource.onerror = (e) => {
        console.error("Stream error", e);
        eventSource.close();
      };
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isExportsModalOpen, activeExport?.phase, currentVideoId, activeExport]); // depend on phase to re-evaluate completion logic if needed, or just activeExport existence

  const fetchExports = async (videoId, silent = false) => {
    if (!silent) setFetchingExports(true);
    try {
      const res = await fetch(`/api/video/exports?videoId=${videoId}`);
      const data = await res.json();
      if (data.success) {
        setCurrentExports(data.exports);
        setActiveExport(data.activeExport || null);
      }
    } catch {
      if (!silent) toast.error("Failed to load exports");
    } finally {
      if (!silent) setFetchingExports(false);
    }
  };

  const handleStartExport = async () => {
    if (!currentVideoId) return;
    setStartingExport(true);
    try {
      const res = await fetch("/api/video/export", {
        method: "POST",
        body: JSON.stringify({ videoId: currentVideoId, styling }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Export started");
        // Set active export state immediately to trigger stream connection
        setActiveExport({
          phase: "starting",
          percent: 0,
          message: "Initializing...",
        });
        setStartingExport(false);
      } else {
        toast.error(data.error || "Failed to start export");
      }
    } catch {
      toast.error("Network error");
      setStartingExport(false);
    }
  };

  const handleViewVideo = (video) => {
    router.push(`${pathname}?appId=${video.appId || ""}&videoId=${video.id}`);
  };

  const handleViewExports = (e, videoId) => {
    e.stopPropagation();
    setCurrentVideoId(videoId);
    setIsExportsModalOpen(true);
    // Fetch immediately
    fetchExports(videoId);
  };

  const handleDeleteExportClick = (e, file) => {
    e.stopPropagation();
    setExportToDelete(file);
    setIsDeleteExportModalOpen(true);
  };

  const handleConfirmDeleteExport = async () => {
    if (!exportToDelete) return;

    setIsDeletingExport(true);
    try {
      const res = await fetch(
        `/api/video/exports?filename=${exportToDelete.filename}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (data.success) {
        setCurrentExports((prev) =>
          prev.filter((e) => e.filename !== exportToDelete.filename),
        );
        toast.success("Export deleted");
        setIsDeleteExportModalOpen(false);
        setExportToDelete(null);
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsDeletingExport(false);
    }
  };

  // If a video is selected and found, render the player
  if (activeVideo) {
    return (
      <div className="relative min-h-screen bg-base-200">
        <VideoContainer key={activeVideo.id} video={activeVideo} />
      </div>
    );
  }

  // Get list of apps that have video modules
  const appsWithVideo = Object.keys(applications).filter((appId) => {
    const config = applications[appId];
    return config.video && (config.video.override || config.video.default);
  });

  // Determine available videos (merging all apps)
  const allVideos = appsWithVideo.flatMap((appId) =>
    getAppVideos(appId).map((v) => ({ ...v, appId })),
  );

  // Filter Logic
  const filteredVideos = allVideos
    .filter((video) => {
      // Search
      if (
        searchQuery &&
        !video.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Filter
      if (filterFormat !== "all" && video.format !== filterFormat) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date_desc") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "date_asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "name_asc") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <>
      <div
        className={`min-h-screen bg-base-200 px-4 ${styling.general.section_padding || ""}`}
      >
        <div className={styling.general.container}>
          <div className="text-center mb-8 relative space-y-2">
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

          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <FilterBar
                search={searchQuery}
                setSearch={setSearchQuery}
                sort={sortBy}
                setSort={setSortBy}
                sortOptions={[
                  { label: "Newest First", value: "date_desc" },
                  { label: "Oldest First", value: "date_asc" },
                  { label: "Name (A-Z)", value: "name_asc" },
                ]}
                placeholder="Search videos..."
                className="mb-0!" // override default mb-6
                disabled={isLoading}
              />
            </div>
            <div className="w-full md:w-48 shrink-0">
              <Select
                options={[
                  { label: "All Formats", value: "all" },
                  { label: "Landscape (16:9)", value: "16:9" },
                  { label: "Portrait (9:16)", value: "9:16" },
                ]}
                value={filterFormat}
                onChange={(e) => setFilterFormat(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
          </div>

          {appsWithVideo.length === 0 && (
            <div className="alert alert-warning">
              No applications found with video module configuration.
            </div>
          )}

          {isLoading ? (
            <div className={`py-20 flex justify-center ${styling.flex.center}`}>
              <Loading text="Loading videos ..." />
            </div>
          ) : (
            <div className="space-y-12">
              <div>
                <Title
                  tag="h2"
                  className={`text-2xl font-bold capitalize mb-4 border-b border-base-300 pb-2 ${styling.components.header}`}
                >
                  All Videos ({filteredVideos.length})
                </Title>

                <Grid>
                  {filteredVideos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => handleViewVideo(video)}
                      className={`${styling.components.card} cursor-pointer hover:scale-[1.02] transition-transform group relative`}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="card-body">
                        <div className="flex justify-between items-start mb-2 pr-6">
                          <Title
                            tag="h3"
                            className="card-title text-primary text-lg"
                          >
                            {video.title}
                          </Title>
                        </div>

                        <div
                          className={`${styling?.components?.element || ""} badge badge-outline`}
                        >
                          {video.format}
                        </div>

                        <TextSmall className="mt-2 text-base-content/60 flex items-center gap-1 flex-wrap">
                          <span>{video.slides?.length || 0} slides</span>
                          <span>•</span>
                          <span>
                            {video.width}x{video.height}
                          </span>
                        </TextSmall>
                        <TextSmall className="text-[10px] opacity-40 font-mono mt-1 block">
                          {formattedDate(video.createdAt)}
                        </TextSmall>

                        <div className="flex justify-end">
                          <Button
                            size="btn-sm"
                            variant="btn-outline join-item"
                            onClick={(e) => handleViewExports(e, video.id)}
                          >
                            Exports
                          </Button>
                        </div>

                        {/* Edit/Delete Actions - Always Visible */}
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            onClick={() => handleViewVideo(video)}
                            variant="btn-ghost btn-square"
                            size="btn-xs"
                            className="bg-base-100/80"
                            title="View"
                          >
                            <SvgView />
                          </Button>
                          <Button
                            onClick={(e) => handleOpenEdit(e, video)}
                            variant="btn-ghost btn-square"
                            size="btn-xs"
                            className="bg-base-100/80"
                            title="Edit"
                          >
                            <SvgEdit />
                          </Button>
                          <Button
                            onClick={(e) => handleDeleteClick(e, video.id)}
                            variant="btn-ghost btn-square"
                            size="btn-xs"
                            className="bg-base-100/80 text-error"
                            title="Delete"
                          >
                            <SvgTrash />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </Grid>
                {filteredVideos.length === 0 && (
                  <div className="text-center py-8">
                    <Paragraph>No videos match your filters.</Paragraph>
                  </div>
                )}
              </div>
            </div>
          )}
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
          <div className="divider">Metadata</div>

          <div>
            <Label className="mb-2">YouTube Title</Label>
            <Input
              value={formData.youtubeTitle || ""}
              onChange={(e) =>
                setFormData({ ...formData, youtubeTitle: e.target.value })
              }
              placeholder="Video Title for YouTube"
            />
          </div>

          <div>
            <Label className="mb-2">YouTube Description</Label>
            <Textarea
              className="w-full h-24"
              value={formData.youtubeDescription || ""}
              onChange={(e) =>
                setFormData({ ...formData, youtubeDescription: e.target.value })
              }
              placeholder="Video Description"
            />
          </div>

          <div>
            <Label className="mb-2">X Launch Tweet</Label>
            <Textarea
              className="w-full h-24"
              value={formData.xLaunchTweet || ""}
              onChange={(e) =>
                setFormData({ ...formData, xLaunchTweet: e.target.value })
              }
              placeholder="Draft your launch tweet..."
            />
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

      {/* View Exports Modal */}
      <Modal
        isModalOpen={isExportsModalOpen}
        onClose={() => {
          // Pause all videos inside the modal before closing
          const modalVideos = document.querySelectorAll(".exports-modal-video");
          modalVideos.forEach((v) => v.pause());
          setIsExportsModalOpen(false);
        }}
        title="Exported Videos"
        boxClassName="max-w-4xl"
      >
        <div className={`${styling.components.element} mb-6 p-4 bg-base-100`}>
          {activeExport ? (
            <div className="w-full">
              <div className="flex justify-between mb-2">
                <TextSmall className="font-bold">Exporting...</TextSmall>
                <TextSmall className="opacity-70">
                  {activeExport.phase}
                </TextSmall>
              </div>
              <ProgressBar
                value={activeExport.percent}
                max={100}
                color="primary"
              />
              <div className="flex justify-between mt-1">
                <TextSmall>{activeExport.message}</TextSmall>
                <TextSmall className="font-bold">
                  {activeExport.percent}%
                </TextSmall>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <Label className="font-bold text-base mb-1 block">
                  Create New Export
                </Label>
                <TextSmall className="opacity-60 pr-4">
                  Generate a new MP4 file for this video.
                </TextSmall>
              </div>
              <Button
                variant="btn-primary"
                onClick={handleStartExport}
                isLoading={startingExport}
                disabled={startingExport}
              >
                Start New Export
              </Button>
            </div>
          )}
        </div>

        {fetchingExports ? (
          <div className="flex justify-center py-8">
            <Loading text="Loading exports..." />
          </div>
        ) : currentExports.length === 0 ? (
          <div className="text-center py-8 text-base-content/60">
            {activeExport ? (
              <TextSmall>
                Export in progress... Your new video will appear here shortly.
              </TextSmall>
            ) : (
              <>
                <Paragraph>No exports found for this video.</Paragraph>
                <TextSmall>Click &quot;Start New Export&quot; to create one.</TextSmall>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {currentExports.map((file) => (
              <div
                key={file.filename}
                className={`${styling.components.card} p-4 bg-base-200`}
              >
                {/* Video Player Container */}
                <div
                  className={`${styling.components.card} bg-black overflow-hidden flex justify-center items-center mb-4`}
                >
                  <video
                    controls
                    className="max-h-[60vh] w-auto mx-auto exports-modal-video"
                    src={file.path}
                  />
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center">
                  <div>
                    <TextSmall className="font-bold">{file.filename}</TextSmall>
                    <TextSmall className="opacity-60 text-xs">
                      {formattedDate(file.createdAt)} •{" "}
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </TextSmall>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      href={file.path}
                      download
                      size="btn-sm"
                      variant="btn-outline"
                      target="_blank"
                    >
                      Download
                    </Button>
                    <Button
                      size="btn-sm"
                      variant="btn-square btn-ghost text-error"
                      onClick={(e) => handleDeleteExportClick(e, file)}
                      title="Delete"
                    >
                      <SvgTrash className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete Export Confirmation Modal */}
      <Modal
        isModalOpen={isDeleteExportModalOpen}
        onClose={() => setIsDeleteExportModalOpen(false)}
        title="Delete Export"
        contentClassName="p-0! pb-2!"
        actions={
          <>
            <Button
              className="btn-ghost"
              onClick={() => setIsDeleteExportModalOpen(false)}
              disabled={isDeletingExport}
            >
              Cancel
            </Button>
            <Button
              variant="btn-error btn-outline"
              onClick={handleConfirmDeleteExport}
              isLoading={isDeletingExport}
            >
              Delete
            </Button>
          </>
        }
      >
        <Paragraph className={`${styling.general.element} text-center`}>
          Are you sure you want to delete this export? This action cannot be
          undone.
        </Paragraph>
      </Modal>
    </>
  );
}
