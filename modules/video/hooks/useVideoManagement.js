import { toast } from "@/modules/general/libs/toast";
import { useCallback, useEffect, useState, useTransition } from "react";

export default function useVideoManagement() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFormat, setFilterFormat] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  // Export States
  const [activeExport, setActiveExport] = useState(null);
  const [currentExports, setCurrentExports] = useState([]);
  const [fetchingExports, setFetchingExports] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [startingExport, setStartingExport] = useState(false);
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

  const handleSaveVideo = async (editingVideo, formData) => {
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    return new Promise((resolve) => {
      startTransition(async () => {
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
            editingVideo?.slides?.length > 0
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
              return [newVideo, ...prev];
            });
            resolve(true);
          } else {
            toast.error(data.error || "Failed to save video");
            resolve(false);
          }
        } catch {
          toast.error("Network error");
          resolve(false);
        }
      });
    });
  };

  const handleDeleteVideo = async (videoId) => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const res = await fetch(`/api/video?id=${videoId}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success) {
            toast.success("Video deleted");
            setVideos((prev) => prev.filter((v) => v.id !== videoId));
            resolve(true);
          } else {
            toast.error(data.error || "Failed to delete video");
            resolve(false);
          }
        } catch {
          toast.error("Network error");
          resolve(false);
        }
      });
    });
  };

  const fetchExports = useCallback(async (videoId, silent = false) => {
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
  }, []);

  const handleStartExport = async (videoId, styling) => {
    setStartingExport(true);
    try {
      const res = await fetch("/api/video/export", {
        method: "POST",
        body: JSON.stringify({ videoId, styling }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Export started");
        setActiveExport({
          phase: "starting",
          percent: 0,
          message: "Initializing...",
        });
      } else {
        toast.error(data.error || "Failed to start export");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setStartingExport(false);
    }
  };

  const handleDeleteExport = async (filename) => {
    setIsDeletingExport(true);
    try {
      const res = await fetch(`/api/video/exports?filename=${filename}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCurrentExports((prev) =>
          prev.filter((e) => e.filename !== filename),
        );
        toast.success("Export deleted");
        return true;
      } else {
        toast.error(data.error || "Failed to delete");
        return false;
      }
    } catch {
      toast.error("Network error");
      return false;
    } finally {
      setIsDeletingExport(false);
    }
  };

  const shouldStream =
    activeExport &&
    currentVideoId &&
    activeExport.phase !== "finished" &&
    activeExport.phase !== "error";

  // Streaming logic
  useEffect(() => {
    let eventSource;
    if (shouldStream) {
      eventSource = new EventSource(
        `/api/video/exports/stream?videoId=${currentVideoId}`,
      );
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setActiveExport(data);
          if (data.phase === "finished" || data.phase === "error") {
            fetchExports(currentVideoId, true);
            eventSource.close();
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
    return () => eventSource?.close();
  }, [shouldStream, currentVideoId, fetchExports]);

  // Derived filtered videos
  const filteredVideos = videos
    .filter((video) => {
      if (
        searchQuery &&
        !video.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      if (filterFormat !== "all" && video.format !== filterFormat) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date_desc")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "date_asc")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "name_asc") return a.title.localeCompare(b.title);
      return 0;
    });

  return {
    videos,
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
  };
}
