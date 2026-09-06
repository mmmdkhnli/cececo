"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Calendar } from "@/components/admin/ui/calendar";
import { Input } from "@/components/admin/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/admin/ui/popover";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseTypedDate(value: string): Date | undefined {
  if (!DATE_PATTERN.test(value)) return undefined;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function DatePicker({
  name,
  defaultValue,
  placeholder = "YYYY-MM-DD",
}: {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  const initial = defaultValue ? new Date(defaultValue) : undefined;
  const [date, setDate] = useState<Date | undefined>(initial);
  const [text, setText] = useState(initial ? format(initial, "yyyy-MM-dd") : "");
  const [open, setOpen] = useState(false);

  function handleTextChange(value: string) {
    setText(value);
    if (!value) {
      setDate(undefined);
      return;
    }
    const parsed = parseTypedDate(value);
    if (parsed) setDate(parsed);
  }

  function handleCalendarSelect(next: Date | undefined) {
    setDate(next);
    setText(next ? format(next, "yyyy-MM-dd") : "");
    setOpen(false);
  }

  return (
    <div className="flex gap-2">
      <input type="hidden" name={name} value={date ? format(date, "yyyy-MM-dd") : ""} />
      <Input
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
        inputMode="numeric"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" size="icon" aria-label="Pick a date from the calendar">
            <CalendarIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar mode="single" selected={date} onSelect={handleCalendarSelect} autoFocus />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function DateTimePicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const initial = defaultValue ? new Date(defaultValue) : new Date();
  const [date, setDate] = useState<Date>(initial);
  const [dateText, setDateText] = useState(format(initial, "yyyy-MM-dd"));
  const [time, setTime] = useState(format(initial, "HH:mm:ss"));
  const [open, setOpen] = useState(false);

  const [h, m, s] = time.split(":").map((v) => Number(v) || 0);
  const combined = new Date(date);
  combined.setHours(h, m, s, 0);

  function handleDateTextChange(value: string) {
    setDateText(value);
    const parsed = parseTypedDate(value);
    if (parsed) setDate(parsed);
  }

  function handleCalendarSelect(next: Date | undefined) {
    if (!next) return;
    setDate(next);
    setDateText(format(next, "yyyy-MM-dd"));
    setOpen(false);
  }

  return (
    <>
      <input type="hidden" name={name} value={format(combined, "yyyy-MM-dd'T'HH:mm:ss")} />
      <div className="flex gap-2">
        <Input
          value={dateText}
          onChange={(e) => handleDateTextChange(e.target.value)}
          placeholder="YYYY-MM-DD"
          className="flex-1"
          inputMode="numeric"
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="icon" aria-label="Pick a date from the calendar">
              <CalendarIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={date} onSelect={handleCalendarSelect} autoFocus />
          </PopoverContent>
        </Popover>
        <Input
          type="time"
          step="1"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-32"
        />
      </div>
    </>
  );
}
