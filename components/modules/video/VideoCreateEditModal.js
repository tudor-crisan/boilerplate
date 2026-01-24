import Button from "@/components/button/Button";
import Label from "@/components/common/Label";
import Modal from "@/components/common/Modal";
import Input from "@/components/input/Input";
import Select from "@/components/select/Select";
import Textarea from "@/components/textarea/Textarea";

export default function VideoCreateEditModal({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  editingVideo,
  isPending,
  handleFormatChange,
}) {
  return (
    <Modal
      isModalOpen={isOpen}
      onClose={onClose}
      title={editingVideo ? "Edit Video" : "Create New Video"}
      actions={
        <div className="flex gap-2">
          <Button variant="btn-ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="btn-primary"
            onClick={onSave}
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
            <Input type="number" value={formData.width} disabled={true} />
          </div>
          <div>
            <Label className="mb-2">Height</Label>
            <Input type="number" value={formData.height} disabled={true} />
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
  );
}
