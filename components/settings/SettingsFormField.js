"use client";

import Input from "@/components/input/Input";
import InputCheckbox from "@/components/input/InputCheckbox";
import Label from "@/components/common/Label";
import TextSmall from "@/components/common/TextSmall";
import { SettingsContainer, SettingsItem, SettingsRow } from "@/components/settings/SettingsLayout";

const SettingsFormField = ({
  getVal,
  handleChange,
  disabled,
  prefix,
  config = {}
}) => {
  // Config defaults
  const {
    showRows = false,
    showCountToggle = true,
    maxLengthConfig = { min: 10, max: 100, default: 60 },
    rowsConfig = { min: 2, max: 10, default: 4 },
    labelConfig = { maxLength: 50 },
    placeholderConfig = { maxLength: 100 }
  } = config;

  return (
    <SettingsContainer>
      <SettingsItem>
        <Label>Label</Label>
        <Input
          value={getVal(`${prefix}.label`, "")}
          onChange={(e) => handleChange(`${prefix}.label`, e.target.value)}
          disabled={disabled}
          maxLength={labelConfig.maxLength}
          showCharacterCount={true}
        />
      </SettingsItem>
      <SettingsItem>
        <Label>Placeholder</Label>
        <Input
          value={getVal(`${prefix}.placeholder`, "")}
          onChange={(e) => handleChange(`${prefix}.placeholder`, e.target.value)}
          disabled={disabled}
          maxLength={placeholderConfig.maxLength}
          showCharacterCount={true}
        />
      </SettingsItem>
      <SettingsRow>
        <SettingsItem>
          <Label>Max Length</Label>
          <Input
            type="number"
            value={getVal(`${prefix}.maxlength`, maxLengthConfig.default)}
            onChange={(e) => {
              let val = parseInt(e.target.value) || 0;
              if (val > maxLengthConfig.max) val = maxLengthConfig.max;
              handleChange(`${prefix}.maxlength`, val);
            }}
            min={maxLengthConfig.min}
            max={maxLengthConfig.max}
            disabled={disabled}
          />
          <TextSmall className="mt-1">Min: {maxLengthConfig.min}, Max: {maxLengthConfig.max}</TextSmall>
        </SettingsItem>

        {showRows && (
          <SettingsItem>
            <Label>Rows</Label>
            <Input
              type="number"
              value={getVal(`${prefix}.rows`, rowsConfig.default)}
              onChange={(e) => {
                let val = parseInt(e.target.value) || 0;
                if (val > rowsConfig.max) val = rowsConfig.max;
                handleChange(`${prefix}.rows`, val);
              }}
              min={rowsConfig.min}
              max={rowsConfig.max}
              disabled={disabled}
            />
            <TextSmall className="mt-1">Min: {rowsConfig.min}, Max: {rowsConfig.max}</TextSmall>
          </SettingsItem>
        )}

        {showCountToggle && !showRows && (
          <InputCheckbox
            label="Show Count"
            value={getVal(`${prefix}.showCharacterCount`, true)}
            onChange={(checked) => handleChange(`${prefix}.showCharacterCount`, checked)}
            className="pb-3"
            disabled={disabled}
          />
        )}
      </SettingsRow>

      {showCountToggle && showRows && (
        <InputCheckbox
          label="Show Character Count"
          value={getVal(`${prefix}.showCharacterCount`, true)}
          onChange={(checked) => handleChange(`${prefix}.showCharacterCount`, checked)}
          className="pt-2"
          disabled={disabled}
        />
      )}
    </SettingsContainer>
  );
};

export default SettingsFormField;
