import Button from "@/modules/general/components/button/Button";
import Label from "@/modules/general/components/common/Label";
import Loading from "@/modules/general/components/common/Loading";
import Modal from "@/modules/general/components/common/Modal";
import Paragraph from "@/modules/general/components/common/Paragraph";
import ProgressBar from "@/modules/general/components/common/ProgressBar";
import TextSmall from "@/modules/general/components/common/TextSmall";
import Title from "@/modules/general/components/common/Title";
import SvgTrash from "@/modules/general/components/svg/SvgTrash";

export default function VideoExportsModal({
  isOpen,
  onClose,
  activeExport,
  startingExport,
  handleStartExport,
  fetchingExports,
  currentExports,
  styling,
  onDeleteExport,
  // Confirm Delete Export Modal Props
  isDeleteModalOpen,
  onDeleteModalClose,
  onDeleteConfirm,
  isDeletingExport,
  exportToDelete,
}) {
  return (
    <>
      <Modal
        isModalOpen={isOpen}
        onClose={() => {
          // Pause all videos inside the modal before closing
          const modalVideos = document.querySelectorAll(".exports-modal-video");
          modalVideos.forEach((v) => v.pause());
          onClose();
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
                <TextSmall>
                  Click &quot;Start New Export&quot; to create one.
                </TextSmall>
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
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-64 aspect-video bg-black rounded-lg overflow-hidden relative group">
                    <video
                      src={`/exports/${file.filename}`}
                      className="w-full h-full object-contain exports-modal-video"
                      controls
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Title tag="h4" className="text-lg font-bold mb-1">
                          {file.filename}
                        </Title>
                        <Button
                          onClick={(e) => onDeleteExport(e, file)}
                          variant="btn-ghost btn-square"
                          size="btn-sm"
                          className="text-error"
                          title="Delete Export"
                        >
                          <SvgTrash />
                        </Button>
                      </div>
                      <TextSmall className="opacity-60 mb-4 block">
                        Generated on {new Date(file.createdAt).toLocaleString()}
                      </TextSmall>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`/exports/${file.filename}`}
                        download
                        className="btn btn-primary btn-sm flex-1"
                      >
                        Download (.mp4)
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Internal Delete Confirmation Modal */}
      <Modal
        isModalOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        title="Delete Export"
        actions={
          <div className="flex gap-2">
            <Button
              variant="btn-ghost"
              onClick={onDeleteModalClose}
              disabled={isDeletingExport}
            >
              Cancel
            </Button>
            <Button
              variant="btn-error"
              onClick={onDeleteConfirm}
              isLoading={isDeletingExport}
              disabled={isDeletingExport}
            >
              Delete File
            </Button>
          </div>
        }
      >
        <Paragraph>
          Are you sure you want to delete{" "}
          <strong>{exportToDelete?.filename}</strong>? This action cannot be
          undone and will permanently remove the file from the server.
        </Paragraph>
      </Modal>
    </>
  );
}
