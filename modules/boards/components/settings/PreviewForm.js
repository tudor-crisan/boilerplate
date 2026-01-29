import Button from "@/modules/general/components/button/Button";
import Label from "@/modules/general/components/common/Label";
import Title from "@/modules/general/components/common/Title";
import Input from "@/modules/general/components/input/Input";
import Textarea from "@/modules/general/components/textarea/Textarea";
import React from "react";

export default function BoardPreviewForm({ previewStyling, getVal }) {
  return (
    <div
      className={`${previewStyling.components.card} space-y-4 ${previewStyling.general.box} p-6 border border-base-200 transition-all duration-300 bg-base-100 text-base-content`}
    >
      <Title>{getVal("form.title", "Suggest a feature")}</Title>

      <div className="space-y-2">
        <Label>
          {getVal("form.inputs.title.label", "Short, descriptive title")}
        </Label>
        <Input
          placeholder={getVal("form.inputs.title.placeholder", "")}
          maxLength={getVal("form.inputs.title.maxlength", 60)}
          showCharacterCount={getVal(
            "form.inputs.title.showCharacterCount",
            true,
          )}
          readOnly
          className={previewStyling.components.input}
        />
      </div>

      <div className="space-y-2">
        <Label>{getVal("form.inputs.description.label", "Description")}</Label>
        <Textarea
          placeholder={getVal("form.inputs.description.placeholder", "")}
          rows={getVal("form.inputs.description.rows", 4)}
          maxLength={getVal("form.inputs.description.maxlength", 400)}
          showCharacterCount={getVal(
            "form.inputs.description.showCharacterCount",
            true,
          )}
          readOnly
          className={`w-full ${previewStyling.components.textarea || previewStyling.components.input}`}
        />
      </div>

      <Button variant="btn-primary">{getVal("form.button", "Add Post")}</Button>
    </div>
  );
}
