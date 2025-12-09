import React, { useEffect, useRef, useState } from "react";
import "./MultiSelect.scss";

export type MultiSelectOption = {
  value: string;
  label: string;
  group?: string;
  icon?: string;
};

type MultiSelectProps = {
  options: MultiSelectOption[];
  value: MultiSelectOption[];
  onChange: (next: MultiSelectOption[]) => void;
  placeholder?: string;
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [internalOptions, setInternalOptions] = useState<MultiSelectOption[]>(options);

  const containerRef = useRef<HTMLDivElement | null>(null);

  /* ───────── Selected badge ───────── */
  const MAX_BADGES = 3;
  const visibleBadges = value.slice(0, MAX_BADGES);
  const remainingCount = value.length - MAX_BADGES;

  // labels of items that are not shown as badges
  const hiddenLabels =
    remainingCount > 0
      ? value
          .slice(MAX_BADGES)
          .map((option) => option.label)
          .join(", ")
      : "";

  /* ───────── Close on outside click ───────── */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setInputValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ───────── Sync options ───────── */
  useEffect(() => {
    setInternalOptions(options);
  }, [options]);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const isSelected = (option: MultiSelectOption) => value.some((v) => v.value === option.value);

  const handleOptionClick = (option: MultiSelectOption) => {
    if (isSelected(option)) {
      onChange(value.filter((v) => v.value !== option.value));
    } else {
      onChange([...value, option]);
    }
  };

  /* Remove from selected when clicking the x on a tag */
  const handleRemoveTag = (
    option: MultiSelectOption,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation(); // prevent toggling dropdown
    onChange(value.filter((v) => v.value !== option.value));
  };

  /* ───────── Filtering ───────── */
  const filteredOptions = internalOptions.filter((option) => {
    if (!inputValue.trim()) return true;
    const q = inputValue.toLowerCase();
    return option.label.toLowerCase().includes(q) || option.group?.toLowerCase().includes(q);
  });

  /* ───────── Handle Enter to create-select option ───────── */
  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== "Enter") return;

    const label = inputValue.trim();
    if (!label) return;

    const normalized = label.toLowerCase();

    const existing = internalOptions.find((opt) => opt.label.toLowerCase() === normalized);

    if (existing) {
      if (!isSelected(existing)) {
        onChange([...value, existing]);
      }
      setInputValue("");
      return;
    }

    // Create a new option
    const newOption: MultiSelectOption = {
      value: normalized.replace(/\s+/g, "-"), // simple slug
      label,
    };

    setInternalOptions((prev) => [...prev, newOption]);
    onChange([...value, newOption]);
    setInputValue("");
  };

  return (
    <div className="multi-select" ref={containerRef}>
      <button
        type="button"
        className={`multi-select__trigger ${isOpen ? "multi-select__trigger--open" : ""}`}
        onClick={toggleOpen}
      >
        {value.length === 0 ? (
          <span className="multi-select__placeholder">{placeholder}</span>
        ) : (
          <div className="multi-select__tags">
            {visibleBadges.map((option) => (
              <span key={option.value} className="multi-select__tag">
                {option.icon && <span className="multi-select__tag-icon">{option.icon}</span>}
                <span className="multi-select__tag-label">{option.label}</span>

                <button
                  type="button"
                  className="multi-select__tag-remove"
                  onClick={(event) => handleRemoveTag(option, event)}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </span>
            ))}

            {remainingCount > 0 && (
              <span title={hiddenLabels} className="multi-select__tag multi-select__tag--more">
                +{remainingCount} more
              </span>
            )}
          </div>
        )}

        <i
          className={`fa-solid fa-chevron-down multi-select__arrow ${
            isOpen ? "multi-select__arrow--open" : ""
          }`}
        />
      </button>

      {/* ───────── menu ───────── */}
      {isOpen && (
        <div className="multi-select__menu">
          {/* Search / Add input */}
          <div className="multi-select__input-wrapper">
            <input
              className="multi-select__input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search or add..."
            />
          </div>

          {/* Options */}
          <div className="multi-select__options">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`multi-select__option ${
                  isSelected(option) ? "multi-select__option--selected" : ""
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <span className="multi-select__option-label">
                  {option.label} {option.icon ?? ""}
                </span>

                {isSelected(option) && <i className="fa-solid fa-check multi-select__check" />}
              </div>
            ))}

            {filteredOptions.length === 0 && (
              <div className="multi-select__no-results">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
