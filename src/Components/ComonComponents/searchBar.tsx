import { Input } from "../ui/input";

interface SearchBarProps {
  placeholder: string;
  setSearchString?: (value: string) => void;
}

const SearchBar = ({ placeholder, setSearchString }: SearchBarProps) => {
  return (
    <>
      <div className="bg-white">
        <Input
          className=""
          type="text"
          id="search"
          onChange={(e) => setSearchString?.(e?.target?.value as string || "")}
          placeholder={placeholder}
        />
      </div>
    </>
  );
};

export default SearchBar;
