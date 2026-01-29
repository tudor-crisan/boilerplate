"use client";

import Loading from "@/modules/general/components/common/Loading";
import { useStyling } from "@/modules/general/context/ContextStyling";
import VideoContainer from "@/modules/video/components/VideoContainer";
import VideoCreateEditModal from "@/modules/video/components/VideoCreateEditModal";
import VideoDeleteModal from "@/modules/video/components/VideoDeleteModal";
import VideoExportsModal from "@/modules/video/components/VideoExportsModal";
import VideoFilter from "@/modules/video/components/VideoFilter";
import VideoGrid from "@/modules/video/components/VideoGrid";
import VideoHeader from "@/modules/video/components/VideoHeader";
import useVideoManagement from "@/modules/video/hooks/useVideoManagement";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function VideoModulePage() {
  const { styling } = useStyling();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedAppId = searchParams.get("appId");
  const selectedVideoId = searchParams.get("videoId");

  // Logic Hook
  const {
    filteredVideos,
    isLoading,
    isPending,
    searchQuery,
    setSearchQuery,
    filterFormat,
    setFilterFormat,
    sortBy,
    setSortBy,
    handleSaveVideo,
    handleDeleteVideo,
    activeExport,
    currentExports,
    fetchingExports,
    fetchExports,
    handleStartExport,
    handleDeleteExport,
    startingExport,
    isDeletingExport,
    currentVideoId,
    setCurrentVideoId,
    videos,
  } = useVideoManagement();

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    format: "16:9",
    width: 1920,
    height: 1080,
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [videoIdToDelete, setVideoIdToDelete] = useState(null);

  const [isExportsModalOpen, setIsExportsModalOpen] = useState(false);
  const [isDeleteExportModalOpen, setIsDeleteExportModalOpen] = useState(false);
  const [exportToDelete, setExportToDelete] = useState(null);

  // Video Search/Selection
  const activeVideo =
    selectedAppId && selectedVideoId
      ? videos.find((v) => v.id === selectedVideoId)
      : null;

  // Handlers
  const handleOpenCreate = () => {
    setEditingVideo(null);
    setFormData({ title: "", format: "16:9", width: 1920, height: 1080 });
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
    const success = await handleSaveVideo(editingVideo, formData);
    if (success) setIsModalOpen(false);
  };

  const handleDeleteClick = (e, videoId) => {
    e.stopPropagation();
    setVideoIdToDelete(videoId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const success = await handleDeleteVideo(videoIdToDelete);
    if (success) {
      if (selectedVideoId === videoIdToDelete) router.push(pathname);
      setIsDeleteModalOpen(false);
    }
  };

  const handleFormatChange = (e) => {
    const format = e.target.value;
    const isVertical = format === "9:16";
    setFormData((prev) => ({
      ...prev,
      format,
      width: isVertical ? 1080 : 1920,
      height: isVertical ? 1920 : 1080,
    }));
  };

  const handleViewVideo = (video) => {
    router.push(
      `${pathname}?appId=${video.appId || "loyalboards"}&videoId=${video.id}`,
    );
  };

  const handleViewExports = (e, videoId) => {
    e.stopPropagation();
    setCurrentVideoId(videoId);
    setIsExportsModalOpen(true);
    fetchExports(videoId);
  };

  const handleDeleteExportClick = (e, file) => {
    e.stopPropagation();
    setExportToDelete(file);
    setIsDeleteExportModalOpen(true);
  };

  const handleConfirmDeleteExport = async () => {
    const success = await handleDeleteExport(exportToDelete.filename);
    if (success) setIsDeleteExportModalOpen(false);
  };

  if (activeVideo) {
    return (
      <div className="relative min-h-screen bg-base-200">
        <VideoContainer key={activeVideo.id} video={activeVideo} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-base-200 px-4 ${styling.general.section_padding || ""}`}
    >
      <div className={styling.general.container}>
        <VideoHeader styling={styling} onOpenCreate={handleOpenCreate} />

        <VideoFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterFormat={filterFormat}
          setFilterFormat={setFilterFormat}
          isLoading={isLoading}
        />

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loading text="Loading videos ..." />
          </div>
        ) : (
          <VideoGrid
            videos={filteredVideos}
            styling={styling}
            onView={handleViewVideo}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteClick}
            onViewExports={handleViewExports}
          />
        )}
      </div>

      <VideoCreateEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        editingVideo={editingVideo}
        isPending={isPending}
        handleFormatChange={handleFormatChange}
      />

      <VideoDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isPending={isPending}
        styling={styling}
      />

      <VideoExportsModal
        isOpen={isExportsModalOpen}
        onClose={() => setIsExportsModalOpen(false)}
        activeExport={activeExport}
        startingExport={startingExport}
        handleStartExport={() => handleStartExport(currentVideoId, styling)}
        fetchingExports={fetchingExports}
        currentExports={currentExports}
        styling={styling}
        onDeleteExport={handleDeleteExportClick}
        isDeleteModalOpen={isDeleteExportModalOpen}
        onDeleteModalClose={() => setIsDeleteExportModalOpen(false)}
        onDeleteConfirm={handleConfirmDeleteExport}
        isDeletingExport={isDeletingExport}
        exportToDelete={exportToDelete}
      />
    </div>
  );
}
