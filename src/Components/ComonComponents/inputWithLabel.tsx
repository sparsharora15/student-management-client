import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";

interface InputWithLabelProps {
  label: string;
  type: string;
  placeholder: string;
}
export function InputWithLabel({
  label,
  type,
  placeholder,
}: InputWithLabelProps) {
  return (
    <div className="w-full max-w-sm items-center gap-1.5">
      <Label className="font-semibold text-[#0F172A]" htmlFor={type}>
        {label}
      </Label>
      <Input type={type} id={type} placeholder={placeholder} />
    </div>
  );
}