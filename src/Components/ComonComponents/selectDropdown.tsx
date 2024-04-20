import React from "react";
import Select from "react-select";

interface Option {
  value: any;
  label: string;
}

interface SelectDropdownProps {
  defaultValue?: Option;
  onChange: (selectedOption: Option | null) => void;
  options: Option[];
  value: Option | null;
  placeholder?: string;
  isMulti?: boolean;
}

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    boxShadow: state.isFocused ? null : null,
    borderColor: "none",
    overflow: "visible",
    borderRadius: "6px",
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    padding: 0,
    color: "black",
  }),
};

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  defaultValue,
  onChange,
  options,
  value,
  placeholder,
  isMulti,
}) => {
  return (
    <div className="w-full mt-1">
      {isMulti ? (
        <Select
          menuPlacement="auto"
          isMulti
          defaultValue={defaultValue}
          options={options}
          value={value}
          // @ts-ignore
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <Select
          menuPlacement="auto"
          // styles={customStyles}
          // menuPosition="absolute"
          defaultValue={defaultValue}
          options={options}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default SelectDropdown;
