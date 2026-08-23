"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Calendar } from "@/components/admin/ui/calendar";
import { Input } from "@/components/admin/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/admin/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  name,
  defaultValue,
  placeholder = "Pick a date",
}: {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  const [date, setDate] = useState<Date | undefined>(defaultValue ? new Date(defaultValue) : undefined);

  return (
    <>
      <input type="hidden" name={name} value={date ? format(date, "yyyy-MM-dd") : ""} />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-start font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="size-4" />
            {date ? format(date, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} autoFocus />
        </PopoverContent>
      </Popover>
    </>
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
  const [time, setTime] = useState(format(initial, "HH:mm:ss"));

  const [h, m, s] = time.split(":").map((v) => Number(v) || 0);
  const combined = new Date(date);
  combined.setHours(h, m, s, 0);

  return (
    <>
      <input type="hidden" name={name} value={format(combined, "yyyy-MM-dd'T'HH:mm:ss")} />
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="flex-1 justify-start font-normal">
              <CalendarIcon className="size-4" />
              {format(date, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} autoFocus />
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
