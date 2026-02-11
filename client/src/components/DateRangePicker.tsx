"use client";

import { useState } from "react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface Props {
  onSelect: (range: { startDate: string; endDate: string }) => void;
}


export default function DateRangePicker({ onSelect }: Props) {
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);


  const handleChange = (ranges: RangeKeyDict) => {
    setRange([ranges.selection]);
    onSelect({
      startDate: ranges.selection.startDate!.toISOString().split("T")[0],
      endDate: ranges.selection.endDate!.toISOString().split("T")[0],
    });
  };

  return (
    <div className="shadow rounded-lg overflow-hidden">
      <DateRange
        ranges={range}
        onChange={handleChange}
        moveRangeOnFirstSelection={false}
        editableDateInputs
        minDate={new Date()}
        showPreview={true}
        rangeColors={["#000"]}
      />
    </div>
  );
}
