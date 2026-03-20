/**
 * DateRangePicker — modern date picker supporting single date and date range.
 * Uses the existing shadcn/ui Calendar component.
 * Usage:
 *   <DateRangePicker value={range} onChange={setRange} />
 *   <DateRangePicker mode="single" value={date} onChange={setDate} />
 */
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Single date ───────────────────────────────────────────────────────────────
interface SingleProps {
  mode: "single";
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
  className?: string;
}

// ── Date range ────────────────────────────────────────────────────────────────
interface RangeProps {
  mode?: "range";
  value?: DateRange;
  onChange: (range?: DateRange) => void;
  placeholder?: string;
  className?: string;
}

type DateRangePickerProps = SingleProps | RangeProps;

export function DateRangePicker(props: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const { mode = "range", placeholder = "Pick a date", className } = props;

  // ── Derived display label ─────────────────────────────────────────────────
  let label = placeholder;
  if (mode === "single") {
    const p = props as SingleProps;
    if (p.value) label = format(p.value, "dd MMM yyyy");
  } else {
    const p = props as RangeProps;
    if (p.value?.from && p.value?.to) {
      label = `${format(p.value.from, "dd MMM")} – ${format(p.value.to, "dd MMM yyyy")}`;
    } else if (p.value?.from) {
      label = format(p.value.from, "dd MMM yyyy");
    }
  }

  const hasValue = mode === "single"
    ? !!(props as SingleProps).value
    : !!(props as RangeProps).value?.from;

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    if (mode === "single") (props as SingleProps).onChange(undefined);
    else (props as RangeProps).onChange(undefined);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal min-w-[160px] h-9 px-3 gap-2",
            !hasValue && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 opacity-60" />
          <span className="flex-1 truncate">{label}</span>
          {hasValue && (
            <span onClick={handleClear} className="ml-auto opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 shadow-xl border-slate-200 rounded-2xl overflow-hidden" align="start">
        {mode === "single" ? (
          <Calendar
            mode="single"
            selected={(props as SingleProps).value}
            onSelect={(d) => {
              (props as SingleProps).onChange(d);
              setOpen(false);
            }}
            initialFocus
            className="rounded-2xl"
          />
        ) : (
          <Calendar
            mode="range"
            selected={(props as RangeProps).value}
            onSelect={(r) => {
              (props as RangeProps).onChange(r);
              if (r?.from && r?.to) setOpen(false);
            }}
            numberOfMonths={2}
            initialFocus
            className="rounded-2xl"
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

export type { DateRange };
