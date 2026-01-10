"use client";

export default function InputCheckbox({
  label,
  value,
  onChange,
  className = "",
  ...props
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="flex items-center gap-2 cursor-pointer touch-action-manipulation">
        <input
          type="checkbox"
          className="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          {...props}
        />
        {label && <span className="text-sm">{label}</span>}
      </label>
    </div>
  );
}
