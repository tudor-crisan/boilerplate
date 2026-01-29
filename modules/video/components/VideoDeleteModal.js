import Button from "@/modules/general/components/button/Button";
import Modal from "@/modules/general/components/common/Modal";
import Paragraph from "@/modules/general/components/common/Paragraph";

export default function VideoDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  styling,
}) {
  return (
    <Modal
      isModalOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
      contentClassName="p-0! pb-2!"
      actions={
        <>
          <Button className="btn-ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="btn-error btn-outline"
            onClick={onConfirm}
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
  );
}
