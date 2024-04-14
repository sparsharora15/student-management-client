import { Calendar as CalendarIcon } from "lucide-react";
import { addDays, isBefore, format } from 'date-fns';
import { Button } from "../../Components/ui/button";
import { Calendar } from "../../Components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../Components/ui/popover";
import { cn } from "../../lib/utils";
import { addOneDay } from "../../Utils/helper";
// import { addOneDay } from "@/helper-functions/utils";
export function DatePicker({ date, onSelect }: any) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-full flex border justify-between  text-left text-[black] font-normal hover:bg-[white] bg-[white] rounded-[6px] ",
            !date && "text-muted-foreground justify-end"
          )}
        >
          {date ? format(date, "PPP") : ""}
          <CalendarIcon className={`h-4 w-4`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate : Date | undefined) => {
            // if (!isBefore(newDate, new Date())) {
              onSelect(newDate);
            // }
          }}
          initialFocus
          // @ts-ignore 
          maxDate={addOneDay(new Date())}
          minDate={new Date()} 
          // modifiers={{
          //   disabled: { before: addOneDay(new Date()) },
          //   today: { after: new Date(), before: addOneDay(new Date()) },
          //   highlighted: { after: addOneDay(new Date()) }, 
          // }}
        />
      </PopoverContent>
    </Popover>
  );
}


