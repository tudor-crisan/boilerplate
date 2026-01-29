import Button from "@/modules/general/components/button/Button";
import Label from "@/modules/general/components/common/Label";
import Modal from "@/modules/general/components/common/Modal";
import ProfileImage from "@/modules/general/components/common/ProfileImage";
import Title from "@/modules/general/components/common/Title";
import Tooltip from "@/modules/general/components/common/Tooltip";
import Upload from "@/modules/general/components/common/Upload";
import Input from "@/modules/general/components/input/Input";
import SettingsAppearance from "@/modules/general/components/settings/SettingsAppearance";
import SettingsRandomizer from "@/modules/general/components/settings/SettingsRandomizer";
import { appStyling, defaultStyling } from "@/modules/general/libs/defaults";
import { deepMerge } from "@/modules/general/libs/merge.mjs";
import { getNameInitials } from "@/modules/general/libs/utils.client";

export default function DashboardProfileEditModal({
  isModalOpen,
  onClose,
  isLoading,
  onSave,
  inputs,
  handleChange,
  styling,
  setStyling,
  email,
  initials,
  onFileSelect,
  shuffleConfig,
  setShuffleConfig,
  handleShuffle,
}) {
  return (
    <Modal
      isModalOpen={isModalOpen}
      onClose={onClose}
      title="Edit Profile"
      actions={
        <>
          <Button className="btn-ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onSave} isLoading={isLoading}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className={styling.flex.center}>
          <ProfileImage
            initials={getNameInitials(inputs.name) || initials}
            src={inputs.image}
            size="xl"
          />
        </div>

        <Upload onFileSelect={onFileSelect} />

        {inputs.image && (
          <div className={styling.flex.center}>
            <button
              type="button"
              onClick={() => handleChange("image", "")}
              className={styling.components.link}
            >
              Remove Image
            </button>
          </div>
        )}

        <div className="w-full space-y-3">
          <div className="space-y-1">
            <Label>Email</Label>
            <Tooltip text="Email address can't be edited">
              <Input
                type="email"
                value={email}
                disabled={true}
                placeholder="your@email.com"
              />
            </Tooltip>
          </div>
        </div>

        <div className="w-full space-y-3">
          <div className="space-y-1">
            <Label>Display Name</Label>
            <Input
              required
              type="text"
              value={inputs.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Your Name"
              maxLength={30}
              showCharacterCount
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="w-full space-y-6 pt-4 border-t border-base-200">
          <Title>Appearance</Title>
          <SettingsAppearance
            styling={styling}
            onChange={setStyling}
            isLoading={isLoading}
          />
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => setStyling(deepMerge(defaultStyling, appStyling))}
              className="text-xs text-base-content/50 hover:text-base-content transition-colors underline cursor-pointer"
            >
              Reset to default
            </button>
          </div>
        </div>

        <div className="w-full space-y-6 pt-4 border-t border-base-200">
          <SettingsRandomizer
            title={<Title>Randomizer</Title>}
            config={shuffleConfig}
            onConfigChange={(key, val) =>
              setShuffleConfig((prev) => ({ ...prev, [key]: val }))
            }
            onShuffle={handleShuffle}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
}
