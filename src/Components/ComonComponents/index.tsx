"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "../../lib/utils";
import { Button } from "../../Components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../Components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../Components/ui/popover";

interface dropDownValues {
  value: string;
  label: string;
}
interface ComboboxProps {
  openDropdown: boolean;
  setOpenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  options: dropDownValues[];
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
}
export function Combobox({
  openDropdown,
  setOpenDropdown,
  options,
  setValue,
  value,
}: ComboboxProps) {
  return (
    <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
      <PopoverContent className="w-full p-0 z-50">
        <Command>
          <CommandInput placeholder="Search option..." className="h-9" />
          <CommandEmpty>Nothing found.</CommandEmpty>
          <CommandGroup>
            {options.map((option?) => (
              <CommandItem
                defaultValue={options[0]?.value}
                key={option?.value}
                value={option?.value}
                onSelect={(currentValue:any) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpenDropdown(!openDropdown);
                }}
              >
                {option?.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === option?.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
