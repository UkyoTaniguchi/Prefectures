import React from "react";

type LabelProps = {
  value: string;
  label: string;
  selected: boolean;
  onChange: (value: string) => void;
};

export default function Label({
  value,
  label,
  selected,
  onChange,
}: LabelProps) {
  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        name="population"
        value={value}
        onChange={() => onChange(value)}
        checked={selected}
      />
      {label}
    </label>
  );
}
