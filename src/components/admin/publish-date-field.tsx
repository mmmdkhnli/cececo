"use client";

import { useState } from "react";

function toLocalDateTimeString(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function PublishDateField({ defaultValue }: { defaultValue?: Date | string | null }) {
  const [mode, setMode] = useState<"now" | "manual">(defaultValue ? "manual" : "now");
  const manualDefault = toLocalDateTimeString(defaultValue ? new Date(defaultValue) : new Date());

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-small font-semibold text-neutral-darkest">Publish date</label>
      <div className="flex gap-4">
        <label className="flex items-center gap-1.5 text-small text-neutral-darkest">
          <input
            type="radio"
            name="publishMode"
            value="now"
            checked={mode === "now"}
            onChange={() => setMode("now")}
          />
          Now
        </label>
        <label className="flex items-center gap-1.5 text-small text-neutral-darkest">
          <input
            type="radio"
            name="publishMode"
            value="manual"
            checked={mode === "manual"}
            onChange={() => setMode("manual")}
          />
          Pick manually
        </label>
      </div>
      {mode === "manual" && (
        <input
          type="datetime-local"
          name="publishedAt"
          step="1"
          defaultValue={manualDefault}
          className="admin-input"
        />
      )}
    </div>
  );
}
