import React from "react";
import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

// Components
const VideoCard = (await import("../../../components/modules/video/VideoCard"))
  .default;
const VideoGrid = (await import("../../../components/modules/video/VideoGrid"))
  .default;
const VideoFilter = (
  await import("../../../components/modules/video/VideoFilter")
).default;

describe("Video Module UI", () => {
  const mockStyling = {
    components: { card: "card-class", element: "el-class", header: "h-class" },
  };
  const mockVideo = {
    id: "v1",
    title: "Project Alpha",
    format: "16:9",
    width: 1920,
    height: 1080,
    slides: [1, 2],
    createdAt: new Date().toISOString(),
  };

  describe("VideoCard", () => {
    it("should render title and metadata", () => {
      render(
        <VideoCard
          video={mockVideo}
          styling={mockStyling}
          onView={jest.fn()}
        />,
      );
      expect(screen.getByText("Project Alpha")).toBeTruthy();
      expect(screen.getByText("16:9")).toBeTruthy();
      expect(screen.getByText("2 slides")).toBeTruthy();
    });

    it("should trigger onView on click", () => {
      const onView = jest.fn();
      render(
        <VideoCard video={mockVideo} styling={mockStyling} onView={onView} />,
      );
      fireEvent.click(screen.getByTitle("View"));
      expect(onView).toHaveBeenCalledWith(mockVideo);
    });
  });

  describe("VideoGrid", () => {
    it("should render multiple cards and count", () => {
      render(<VideoGrid videos={[mockVideo]} styling={mockStyling} />);
      expect(screen.getByText("All Videos (1)")).toBeTruthy();
    });

    it("should show empty state if no videos", () => {
      render(<VideoGrid videos={[]} styling={mockStyling} />);
      expect(screen.getByText("No videos match your filters.")).toBeTruthy();
    });
  });

  describe("VideoFilter", () => {
    it("should render filter controls", () => {
      render(<VideoFilter searchQuery="" filterFormat="all" />);
      expect(screen.getByPlaceholderText("Search videos...")).toBeTruthy();
      expect(screen.getByText("All Formats")).toBeTruthy();
    });
  });
});
