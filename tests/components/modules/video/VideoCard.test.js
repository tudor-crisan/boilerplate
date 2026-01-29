import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

describe("components/modules/video/VideoCard", () => {
  let VideoCard;

  const mockVideo = {
    id: "video-1",
    title: "Test Video",
    format: "16:9",
    slides: [{}, {}, {}],
    width: 1920,
    height: 1080,
    createdAt: new Date("2024-01-01"),
  };

  const mockStyling = {
    components: {
      card: "card",
      element: "element-class",
    },
  };

  beforeAll(async () => {
    jest.unstable_mockModule("@/modules/general/components/button/Button", () => ({
      default: ({ children, onClick, ...props }) => (
        <button onClick={onClick} {...props}>
          {children}
        </button>
      ),
    }));

    jest.unstable_mockModule("@/modules/general/components/common/TextSmall", () => ({
      default: ({ children, ...props }) => <small {...props}>{children}</small>,
    }));

    jest.unstable_mockModule("@/modules/general/components/common/Title", () => ({
      default: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    }));

    jest.unstable_mockModule("@/modules/general/components/svg/SvgEdit", () => ({
      default: () => <span>Edit Icon</span>,
    }));

    jest.unstable_mockModule("@/modules/general/components/svg/SvgTrash", () => ({
      default: () => <span>Trash Icon</span>,
    }));

    jest.unstable_mockModule("@/modules/general/components/svg/SvgView", () => ({
      default: () => <span>View Icon</span>,
    }));

    jest.unstable_mockModule("@/modules/general/libs/utils.client", () => ({
      formattedDate: (date) => date.toISOString().split("T")[0],
    }));

    VideoCard = (await import("@/modules/video/components/VideoCard")).default;
  });

  it("should render video card with all information", () => {
    render(
      <VideoCard
        video={mockVideo}
        styling={mockStyling}
        onView={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onViewExports={jest.fn()}
      />,
    );

    expect(screen.getByText("Test Video")).toBeTruthy();
    expect(screen.getByText("16:9")).toBeTruthy();
    expect(screen.getByText("3 slides")).toBeTruthy();
    expect(screen.getByText("1920x1080")).toBeTruthy();
  });

  it("should call onView when card is clicked", () => {
    const onView = jest.fn();
    const { container } = render(
      <VideoCard
        video={mockVideo}
        styling={mockStyling}
        onView={onView}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onViewExports={jest.fn()}
      />,
    );

    const card = container.querySelector('[role="button"]');
    fireEvent.click(card);
    expect(onView).toHaveBeenCalledWith(mockVideo);
  });

  it("should call onEdit when edit button is clicked", () => {
    const onEdit = jest.fn();
    render(
      <VideoCard
        video={mockVideo}
        styling={mockStyling}
        onView={jest.fn()}
        onEdit={onEdit}
        onDelete={jest.fn()}
        onViewExports={jest.fn()}
      />,
    );

    const editButton = screen.getByTitle("Edit");
    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalled();
  });

  it("should call onDelete when delete button is clicked", () => {
    const onDelete = jest.fn();
    render(
      <VideoCard
        video={mockVideo}
        styling={mockStyling}
        onView={jest.fn()}
        onEdit={jest.fn()}
        onDelete={onDelete}
        onViewExports={jest.fn()}
      />,
    );

    const deleteButton = screen.getByTitle("Delete");
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalled();
  });

  it("should call onViewExports when exports button is clicked", () => {
    const onViewExports = jest.fn();
    render(
      <VideoCard
        video={mockVideo}
        styling={mockStyling}
        onView={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onViewExports={onViewExports}
      />,
    );

    const exportsButton = screen.getByText("Exports");
    fireEvent.click(exportsButton);
    expect(onViewExports).toHaveBeenCalled();
  });

  it("should display 0 slides when slides array is empty", () => {
    const videoWithoutSlides = { ...mockVideo, slides: [] };
    render(
      <VideoCard
        video={videoWithoutSlides}
        styling={mockStyling}
        onView={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onViewExports={jest.fn()}
      />,
    );

    expect(screen.getByText("0 slides")).toBeTruthy();
  });
});
